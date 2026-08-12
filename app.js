/* ==========================================
   Antigravity Mobile IDE - Core Controller Logic
   ========================================== */

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}

// Global Virtual Filesystem Database (Fallback Demo Mode)
const DEMO_WORKSPACES = {
  'antigravity-mobile-ide': {
    name: 'antigravity-mobile-ide',
    icon: '⚡',
    description: 'Active Mobile IDE Project',
    files: {
      'index.html': `<!DOCTYPE html>\n<html>\n<head>\n  <title>Antigravity Mobile IDE</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="root"></div>\n  <script src="app.js"></script>\n</body>\n</html>`,
      'styles.css': `/* Mobile IDE Theme Styles */\n:root {\n  --theme-accent: #00e5ff;\n  --bg-primary: #06080d;\n}`,
      'app.js': `// Antigravity AI Mobile Client core file\nconsole.log("Antigravity client ready.");`,
      'server.js': `// Antigravity Desktop Bridge Server\nconst http = require('http');\nconst PORT = 3001;`,
      'package.json': `{\n  "name": "antigravity-mobile-ide",\n  "version": "1.4.0",\n  "scripts": {\n    "start": "node server.js"\n  }\n}`
    },
    git: [
      { path: 'app.js', status: 'modified', staged: false, contentBefore: 'console.log("Antigravity client ready.");', contentAfter: 'console.log("Antigravity client initialized with Desktop Bridge.");' }
    ]
  }
};

// Global Application State
let state = {
  currentWorkspace: 'antigravity-mobile-ide',
  activeTab: 'agent',
  model: 'gemini-3.6-flash',
  pushEnabled: false,
  accentColor: 'cyan',
  isAgentRunning: false,
  agentDuration: 0.0,
  agentDurationInterval: null,
  toolsUsed: 0,

  // Desktop Bridge Connectivity
  bridgeUrl: localStorage.getItem('pwaBridgeUrl') || 'http://localhost:3001',
  isDesktopConnected: false,
  realWorkspaceTree: null,

  // Multi-File Tab State
  openTabs: [], // Array of { path, content, language }
  activeTabIndex: -1,

  // Extensions Filter State
  activeExtensionFilter: 'All'
};

