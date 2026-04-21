# Brendon & Carla — Wedding Website

A live wedding site with:
- **Guestbook** — messages stored in Firebase Firestore, visible live on the site
- **RSVP form** — submissions go directly to a Google Sheet
- **Admin dashboard** — passphrase-gated page to view guestbook + RSVP stats + export CSV

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Public wedding site |
| `admin.html` | Admin dashboard |
| `firebase-config.js` | Your keys — edit this file |
| `firestore.rules` | Paste into Firebase console |
| `apps-script.gs` | Paste into Google Apps Script |

---

## Setup — Part 1: Google Sheets (RSVP)

### 1. Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like **Brendon & Carla RSVPs**.

### 2. Open Apps Script
1. In the spreadsheet, click **Extensions → Apps Script**.
2. Delete the default `function myFunction()` code.
3. Copy everything from `apps-script.gs` and paste it in.
4. Click **Save** (floppy disk icon). Name the project anything you like.

### 3. Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Copy the **Web App URL** — it looks like:
   `https://script.google.com/macros/s/XXXXXXXXXXXXXXX/exec`

### 4. Paste the URL into the config
Open `firebase-config.js` and replace the second `REPLACE_ME`:

```js
window.__SHEETS_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
```

> Every RSVP submission will now create a new row in the **RSVPs** sheet automatically.
> A **Log** sheet is also created for debugging.

---

## Setup — Part 2: Firebase (Guestbook)

### 1. Create a Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com/).
2. Click **Add project** → name it (e.g. `brendon-carla`). Skip Analytics.
3. Click the web icon **`</>`** to add a web app. Copy the `firebaseConfig` object.

### 2. Enable Firestore
1. In the left nav: **Build → Firestore Database → Create database**.
2. Choose **production mode** and pick region `asia-southeast1` (closest to Davao).

### 3. Set security rules
1. Go to **Firestore → Rules** tab.
2. Replace the default rules with everything in `firestore.rules`.
3. Click **Publish**.

### 4. Paste the config
Open `firebase-config.js` and replace the first block of `REPLACE_ME` values:

```js
window.__FIREBASE_CONFIG = {
  apiKey:            "AIza...",
  authDomain:        "brendon-carla.firebaseapp.com",
  projectId:         "brendon-carla",
  storageBucket:     "brendon-carla.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

---

## Setup — Part 3: Admin passphrase

In `firebase-config.js`, change the passphrase to something only you know:

```js
window.__ADMIN_PASSPHRASE = "your-secret-phrase";
```

Access the admin page at `/admin.html` on your live site.

---

## Deploy the website (free)

### Option A — Netlify (easiest, drag-and-drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the entire **Wedding Invitation Website** folder onto the page.
3. You'll get a URL like `https://random-name.netlify.app` instantly.
4. **Custom domain:** Site settings → Domain management → Add custom domain.

### Option B — Cloudflare Pages (GitHub, free CDN)
1. Push the folder to a GitHub repository.
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → Create project → Connect to Git.
3. Framework: **None**, build command: *(leave blank)*, output dir: `/`.
4. Deploy. Custom domain via **Custom domains** tab.

### Option C — Vercel
1. Push to GitHub.
2. Import at [vercel.com](https://vercel.com). Framework: **Other**, no build command.

---

## Admin dashboard

Navigate to `/admin.html` and enter your passphrase. You'll see:

- **Stats:** Total RSVPs · Attending · Declined · Total guests
- **Export CSV:** Downloads all RSVPs for the caterer / seating chart
- **Guestbook:** All messages, searchable, in real time

---

## Adding photos to the gallery

Replace the placeholder `<div class="ph">` blocks in `index.html` with `<img>` tags:

```html
<!-- Before -->
<div class="gal-item big reveal"><div class="ph"><span class="ph-label">01 · First visit</span></div></div>

<!-- After -->
<div class="gal-item big reveal"><img src="photos/01-first-visit.jpg" alt="First visit" /></div>
```

Upload your photos alongside the HTML files and update the `src` paths.

---

## Costs

Everything on the free tier — no server required.

| Service | Free tier |
|---------|-----------|
| Firebase Firestore | 50k reads/day, 20k writes/day |
| Google Sheets / Apps Script | Unlimited for personal use |
| Netlify / Cloudflare Pages | Free with generous bandwidth |

---

## Moderating guestbook messages

Firestore rules block client-side deletes. To remove a message:
1. Firebase Console → Firestore Database → `guestbook` collection.
2. Click the document → trash icon.
