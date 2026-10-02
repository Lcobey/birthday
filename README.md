# Birthday website — quick guide

## 1. Personalise
Open `script.js` and edit the block at the top (name, message, captions, letter, final message).
Replace `images/photo1.jpg` … `photo5.jpg` with your real photos (same names, square-ish crops look best, ~1000px wide, under 500 KB each).
Replace `music/song.mp3` with your song (the included file is a silent placeholder).

## 2. Create a GitHub repository
1. Sign in at github.com → **+** (top right) → **New repository**.
2. Name it e.g. `birthday`, set it to **Public**, click **Create repository**.

## 3. Upload the files
1. On the empty repo page click **uploading an existing file**.
2. Drag in `index.html`, `style.css`, `script.js` AND the `images` and `music` folders (drag the folders themselves).
3. Click **Commit changes**.

## 4. Enable GitHub Pages
1. **Settings → Pages**.
2. Under *Build and deployment* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
3. Wait 1–2 minutes and refresh the page.

## 5. Get your URL
It appears at the top of Settings → Pages: `https://YOUR-USERNAME.github.io/birthday/`

## 6. Test on your phone
Open the URL in Safari/Chrome. Tap the gift, check the sound, open each photo, read the letter, watch the garden. Try portrait and landscape. If you see old content, hard-refresh or open in a private tab.

## 7. Update later
Repo → click a file → ✏️ edit → **Commit changes** (or **Add file → Upload files** to replace images/music with the same name). Pages redeploys in ~1 minute.

## QR code for the card
Your final URL goes in exactly one place: wherever you generate the QR. Replace the placeholder `YOUR_GITHUB_PAGES_URL` with the real address (include `https://`).

**Option A – website:** use a generator that doesn't expire or add tracking (e.g. qrcode-monkey.com), paste your URL, set error correction **High**, download **SVG** or PNG at 2000px+.

**Option B – offline (Python):**
```
pip install segno
python -c "import segno; segno.make('YOUR_GITHUB_PAGES_URL', error='h').save('qr.svg', scale=20, border=4)"
```

**Printing:** dark code on a light background, keep the white border (≥4 modules), no stretching, no logos over it. Minimum printed size 2.5 cm (1 in); 3–4 cm is comfortable. Print one test, scan with the iPhone/Android camera from ~20–30 cm, and also test on a different phone before printing the final card. Test only after the site is live and the URL is final.