// DOM Elements Reference
const DOM = {
  deviceTime: document.getElementById('deviceTime'),
  tabs: document.querySelectorAll('.tab-btn'),
  panels: document.querySelectorAll('.tab-panel'),
  modelSelector: document.getElementById('modelSelector'),
  simulationRunBtn: document.getElementById('simulationRunBtn'),
  sidebarToggle: document.getElementById('sidebarToggle'),
  workspaceDrawer: document.getElementById('workspaceDrawer'),
  drawerOverlay: document.getElementById('drawerOverlay'),
  drawerClose: document.getElementById('drawerClose'),
  
  // Desktop Bridge status refs
  bridgeStatusPill: document.getElementById('bridgeStatusPill'),
  bridgeStatusLabel: document.getElementById('bridgeStatusLabel'),
  bridgeModal: document.getElementById('bridgeModal'),
  bridgeModalOverlay: document.getElementById('bridgeModalOverlay'),
  bridgeModalClose: document.getElementById('bridgeModalClose'),
  bridgeServerUrl: document.getElementById('bridgeServerUrl'),
  connectBridgeBtn: document.getElementById('connectBridgeBtn'),
  disconnectBridgeBtn: document.getElementById('disconnectBridgeBtn'),
  bridgeModalLogs: document.getElementById('bridgeModalLogs'),

  // Slash Command Palette refs
  slashCommandPalette: document.getElementById('slashCommandPalette'),
  slashItems: document.querySelectorAll('.slash-item'),
  agentGoalInput: document.getElementById('agentGoalInput'),
  sendGoalBtn: document.getElementById('sendGoalBtn'),
  agentTimeline: document.getElementById('agentTimeline'),

  // Files & Editor refs
  fileTreeContainer: document.getElementById('fileTreeContainer'),
  editorTabBar: document.getElementById('editorTabBar'),
  editorFilename: document.getElementById('editorFilename'),
  editorLineNumbers: document.getElementById('editorLineNumbers'),
  codeText: document.getElementById('codeText'),
  editorLang: document.getElementById('editorLang'),
  saveIndicator: document.getElementById('saveIndicator'),
  saveFileBtn: document.getElementById('saveFileBtn'),
  refreshTree: document.getElementById('refreshTree'),
  editorCalloutBanner: document.getElementById('editorCalloutBanner'),
  calloutTitle: document.getElementById('calloutTitle'),
  calloutText: document.getElementById('calloutText'),

  // Extensions refs
  extSearchInput: document.getElementById('extSearchInput'),
  extFilterChips: document.querySelectorAll('.chip'),
  extCards: document.querySelectorAll('.ext-card'),
  btnExtStatuses: document.querySelectorAll('.btn-ext-status'),

  // Git refs
  gitChangeCount: document.getElementById('gitChangeCount'),
  gitFileList: document.getElementById('gitFileList'),
  gitDiffContainer: document.getElementById('gitDiffContainer'),
  commitMessageInput: document.getElementById('commitMessageInput'),
  gitCommitBtn: document.getElementById('gitCommitBtn'),

  // Terminal refs
  terminalLogs: document.getElementById('terminalLogs'),
  terminalInput: document.getElementById('terminalInput'),
  terminalBody: document.getElementById('terminalBody'),
  terminalConnectionMsg: document.getElementById('terminalConnectionMsg'),

  // Agent dashboard stats
  activeAgentState: document.getElementById('activeAgentState'),
  runDuration: document.getElementById('runDuration'),
  toolExecCount: document.getElementById('toolExecCount'),
  agentRunningBadge: document.querySelector('.agent-running-badge'),

  // Themes
  accentDots: document.querySelectorAll('.accent-dot'),
  pwaNotification: document.getElementById('pwaNotification'),
  notifTitle: document.getElementById('notifTitle'),
  notifDesc: document.getElementById('notifDesc')
};

/* ==========================================
   INITIALIZATION
   ========================================== */
function init() {
  updateClock();
  setInterval(updateClock, 60000);

  setupTabListeners();
  setupDrawerListeners();
  setupBridgeListeners();
  setupSlashCommandListeners();
  setupFileEditorListeners();
  setupExtensionsListeners();
  setupGitListeners();
  setupTerminalListeners();
  setupAgentListeners();
  setupSettingsListeners();

  // Restore Theme
  const savedAccent = localStorage.getItem('pwaAccent') || 'cyan';
  setAccentColor(savedAccent);

  // Auto-check Desktop Bridge Server Connection
  checkDesktopBridge();
}

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  DOM.deviceTime.textContent = `${hours}:${minutes}`;
}

/* ==========================================
   EXTENSIONS MARKETPLACE LOGIC
   ========================================== */
function setupExtensionsListeners() {
  // Search filtering
  DOM.extSearchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    DOM.extCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(q)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Filter chips
  DOM.extFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.extFilterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');
      state.activeExtensionFilter = filter;

      DOM.extCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'All' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Install / Installed toggle
  DOM.btnExtStatuses.forEach(btn => {
    btn.addEventListener('click', () => {
      const extName = btn.getAttribute('data-ext');
      if (btn.classList.contains('installed')) {
        btn.className = 'btn-ext-status install-btn';
        btn.textContent = 'Install';
        addTerminalLine(`[Extensions] Disabled extension: <strong>${extName}</strong>`, 'cmd-output');
      } else {
        btn.className = 'btn-ext-status installed';
        btn.textContent = 'Installed';
        addTerminalLine(`[Extensions] Installed and loaded skills for: <strong>${extName}</strong>`, 'cmd-success');
      }
    });
  });
}

/* ==========================================
   DESKTOP BRIDGE CLIENT LOGIC
   ========================================== */
