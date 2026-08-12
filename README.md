# ⚡ Antigravity Mobile IDE PWA

A premium, responsive Mobile IDE dashboard and Progressive Web App (PWA) client for orchestrating Google DeepMind's **Antigravity AI** coding agents.

This web application offers a high-fidelity pocket-sized terminal and code workspace environment. It includes a simulated active developer run environment to showcase agent execution step-by-step, alongside interactive console command execution, file tree browsing, and git code difference visualization.

---

## ✨ Features

- **📱 Immersive Device Bezel**: Renders inside a sleek, premium phone frame mockup on desktop screen viewports, and automatically scales to edge-to-edge full screen on actual mobile devices.
- **🧠 Live Agent Simulation**: Watch a mock Antigravity agent process code changes, search directories, and compile files in real-time with visual plan check-lists, mind logs, and tool execution status markers.
- **📁 Workspace File Explorer**: Interactive file tree that parses directory content and loads code files dynamically into a custom editor with simulated syntax coloring.
- **🌿 Git Diff Board**: Track modified repository files, stage edits, review color-coded additions/removals, and simulate repository commits.
- **🐚 Command Shell Terminal**: Interactive terminal console support. Type commands like `help`, `ls`, `cat`, `git status`, `npm run dev`, and `npm run test` to see realistic responses.
- **⚡ Skills Panel**: Fine-tune agent permissions, sandbox bypass settings, and toggle integrations (like Chrome DevTools, Memory Leak debugger, and the Antigravity SDK).
- **🔔 Native Push Notifications**: Mock iOS haptic vibration alerts and dropdown slide notifications upon task compilation success.

---

## 🚀 Easy Deployment

You can host and deploy this static client application in less than a minute for free using these methods:

### 1. GitHub Pages (Recommended)
This repository includes a pre-configured GitHub Actions deployment workflow:
1. Push this repository to your GitHub account.
2. Go to your repository **Settings** ➡️ **Pages**.
3. Under **Build and deployment** ➡️ **Source**, select **GitHub Actions**.
4. The site will compile and deploy automatically on every push to your `main` branch.

### 2. One-Click Deploy Buttons
Click the buttons below to clone and host this project instantly on popular cloud hosting platforms:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AAARK69/antigravity-mobile-ide)  
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AAARK69/antigravity-mobile-ide)

---

## 📲 How to Install on Your Mobile Device

This app is configured as a fully compliant **Progressive Web App (PWA)** for native-app feels:

### Apple iOS (Safari)
1. Open the hosted URL in **Safari**.
2. Tap the **Share** button (arrow-up box) in the browser toolbar.
3. Scroll down and select **Add to Home Screen**.
4. Launch the app from your home screen. *(Note: Supports native iOS push notifications since iOS 16.4).*

### Android (Google Chrome)
1. Open the hosted URL in **Google Chrome**.
2. Tap the **Menu** (three dots) icon.
3. Select **Install app** or **Add to Home Screen**.

---

## 🔒 Security & Connection Architecture
To interact with your computer's local files and compile terminal code securely:
- The phone client registers a secure network listener connecting over **WebSockets** or **HTTPS** proxy tunnels (e.g. ngrok or WebRTC).
- Connections link directly to a lightweight `antigravity-agent` daemon running inside your local terminal workspace.
- This ensures all AI prompts, private file trees, and terminal shell sessions stay hosted locally on your device rather than a central server database.
