// ─────────────────────────────────────────────────────────────────────────────
//  STEP 1 — Firebase (for the Guestbook)
//
//  1. Go to https://console.firebase.google.com/ and create a new project.
//  2. Add a Web app (</> icon) — copy the config object below.
//  3. In Build → Firestore Database → Create database (production mode).
//  4. Paste the Firestore security rules from firestore.rules into the Rules tab.
//  5. Replace every REPLACE_ME below with your actual values.
// ─────────────────────────────────────────────────────────────────────────────

window.__FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCeDTxyQKlJ2OQuJSXDfJi0AtKOLjt96YY",
  authDomain:        "brendon-carla.firebaseapp.com",
  projectId:         "brendon-carla",
  storageBucket:     "brendon-carla.firebasestorage.app",
  messagingSenderId: "389331576864",
  appId:             "1:389331576864:web:c1bd14c6fb8a6e56c33445"
};



// ─────────────────────────────────────────────────────────────────────────────
//  STEP 2 — Google Sheets (for the RSVP form)
//
//  1. Follow the instructions in README.md to deploy apps-script.gs.
//  2. After deploying, copy the Web App URL and paste it below.
//     It looks like: https://script.google.com/macros/s/XXXX.../exec
// ─────────────────────────────────────────────────────────────────────────────

window.__SHEETS_URL = "https://script.google.com/macros/s/AKfycbxSmAk2QLxtLluMrNTtiIfawbnF7V-IAWdQnQkokIdNPPzTOiq0F7g2QuKtYGNJHw9I0g/exec";


// ─────────────────────────────────────────────────────────────────────────────
//  Admin passphrase for /admin.html
//  Change this before deploying — it gates the admin dashboard.
// ─────────────────────────────────────────────────────────────────────────────

window.__ADMIN_PASSPHRASE = "Goose2024";