async function checkDesktopBridge() {
  DOM.bridgeServerUrl.value = state.bridgeUrl;
  
  try {
    const res = await fetch(`${state.bridgeUrl}/api/status`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      setBridgeConnected(data);
      return;
    }
  } catch (err) {
    console.log('Desktop bridge offline, falling back to demo simulation.');
  }

  setBridgeDisconnected();
}

function setBridgeConnected(sysStatus) {
  state.isDesktopConnected = true;
  DOM.bridgeStatusPill.className = 'bridge-status-pill online';
  DOM.bridgeStatusLabel.textContent = 'Mac Connected';
  DOM.terminalConnectionMsg.textContent = `🟢 Connection status: Live Desktop Bridge Server (${state.bridgeUrl}). Shell commands execute directly on Mac.`;

  fetchRealWorkspace();
}

function setBridgeDisconnected() {
  state.isDesktopConnected = false;
  DOM.bridgeStatusPill.className = 'bridge-status-pill offline';
  DOM.bridgeStatusLabel.textContent = 'Demo Mode';
  DOM.terminalConnectionMsg.textContent = `🟡 Connection status: Demo Simulation Mode.`;

  loadDemoWorkspace();
}

async function fetchRealWorkspace() {
  try {
    const res = await fetch(`${state.bridgeUrl}/api/workspace`);
    if (res.ok) {
      const data = await res.json();
      state.realWorkspaceTree = data.tree;
      renderRealFileTree(data.tree);
      addTerminalLine(`[Bridge] Loaded real desktop workspace tree from disk: <code>${data.root}</code>`, 'cmd-success');
    }
  } catch (err) {
    loadDemoWorkspace();
  }
}

function setupBridgeListeners() {
  DOM.bridgeStatusPill.addEventListener('click', () => {
    DOM.bridgeModal.classList.add('active');
    DOM.bridgeModalOverlay.classList.add('active');
  });

  DOM.bridgeModalClose.addEventListener('click', closeBridgeModal);
  DOM.bridgeModalOverlay.addEventListener('click', closeBridgeModal);

  DOM.connectBridgeBtn.addEventListener('click', async () => {
    const targetUrl = DOM.bridgeServerUrl.value.trim();
    if (!targetUrl) return;
    
    state.bridgeUrl = targetUrl;
    localStorage.setItem('pwaBridgeUrl', targetUrl);
    DOM.bridgeModalLogs.textContent = `Connecting to ${targetUrl}...`;

    try {
      const res = await fetch(`${targetUrl}/api/status`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        setBridgeConnected(data);
        DOM.bridgeModalLogs.textContent = `Successfully connected to ${data.hostname}! (${data.os})`;
        setTimeout(closeBridgeModal, 1200);
        return;
      }
    } catch (err) {
      DOM.bridgeModalLogs.textContent = `Connection failed: ${err.message}. Make sure 'node server.js' is running on your Mac.`;
    }
  });

  DOM.disconnectBridgeBtn.addEventListener('click', () => {
    setBridgeDisconnected();
    closeBridgeModal();
  });
}

function closeBridgeModal() {
  DOM.bridgeModal.classList.remove('active');
  DOM.bridgeModalOverlay.classList.remove('active');
}

/* ==========================================
   SLASH COMMAND PALETTE
   ========================================== */
function setupSlashCommandListeners() {
  DOM.agentGoalInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.startsWith('/')) {
      DOM.slashCommandPalette.classList.remove('hidden');
    } else {
      DOM.slashCommandPalette.classList.add('hidden');
    }
  });

  DOM.slashItems.forEach(item => {
    item.addEventListener('click', () => {
      const cmd = item.getAttribute('data-cmd');
      DOM.agentGoalInput.value = `${cmd} `;
      DOM.slashCommandPalette.classList.add('hidden');
      DOM.agentGoalInput.focus();
    });
  });
}

/* ==========================================
   MULTI-FILE EDITOR & FILES TAB
   ========================================== */
function setupFileEditorListeners() {
  DOM.refreshTree.addEventListener('click', () => {
    if (state.isDesktopConnected) {
      fetchRealWorkspace();
    } else {
      renderDemoFileTree();
    }
    addTerminalLine(`Refreshed file explorer view.`, 'cmd-output');
  });

  DOM.saveFileBtn.addEventListener('click', saveActiveFileToDisk);
}

