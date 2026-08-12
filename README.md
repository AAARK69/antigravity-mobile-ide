# ⚡ Antigravity Mobile IDE & Desktop Bridge

A premium, responsive Mobile IDE dashboard, Progressive Web App (PWA), and Desktop Bridge Server for orchestrating Google DeepMind's **Antigravity AI** coding agents directly on your computer.

---

## 🖥️ Desktop Bridge Server (Run Local Commands & Sync Disk)

This app includes a **zero-dependency Node.js Desktop Bridge Server** (`server.js`) that connects your phone or browser PWA directly to your Mac computer.

### How to Run Desktop Mode on Your Mac:
1. Open terminal on your computer and navigate to this folder:
   ```bash
   cd /Users/rohankosur/Documents/GithubProjects/antigravity-mobile-ide
   npm start
   ```
2. The server starts at `http://localhost:3001`.
3. Open the Mobile PWA on your phone or browser. The status badge in the top bar will turn **🟢 Mac Connected**.
4. Now, any file edited in the phone UI saves directly to your computer's disk, and any command entered in the mobile shell executes live on your Mac terminal!

---

## ✨ Features

- **📱 Immersive Device Bezel**: Renders inside a sleek phone frame mockup on desktop screen viewports, and automatically scales to edge-to-edge full screen on mobile devices.
- **🖥️ Live Hardware Monitor**: Inspect your Mac's CPU core usage %, RAM load, node version, and operating system info directly from your phone.
- **📄 Multi-File Editor Tabs**: Open, switch between, and close multiple workspace files simultaneously with dirty/modified state indicators.
- **⚡ Slash Command Palette**: Quick popover menu for `/goal`, `/schedule`, `/browser`, `/grill-me`, `/teamwork-preview`, and `/learn`.
- **🧠 Live Agent Simulation**: Watch a mock Antigravity agent process code changes, search directories, and compile files step-by-step.
- **🐚 Command Shell Terminal**: Pipe terminal inputs to `/api/exec` for real `zsh`/`bash` command execution on your Mac.
- **🌿 Git Diff Board**: Track modified repository files, stage edits, review color-coded additions/removals, and commit changes.

---

## 🚀 Easy Deployment & Hosting

### GitHub Pages (Automated)
This repository includes a pre-configured GitHub Actions deployment workflow:
1. Push this repository to your GitHub account.
2. Go to repository **Settings** ➡️ **Pages** ➡️ **Source** ➡️ **GitHub Actions**.
3. The site compiles and deploys automatically on every push.

### One-Click Deploy Buttons
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AAARK69/antigravity-mobile-ide)  
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AAARK69/antigravity-mobile-ide)

---

## 📲 How to Install as a PWA on Your Phone

### Apple iOS (Safari)
1. Open the hosted URL in **Safari**.
2. Tap the **Share** button ➡️ **Add to Home Screen**.

### Android (Google Chrome)
1. Open the hosted URL in **Google Chrome**.
2. Tap the **Menu** (three dots) ➡️ **Install app** / **Add to Home Screen**.
