# ⚡ Antigravity Mobile IDE & Desktop Bridge

> **Turn any phone, tablet, or device into a full-scale AI coding studio — 100% FREE.**  
> *Cross-platform support for macOS, Windows, Linux, iOS, Android, HarmonyOS, and KaiOS.*

[![Live Demo](https://img.shields.io/badge/Live_App-Open_PWA-brightgreen.svg?style=for-the-badge)](https://aaark69.github.io/antigravity-mobile-ide/)
[![Download ZIP](https://img.shields.io/badge/Download-Latest_Release-blue.svg?style=for-the-badge)](https://github.com/AAARK69/antigravity-mobile-ide/archive/refs/heads/main.zip)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🖥️ Zero-Terminal Desktop Launchers (Mac, Windows, Linux)

This repository includes **native double-clickable desktop launchers** for all major operating systems. No terminal command typing required!

| Operating System | Double-Click Launcher File | How to Run |
| :--- | :--- | :--- |
| 🍎 **macOS** | **`launch-desktop-bridge.command`** | Double-click in Finder to start server & open browser |
| 🪟 **Windows** | **`launch-desktop-bridge.bat`** | Double-click in File Explorer to launch batch server |
| 🐧 **Linux** | **`launch-desktop-bridge.sh`** | Double-click in Files (or use `antigravity-mobile-ide.desktop`) |

*(Terminal users can run `npm start` or `node server.js` on port `3001`)*

---

## 📱 Multi-Mobile OS Installation Guides

Antigravity Mobile IDE is designed as a universal **Progressive Web App (PWA)** that runs on any mobile device or phone operating system:

| Mobile Phone OS | Browser | Installation Steps |
| :--- | :--- | :--- |
| 🍏 **Apple iOS / iPadOS** | Safari | Tap **Share** button (arrow-up box) ➡️ Tap **Add to Home Screen** |
| 🤖 **Android** | Chrome / Brave / Samsung | Tap **Menu** (three dots) ➡️ Tap **Install app** or **Add to Home Screen** |
| 🔴 **Huawei HarmonyOS** | Huawei Browser | Tap **Browser Menu** ➡️ Tap **Add to Home Screen** |
| 📟 **KaiOS** | KaiOS Web | Open URL ➡️ Tap **Options** ➡️ Select **Pin to Home Screen** |
| 💻 **Windows Surface / Mobile** | Edge | Tap **Menu (...)** ➡️ **Apps** ➡️ **Install this site as an app** |

---

## 🎯 Quick Start Summary

### 1. Download
- [**📦 Download Latest Release (.zip)**](https://github.com/AAARK69/antigravity-mobile-ide/archive/refs/heads/main.zip)
- Or clone via Git: `git clone https://github.com/AAARK69/antigravity-mobile-ide.git`

### 2. Launch Computer Bridge
- Double-click the launcher for your OS (`.command` on Mac, `.bat` on Windows, `.sh` on Linux).
- The desktop bridge connects at `http://localhost:3001`.

### 3. Open on Phone
- Open [https://aaark69.github.io/antigravity-mobile-ide/](https://aaark69.github.io/antigravity-mobile-ide/) on your phone.
- The status pill will turn **🟢 Mac Connected** and allow you to view real files, run live terminal shell commands, and control AI agents!

---

## 💡 System Architecture

```text
 ┌───────────────────────────────┐                  ┌────────────────────────────────┐
 │ 📱 Mobile Device (PWA)        │                  │ 🖥️ Desktop Computer (Mac/Win) │
 │ • iOS / Android / HarmonyOS   │  Wi-Fi / Local   │                                │
 │ • File Editor & Tabs          │  Network API     │ • Desktop Bridge Server        │
 │ • Extensions Marketplace      │ ───────────────► │ • Real zsh/bash/cmd Shell      │
 │ • AI Agent Dashboard          │                  │ • Disk Storage & Git Repos     │
 └───────────────────────────────┘                  └────────────────────────────────┘
```

---

## ✨ Features Spotlight

- **🧩 Extensions Marketplace**: Browse skills like `@obra/superpowers`, `@unstash/context7`, `@google/chrome-devtools`, and `@google/antigravity`.
- **🛡️ Inline Code Callouts**: Framework insights and null-guard safety banners above editor code blocks.
- **🖥️ Hardware Resource Gauges**: View real-time CPU core load %, RAM usage, OS version, and Node runtime metrics from your phone.
- **📄 Multi-File Tabs**: Open, switch, and edit multiple workspace files simultaneously.
- **⚡ Slash Command Palette**: Shortcut popover for `/goal`, `/schedule`, `/browser`, `/grill-me`, `/teamwork-preview`, and `/learn`.

---

## 🚀 1-Click Cloud Hosting (For Developers)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AAARK69/antigravity-mobile-ide)  
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AAARK69/antigravity-mobile-ide)

---

## 📄 License
Distributed under the **MIT License**. 100% free and open-source for personal and commercial usage.