function renderRealFileTree(tree, parentEl = DOM.fileTreeContainer) {
  parentEl.innerHTML = '';

  tree.forEach(node => {
    if (node.type === 'directory') {
      const dirNode = document.createElement('div');
      dirNode.className = 'tree-node folder-node';
      dirNode.innerHTML = `<span class="node-icon">📁</span><span>${node.name}/</span>`;
      parentEl.appendChild(dirNode);

      if (node.children) {
        node.children.forEach(child => {
          const childNode = document.createElement('div');
          childNode.className = 'tree-node file-node';
          childNode.setAttribute('data-path', child.path);
          childNode.innerHTML = `<span class="node-icon">${getFileIcon(child.name)}</span><span>${child.name}</span>`;
          childNode.addEventListener('click', () => openFileTab(child.path, child.name));
          parentEl.appendChild(childNode);
        });
      }
    } else {
      const fileNode = document.createElement('div');
      fileNode.className = 'tree-node file-node';
      fileNode.setAttribute('data-path', node.path);
      fileNode.innerHTML = `<span class="node-icon">${getFileIcon(node.name)}</span><span>${node.name}</span>`;
      fileNode.addEventListener('click', () => openFileTab(node.path, node.name));
      parentEl.appendChild(fileNode);
    }
  });
}

function loadDemoWorkspace() {
  renderDemoFileTree();
  renderGitPanel();
}

function renderDemoFileTree() {
  DOM.fileTreeContainer.innerHTML = '';
  const workspace = DEMO_WORKSPACES[state.currentWorkspace];
  if (!workspace) return;

  Object.keys(workspace.files).forEach(filePath => {
    const fileNode = document.createElement('div');
    fileNode.className = 'tree-node file-node';
    fileNode.setAttribute('data-path', filePath);
    fileNode.innerHTML = `<span class="node-icon">${getFileIcon(filePath)}</span><span>${filePath}</span>`;
    fileNode.addEventListener('click', () => openFileTab(filePath, filePath));
    DOM.fileTreeContainer.appendChild(fileNode);
  });
}

async function openFileTab(filePath, fileName) {
  let existingIndex = state.openTabs.findIndex(t => t.path === filePath);

  if (existingIndex !== -1) {
    setActiveTab(existingIndex);
    return;
  }

  let content = '';
  if (state.isDesktopConnected) {
    try {
      const res = await fetch(`${state.bridgeUrl}/api/file?path=${encodeURIComponent(filePath)}`);
      if (res.ok) {
        const data = await res.json();
        content = data.content;
      }
    } catch (err) {
      content = `// Error loading file: ${err.message}`;
    }
  } else {
    const workspace = DEMO_WORKSPACES[state.currentWorkspace];
    content = workspace ? workspace.files[filePath] || '// Empty file' : '// Empty file';
  }

  const ext = fileName.split('.').slice(-1)[0];
  state.openTabs.push({
    path: filePath,
    name: fileName,
    content: content,
    ext: ext
  });

  setActiveTab(state.openTabs.length - 1);
}

function setActiveTab(index) {
  state.activeTabIndex = index;
  renderTabBar();

  const file = state.openTabs[index];
  if (!file) {
    DOM.editorFilename.textContent = 'Select a file';
    DOM.codeText.textContent = '// Choose a file from the tree to open in editor.';
    DOM.editorLineNumbers.innerHTML = '1';
    DOM.editorLang.textContent = 'None';
    return;
  }

  DOM.editorFilename.textContent = file.name;
  DOM.editorLang.textContent = file.ext.toUpperCase();
  DOM.codeText.innerHTML = simulateSyntaxHighlight(file.content, file.ext);

  // Update Callout Banner insight
  if (file.ext === 'js' || file.ext === 'ts') {
    DOM.calloutTitle.textContent = "🛡️ Safety First: Null guards & Optionals";
    DOM.calloutText.textContent = "In JavaScript/TypeScript, verify non-null states before property dereferencing (e.g. obj?.property).";
  } else if (file.ext === 'html') {
    DOM.calloutTitle.textContent = "🌐 PWA Optimization: Meta & Viewport";
    DOM.calloutText.textContent = "Ensure mobile web app standalone display tags are declared in head.";
  } else {
    DOM.calloutTitle.textContent = "⚡ Code Analysis: High-Efficiency Format";
    DOM.calloutText.textContent = "Clean file structure loaded into editor.";
  }

  const lineCount = file.content.split('\n').length;
  DOM.editorLineNumbers.innerHTML = Array.from({length: lineCount}, (_, i) => i + 1).join('<br>');
}

