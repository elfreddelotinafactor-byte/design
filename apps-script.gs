/**
 * Brendon & Carla — RSVP to Google Sheets
 *
 * How to deploy:
 *  1. Open https://script.google.com/ → New project.
 *  2. Delete the default code and paste everything in this file.
 *  3. Click the gear icon (Project Settings) and note the Script ID.
 *  4. Click Deploy → New deployment → Web app.
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Click Deploy → copy the Web App URL.
 *  6. Paste that URL into firebase-config.js → window.__SHEETS_URL.
 *
 * The script creates two sheets automatically:
 *  - "RSVPs"     — one row per RSVP submission
 *  - "Log"       — raw JSON log of every request (useful for debugging)
 */

const SHEET_NAME = "RSVPs";
const LOG_NAME   = "Log";

// ─── Columns in the RSVPs sheet ───────────────────────────────────────────────
const HEADERS = ["Timestamp", "Name", "Email", "Attendance", "Guests", "Notes"];

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold")
      .setBackground("#b8912e")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
}

// ─── Handle POST (RSVP submission from the website) ───────────────────────────
function doPost(e) {
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const rsvpSheet = getOrCreateSheet(ss, SHEET_NAME);
  const logSheet  = getOrCreateSheet(ss, LOG_NAME);

  ensureHeaders(rsvpSheet);

  try {
    const raw  = e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    // Log the raw request
    logSheet.appendRow([new Date().toISOString(), raw]);

    const row = [
      new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
      data.name       || "",
      data.email      || "",
      data.attendance || "",
      data.guests     || 1,
      data.notes      || "",
    ];

    rsvpSheet.appendRow(row);

    return jsonResponse({ result: "success" });
  } catch (err) {
    logSheet.appendRow([new Date().toISOString(), "ERROR: " + err.toString()]);
    return jsonResponse({ result: "error", error: err.toString() }, 500);
  }
}

// ─── Handle GET (stats + CSV export for the admin page) ───────────────────────
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "stats";
  const ss     = SpreadsheetApp.getActiveSpreadsheet();

  if (action === "csv") {
    return csvResponse(ss);
  }

  return statsResponse(ss);
}

function statsResponse(ss) {
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) {
    return jsonResponse({ total: 0, yes: 0, no: 0, guests: 0 });
  }

  const data  = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  let yes = 0, no = 0, guests = 0;
  data.forEach(row => {
    if (row[3] === "yes")      { yes++;   guests += Number(row[4]) || 1; }
    else if (row[3] === "no")  { no++; }
  });

  return jsonResponse({ total: yes + no, yes, no, guests });
}

function csvResponse(ss) {
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    return ContentService.createTextOutput("No RSVPs yet.")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  const rows   = sheet.getDataRange().getValues();
  const csv    = rows.map(row =>
    row.map(cell => {
      const s = String(cell).replace(/"/g, '""');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    }).join(",")
  ).join("\n");

  return ContentService.createTextOutput(csv)
    .setMimeType(ContentService.MimeType.TEXT);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function jsonResponse(obj, status) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
