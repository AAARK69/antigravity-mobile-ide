# ⚡ Antigravity Mobile IDE & Desktop Bridge

> **Turn your phone into a full-scale AI coding studio — 100% FREE.**  
> *No App Store fees. No monthly subscriptions. Zero cloud lock-in.*

[![Live Demo](https://img.shields.io/badge/Live_App-Open_PWA-brightgreen.svg?style=for-the-badge)](https://aaark69.github.io/antigravity-mobile-ide/)
[![Download ZIP](https://img.shields.io/badge/Download-Latest_Release-blue.svg?style=for-the-badge)](https://github.com/AAARK69/antigravity-mobile-ide/archive/refs/heads/main.zip)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 👋 What Is This?

**Antigravity Mobile IDE** is a mobile-first developer workspace that runs in your phone's browser (Safari or Chrome). It lets you write code, manage Git repositories, run real terminal commands, and control AI coding agents from your pocket — connected directly to your desktop computer.

### Why use this over paid App Store apps?
- 💰 **100% Free**: Paid App Store tools require $99/year developer accounts or monthly subscriptions. This runs free as a Progressive Web App (PWA).
- 🔒 **Private & Local**: Your code stays safely on your computer. It never passes through third-party servers.
- ⚡ **No Terminal Setup Needed**: Includes a single double-clickable launcher file for macOS!

---

## 🎯 What Do You Want To Do? (Pick Your Path)

| Your Goal | Action / Link |
| :--- | :--- |
| 📱 **Use the app on your phone right now** | Open [https://aaark69.github.io/antigravity-mobile-ide/](https://aaark69.github.io/antigravity-mobile-ide/) in Safari or Chrome. |
| 🖥️ **Connect the phone app to your Mac computer** | [Download the ZIP](https://github.com/AAARK69/antigravity-mobile-ide/archive/refs/heads/main.zip) and double-click `launch-desktop-bridge.command`. |
| ☁️ **Host your own private copy on the web** | Click the 1-click deploy buttons below for Vercel or Netlify. |
| 👨‍💻 **Contribute or view source code** | Browse files in this GitHub repository or open a Pull Request. |

---

## 💡 How It Works (Simple Diagram)

```text
 ┌───────────────────────────┐                ┌───────────────────────────┐
 │ 📱 Phone (Safari / Chrome)│                │ 🖥️ Your Computer (Mac/PC) │
 │                           │  Wi-Fi / Local │                           │
 │ • File Editor & Tabs      │  Network API   │ • Desktop Bridge Server   │
 │ • Extensions Marketplace  │ ─────────────► │ • Real Terminal Commands  │
 │ • AI Agent Controls       │                │ • Disk File Storage       │
 └───────────────────────────┘                └───────────────────────────┘
```

1. You open the app on your phone.
2. The phone connects over your local network to your computer.
3. Edits you make on your phone immediately update real files on your computer!

---

## 📲 How To Install On Your Phone (2-Step Guide)

### 🍏 iPhone / iPad (Safari)
1. Open [https://aaark69.github.io/antigravity-mobile-ide/](https://aaark69.github.io/antigravity-mobile-ide/) in **Safari**.
2. Tap the **Share** button (the square with an arrow pointing up) ➡️ tap **Add to Home Screen**.
3. Now it opens like a native app with full-screen support and push notifications!

### 🤖 Android (Google Chrome)
1. Open [https://aaark69.github.io/antigravity-mobile-ide/](https://aaark69.github.io/antigravity-mobile-ide/) in **Chrome**.
2. Tap the **Menu** (3 vertical dots in top-right) ➡️ tap **Install app** or **Add to Home Screen**.

---

## 🖥️ How To Run Computer Mode (Zero Terminal Experience)

1. [**Click here to Download the Project (.zip)**](https://github.com/AAARK69/antigravity-mobile-ide/archive/refs/heads/main.zip).
2. Unzip the downloaded folder on your Mac.
3. Double-click the file named **`launch-desktop-bridge.command`**.
4. A terminal window will open automatically and display:  
   `🟢 Antigravity Desktop Bridge Server Running at http://localhost:3001`
5. Open the app on your phone — the top indicator will turn **🟢 Mac Connected**!

*(Advanced Terminal Users can also run `git clone https://github.com/AAARK69/antigravity-mobile-ide.git && cd antigravity-mobile-ide && npm start`)*

---

## ✨ Feature Guide

- **🧩 Extensions Marketplace**: Browse and toggle skills like `@obra/superpowers` (TDD & debugging), `@unstash/context7` (ultra-compressed docs), `@google/chrome-devtools`, and `@google/antigravity` SDK.
- **📄 Multi-File Editor**: Open multiple code files at once with easy tab switching.
- **🛡️ Code Safety Callouts**: Helpful tips and null-guard warnings above editor code blocks.
- **🖥️ Hardware Gauges**: View real-time CPU usage, RAM load, and Mac system specs from your phone screen.
- **🐚 Live Mac Terminal**: Type shell commands on your phone and see real output from your computer terminal.
- **🌿 Git Diff Inspector**: Review code modifications, stage files, and make Git commits.

---

## 🚀 1-Click Cloud Hosting (For Developers)

Want to host your own deployment URL? Click below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AAARK69/antigravity-mobile-ide)  
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AAARK69/antigravity-mobile-ide)

---

## ❓ Frequently Asked Questions (FAQ)

<details>
<summary><strong>Q: Is this really 100% free? Are there any hidden fees?</strong></summary>
<p>Yes! It is 100% free and open-source under the MIT License. There are no app store fees, no cloud subscription costs, and no paywalls.</p>
</details>

<details>
<summary><strong>Q: Is my code private?</strong></summary>
<p>Yes. The Desktop Bridge server runs entirely on your local computer. Your workspace files are synced directly over your local network and are never stored on external third-party servers.</p>
</details>

<details>
<summary><strong>Q: Does this work on Windows or Linux?</strong></summary>
<p>Yes! Running <code>npm start</code> in terminal works across macOS, Windows, and Linux. The double-click launcher script is optimized for macOS.</p>
</details>

---

## 📄 License

Distributed under the **MIT License**. Free for personal and commercial usage.