function renderTabBar() {
  DOM.editorTabBar.innerHTML = '';

  state.openTabs.forEach((tab, index) => {
    const tabEl = document.createElement('div');
    tabEl.className = `editor-tab ${index === state.activeTabIndex ? 'active' : ''}`;
    tabEl.innerHTML = `
      <span>${tab.name}</span>
      <span class="tab-close" data-index="${index}">×</span>
    `;

    tabEl.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-close')) {
        e.stopPropagation();
        closeTab(index);
      } else {
        setActiveTab(index);
      }
    });

    DOM.editorTabBar.appendChild(tabEl);
  });
}

function closeTab(index) {
  state.openTabs.splice(index, 1);
  if (state.activeTabIndex >= state.openTabs.length) {
    state.activeTabIndex = state.openTabs.length - 1;
  }
  setActiveTab(state.activeTabIndex);
}

async function saveActiveFileToDisk() {
  const activeTab = state.openTabs[state.activeTabIndex];
  if (!activeTab) return;

  if (state.isDesktopConnected) {
    try {
      const res = await fetch(`${state.bridgeUrl}/api/file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: activeTab.path, content: activeTab.content })
      });
      if (res.ok) {
        DOM.saveIndicator.textContent = 'Saved to Disk';
        DOM.saveIndicator.style.background = 'rgba(0, 230, 118, 0.1)';
        DOM.saveIndicator.style.color = 'var(--accent-green)';
        addTerminalLine(`[Bridge] Saved <strong>${activeTab.path}</strong> to desktop disk.`, 'cmd-success');
      }
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  } else {
    DOM.saveIndicator.textContent = 'Saved (Demo)';
  }
}

function getFileIcon(filename) {
  if (filename.endsWith('.html')) return '🌐';
  if (filename.endsWith('.css')) return '🎨';
  if (filename.endsWith('.js') || filename.endsWith('.ts') || filename.endsWith('.tsx')) return '📄';
  if (filename.endsWith('.json')) return '⚙️';
  if (filename.endsWith('.py')) return '🐍';
  return '📄';
}

function simulateSyntaxHighlight(code, ext) {
  let safeCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (['js', 'ts', 'tsx', 'py'].includes(ext)) {
    safeCode = safeCode.replace(/(\/\/.*)/g, '<span class="token-comment">$1</span>');
    const keywords = ['const', 'let', 'var', 'function', 'import', 'export', 'default', 'return', 'if', 'else', 'def', 'require'];
    keywords.forEach(kw => {
      const reg = new RegExp(`\\b${kw}\\b`, 'g');
      safeCode = safeCode.replace(reg, `<span class="token-keyword">${kw}</span>`);
    });
    safeCode = safeCode.replace(/(["'`])(.*?)\1/g, '<span class="token-string">$1$2$1</span>');
  }
  return safeCode;
}

/* ==========================================
   TERMINAL SHELL INTEGRATION
   ========================================== */
