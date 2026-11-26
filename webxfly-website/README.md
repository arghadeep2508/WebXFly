# WebXFly — Website

The official website of **WebXFly Web Agency** — fast, mobile-friendly websites for growing businesses.

Plain HTML, CSS and JavaScript. No build step, no server code, no database, no tracking.

---

## Project structure

```
webxfly-website/
├── index.html            Home page (hero · who we build for · why WebXFly · pricing · contact)
├── privacy.html          Privacy Policy
├── terms.html            Terms & Conditions
├── 404.html              "Page not found" page
│
├── css/
│   ├── style.css         Base styles, nav and hero
│   ├── industries.css    "Who we build for" section
│   ├── standout.css      "Stand out from the noise" section
│   ├── pricing.css       Pricing + footer
│   ├── site.css          Site-wide extras (WhatsApp button, progress bar, accessibility)
│   └── legal.css         Privacy / Terms / 404 pages
│
├── js/
│   ├── motion.js         One shared animation loop for the whole page (load first)
│   ├── hero.js           Opening intro animation
│   ├── industries.js     "Who we build for" scroll animation
│   ├── standout.js       "Stand out" scroll animation
│   ├── pricing.js        Pricing cards animation
│   └── mail.js           Builds the email address in the browser (anti-spam)
│
├── assets/
│   ├── figure.webp, figure-820.webp, figure-grey.webp   Sculpture (full, mobile, grey)
│   ├── crowd-back.webp, crowd-front.webp                 Crowd (placeholder illustration)
│   ├── logo.png, logo-120.webp                           Logo
│   ├── icon-192.png, icon-512.png, apple-touch-icon.png  App / home-screen icons
│   ├── og.jpg                                            Link preview image (WhatsApp, social)
│   └── fonts/                                            Self-hosted fonts + OFL.txt licence
│
├── favicon.ico           Browser tab icon
├── site.webmanifest      "Add to Home Screen" settings
├── robots.txt            Lets search engines index the site
├── sitemap.xml           Page list for Google
├── vercel.json           Security headers + caching for Vercel
├── .gitignore            Files Git should never upload
├── .gitattributes        Keeps line endings consistent (Windows ↔ Vercel)
├── LICENSE               All rights reserved (fonts: SIL Open Font License)
└── README.md             This file
```

---

## Push to GitHub (first time)

### Option A — GitHub Desktop (easiest on Windows)

1. Install **GitHub Desktop** and sign in.
2. **File → Add local repository →** choose this `webxfly-website` folder.
3. It will say *"this directory does not appear to be a Git repository"* → click **create a repository**.
   Name: `webxfly-website`. Leave everything else as is → **Create repository**.
4. Click **Publish repository**. Untick *"Keep this code private"* only if you want it public
   (private works fine with Vercel too).

### Option B — command line

```bash
cd webxfly-website
git init
git add .
git commit -m "Launch WebXFly website"
git branch -M main
git remote add origin https://github.com/<your-username>/webxfly-website.git
git push -u origin main
```

> Don't drag-and-drop the folder into GitHub's website uploader — it can skip the hidden
> `.gitignore` and `.gitattributes` files.

---

## Deploy on Vercel

1. Go to **vercel.com → Add New → Project → Import** your `webxfly-website` repository.
2. Framework preset: **Other**. Leave *Build Command* and *Output Directory* **empty**.
3. Click **Deploy**.

Every time you push a change to GitHub, Vercel redeploys automatically.

---

## After your first deploy

- **Check your address.** The share-preview image (`og:image` in `index.html`), `sitemap.xml` and
  `robots.txt` assume **https://webxfly.vercel.app**. If Vercel gives you a different address
  (or you add your own domain), replace it in those three files.

## Editing common things

| What | Where |
|---|---|
| WhatsApp / phone number | Search `918609894860` in `index.html`, `privacy.html`, `terms.html` |
| Email | `data-mail="gmail.com|webxfly26"` (written as *domain\|name* so spam bots can't read it) |
| Prices | Pricing section in `index.html` (the `data-n` numbers drive the count-up animation) |
| Crowd image | Replace `assets/crowd-back.webp` and `assets/crowd-front.webp` with a licensed photo — same file names, no code changes |

---

© 2026 WebXFly Web Agency. All rights reserved.