function setupTerminalListeners() {
  DOM.terminalInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const command = DOM.terminalInput.value.trim();
      DOM.terminalInput.value = '';
      if (!command) return;

      addTerminalLine(`antigravity@macbook % ${command}`, 'term-line');

      if (state.isDesktopConnected) {
        try {
          const res = await fetch(`${state.bridgeUrl}/api/exec`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command })
          });
          if (res.ok) {
            const result = await res.json();
            if (result.stdout) addTerminalLine(result.stdout.replace(/\n/g, '<br>'), 'cmd-output');
            if (result.stderr) addTerminalLine(result.stderr.replace(/\n/g, '<br>'), 'cmd-error');
          }
        } catch (err) {
          addTerminalLine(`Bridge exec error: ${err.message}`, 'cmd-error');
        }
      } else {
        if (command === 'help') {
          addTerminalLine(`Available Demo CLI Commands: help, ls, cat, git status, npm run test, npm run dev, clear`, 'cmd-header');
        } else if (command === 'clear') {
          DOM.terminalLogs.innerHTML = '';
        } else {
          addTerminalLine(`Demo Output for: ${command}`, 'cmd-output');
        }
      }
    }
  });
}

function addTerminalLine(text, className = '') {
  const line = document.createElement('div');
  line.className = `term-line ${className}`;
  line.innerHTML = text;
  DOM.terminalLogs.appendChild(line);
  DOM.terminalBody.scrollTop = DOM.terminalBody.scrollHeight;
}

/* ==========================================
   TAB NAVIGATION
   ========================================== */
function setupTabListeners() {
  DOM.tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  state.activeTab = tabId;
  DOM.tabs.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId));
  DOM.panels.forEach(panel => panel.classList.toggle('active', panel.id === `panel-${tabId}`));
}

/* ==========================================
   DRAWER & SETTINGS
   ========================================== */
function setupDrawerListeners() {
  DOM.sidebarToggle.addEventListener('click', () => {
    DOM.workspaceDrawer.classList.add('active');
    DOM.drawerOverlay.classList.add('active');
  });
  DOM.drawerClose.addEventListener('click', closeDrawer);
  DOM.drawerOverlay.addEventListener('click', closeDrawer);
}
function closeDrawer() {
  DOM.workspaceDrawer.classList.remove('active');
  DOM.drawerOverlay.classList.remove('active');
}

function setupGitListeners() {
  DOM.gitCommitBtn.addEventListener('click', () => {
    alert("Commit & push simulation triggered!");
  });
}
function renderGitPanel() {}

function setupAgentListeners() {
  DOM.simulationRunBtn.addEventListener('click', () => {
    addTerminalLine("Triggered live agent run simulation.", "cmd-header");
    switchTab('agent');
  });
  DOM.sendGoalBtn.addEventListener('click', () => {
    const val = DOM.agentGoalInput.value.trim();
    if (!val) return;
    DOM.agentGoalInput.value = '';
    const msg = document.createElement('div');
    msg.className = 'timeline-event sys-event';
    msg.innerHTML = `<div class="event-icon">🎯</div><div class="event-body"><p class="event-title">Goal Executed</p><p class="event-desc">${val}</p></div>`;
    DOM.agentTimeline.appendChild(msg);
  });
}

function setupSettingsListeners() {
  DOM.accentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      setAccentColor(dot.getAttribute('data-color'));
    });
  });
}

function setAccentColor(color) {
  state.accentColor = color;
  localStorage.setItem('pwaAccent', color);
  DOM.accentDots.forEach(d => d.classList.toggle('active', d.getAttribute('data-color') === color));

  let val = '#00e5ff', rgb = '0, 229, 255', glow = 'rgba(0, 229, 255, 0.25)';
  if (color === 'purple') { val = '#b026ff'; rgb = '176, 38, 255'; glow = 'rgba(176, 38, 255, 0.25)'; }
  if (color === 'green') { val = '#00e676'; rgb = '0, 230, 118'; glow = 'rgba(0, 230, 118, 0.25)'; }
  if (color === 'amber') { val = '#ffea00'; rgb = '255, 234, 0'; glow = 'rgba(255, 234, 0, 0.25)'; }

  document.documentElement.style.setProperty('--theme-accent', val);
  document.documentElement.style.setProperty('--theme-accent-rgb', rgb);
  document.documentElement.style.setProperty('--theme-accent-glow', glow);
}

// Start Application
init();
