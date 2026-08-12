/* ==========================================
   Antigravity Mobile IDE - Core Logic
   ========================================== */

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}

// Global Virtual Filesystem Database
const WORKSPACES = {
  'antigravity-mobile-ide': {
    name: 'antigravity-mobile-ide',
    icon: '⚡',
    description: 'Active Mobile IDE Project',
    files: {
      'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>Antigravity Mobile IDE</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root"></div>
  <script src="app.js"></script>
</body>
</html>`,
      'styles.css': `/* Mobile IDE Theme Styles */
:root {
  --theme-accent: #00e5ff;
  --bg-primary: #06080d;
}
body {
  background: var(--bg-primary);
  color: #fff;
}`,
      'app.js': `// Antigravity AI Mobile Client core file
console.log("Antigravity client ready.");`,
      'package.json': `{
  "name": "antigravity-mobile-ide",
  "version": "1.3.0",
  "private": true,
  "scripts": {
    "dev": "static-server . -p 3000",
    "test": "jest tests/"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4"
  }
}`
    },
    git: [
      { path: 'app.js', status: 'modified', staged: false, contentBefore: 'console.log("Antigravity client ready.");', contentAfter: 'console.log("Antigravity client initialized.");\n// Added custom theme hook\nconst activeAccent = localStorage.getItem("accent") || "cyan";' },
      { path: 'styles.css', status: 'modified', staged: false, contentBefore: '/* Mobile IDE Theme Styles */', contentAfter: '/* Mobile IDE Theme Styles */\n.theme-cyan { --theme-accent: #00e5ff; }\n.theme-purple { --theme-accent: #b026ff; }' },
      { path: 'package.json', status: 'modified', staged: true, contentBefore: '"version": "1.3.0"', contentAfter: '"version": "1.3.1"' }
    ]
  },
  'habit-tracker-pwa': {
    name: 'habit-tracker-pwa',
    icon: '✨',
    description: 'TypeScript Next.js App',
    files: {
      'package.json': `{
  "name": "habit-tracker-pwa",
  "dependencies": {
    "next": "16.2.11",
    "react": "19.2.4",
    "supabase": "^2.110.8"
  }
}`,
      'src/app/page.tsx': `import HabitList from '../components/HabitList';

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">yurr</h1>
      <HabitList />
    </main>
  );
}`,
      'src/components/HabitList.tsx': `import React from 'react';

export default function HabitList() {
  return (
    <div className="habit-list">
      <p>Your habit completing streaks...</p>
    </div>
  );
}`
    },
    git: []
  },
  'ti84_ap_stats': {
    name: 'ti84_ap_stats',
    icon: '📊',
    description: 'AP Stats Problem Solver',
    files: {
      'apstats.py': `import math

def z_test(sample_mean, null_hypothesis, std_dev, n):
    standard_error = std_dev / math.sqrt(n)
    z_score = (sample_mean - null_hypothesis) / standard_error
    return z_score`,
      'tests.py': `from apstats import z_test

def run_tests():
    score = z_test(105, 100, 15, 30)
    print(f"Calculated Z-Score: {score:.4f}")
    assert round(score, 2) == 1.83
    print("Test passed.")`
    },
    git: []
  },
  'antigravity-organizer': {
    name: 'antigravity-organizer',
    icon: '📁',
    description: 'MacOS Automation',
    files: {
      'organizer.py': `import os
import shutil

def clean_downloads():
    path = os.path.expanduser('~/Downloads')
    for file in os.listdir(path):
        # Sort files into smart folders
        print(f"Sorting file: {file}")`,
      'config.yaml': `rules:
  documents: [.pdf, .docx, .txt]
  images: [.png, .jpg, .jpeg]
  archives: [.zip, .dmg]`
    },
    git: []
  }
};

// Global App State
let state = {
  currentWorkspace: 'antigravity-mobile-ide',
  activeTab: 'agent',
  selectedFile: null,
  model: 'gemini-3.5-flash',
  isBypassSandbox: false,
  isAutoApproveRead: true,
  pushEnabled: false,
  accentColor: 'cyan',
  isAgentRunning: false,
  agentDuration: 0.0,
  agentDurationInterval: null,
  toolsUsed: 0
};

// DOM References
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
  projectItems: document.querySelectorAll('.project-item'),
  
  // Agent tab refs
  agentTimeline: document.getElementById('agentTimeline'),
  agentGoalInput: document.getElementById('agentGoalInput'),
  sendGoalBtn: document.getElementById('sendGoalBtn'),
  quickPromptBtns: document.querySelectorAll('.quick-prompt-btn'),
  activeAgentState: document.getElementById('activeAgentState'),
  runDuration: document.getElementById('runDuration'),
  toolExecCount: document.getElementById('toolExecCount'),
  agentRunningBadge: document.querySelector('.agent-running-badge'),

  // Files tab refs
  fileTreeContainer: document.getElementById('fileTreeContainer'),
  editorFilename: document.getElementById('editorFilename'),
  editorLineNumbers: document.getElementById('editorLineNumbers'),
  codeText: document.getElementById('codeText'),
  editorLang: document.getElementById('editorLang'),
  saveIndicator: document.getElementById('saveIndicator'),
  refreshTree: document.getElementById('refreshTree'),

  // Git tab refs
  gitChangeCount: document.getElementById('gitChangeCount'),
  gitFileList: document.getElementById('gitFileList'),
  gitDiffContainer: document.getElementById('gitDiffContainer'),
  commitMessageInput: document.getElementById('commitMessageInput'),
  gitCommitBtn: document.getElementById('gitCommitBtn'),

  // Terminal tab refs
  terminalLogs: document.getElementById('terminalLogs'),
  terminalInput: document.getElementById('terminalInput'),
  terminalBody: document.getElementById('terminalBody'),

  // Settings/Skills refs
  settingsBypassSandbox: document.getElementById('settingsBypassSandbox'),
  settingsAutoApproveRead: document.getElementById('settingsAutoApproveRead'),
  requestPushBtn: document.getElementById('requestPushBtn'),
  accentDots: document.querySelectorAll('.accent-dot'),
  pwaNotification: document.getElementById('pwaNotification'),
  notifTitle: document.getElementById('notifTitle'),
  notifDesc: document.getElementById('notifDesc')
};

/* ==========================================
   INITIALIZATION & CLOCK
   ========================================== */
function init() {
  updateClock();
  setInterval(updateClock, 60000);
  
  // Set up event listeners
  setupTabListeners();
  setupSettingsListeners();
  setupDrawerListeners();
  setupTerminalListeners();
  setupFileListeners();
  setupGitListeners();
  setupAgentListeners();

  // Load active workspace
  loadWorkspace(state.currentWorkspace);

  // Restore saved accent if exists
  const savedAccent = localStorage.getItem('pwaAccent') || 'cyan';
  setAccentColor(savedAccent);
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
  DOM.tabs.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  DOM.panels.forEach(panel => {
    if (panel.id === `panel-${tabId}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // Extra layout updates on tab active
  if (tabId === 'terminal') {
    scrollTerminalToBottom();
    DOM.terminalInput.focus();
  }
}

/* ==========================================
   WORKSPACE DRAWER
   ========================================== */
function setupDrawerListeners() {
  DOM.sidebarToggle.addEventListener('click', () => {
    DOM.workspaceDrawer.classList.add('active');
    DOM.drawerOverlay.classList.add('active');
  });

  DOM.drawerClose.addEventListener('click', closeDrawer);
  DOM.drawerOverlay.addEventListener('click', closeDrawer);

  // Setup list item listeners
  document.getElementById('navToHabits').addEventListener('click', () => selectWorkspaceFromDrawer('habit-tracker-pwa'));
  document.getElementById('navToStats').addEventListener('click', () => selectWorkspaceFromDrawer('ti84_ap_stats'));
  document.getElementById('navToOrganizer').addEventListener('click', () => selectWorkspaceFromDrawer('antigravity-organizer'));
  
  // Custom project item inside HTML click (active workspace link)
  DOM.projectItems[0].addEventListener('click', () => selectWorkspaceFromDrawer('antigravity-mobile-ide'));
}

function closeDrawer() {
  DOM.workspaceDrawer.classList.remove('active');
  DOM.drawerOverlay.classList.remove('active');
}

function selectWorkspaceFromDrawer(workspaceKey) {
  closeDrawer();
  loadWorkspace(workspaceKey);
  
  // Visual select indicators
  document.querySelectorAll('.project-item').forEach(item => {
    item.classList.remove('active');
  });

  if (workspaceKey === 'antigravity-mobile-ide') DOM.projectItems[0].classList.add('active');
  if (workspaceKey === 'habit-tracker-pwa') document.getElementById('navToHabits').classList.add('active');
  if (workspaceKey === 'ti84_ap_stats') document.getElementById('navToStats').classList.add('active');
  if (workspaceKey === 'antigravity-organizer') document.getElementById('navToOrganizer').classList.add('active');

  // Trigger terminal log
  addTerminalLine(`Directory changed to /Users/rohankosur/Documents/GithubProjects/${workspaceKey}`, 'cmd-header');
  addTerminalLine(`Auto-loaded target files into the local workspace cache.`, 'cmd-output');
}

function loadWorkspace(workspaceKey) {
  state.currentWorkspace = workspaceKey;
  state.selectedFile = null;
  
  // Reset editor text
  DOM.editorFilename.textContent = 'Select a file';
  DOM.codeText.textContent = '// Choose a file from the workspace sidebar menu to inspect or edit the codebase.';
  DOM.editorLineNumbers.innerHTML = '1';
  DOM.editorLang.textContent = 'None';
  DOM.saveIndicator.classList.add('hidden');

  renderFileTree();
  renderGitPanel();
}

/* ==========================================
   FILE EXPLORER & EDITOR
   ========================================== */
function renderFileTree() {
  DOM.fileTreeContainer.innerHTML = '';
  const workspace = WORKSPACES[state.currentWorkspace];
  
  // Find unique folders
  const paths = Object.keys(workspace.files);
  const folders = new Set();
  const rootFiles = [];

  paths.forEach(p => {
    if (p.includes('/')) {
      const parts = p.split('/');
      folders.add(parts[0]);
    } else {
      rootFiles.push(p);
    }
  });

  // Render Folders first
  folders.forEach(folderName => {
    const folderNode = document.createElement('div');
    folderNode.className = 'tree-node folder-node';
    folderNode.innerHTML = `<span class="node-icon">📁</span><span>${folderName}/</span>`;
    DOM.fileTreeContainer.appendChild(folderNode);

    // Render children
    paths.forEach(p => {
      if (p.startsWith(`${folderName}/`)) {
        const fileNode = document.createElement('div');
        fileNode.className = 'tree-node file-node';
        fileNode.setAttribute('data-path', p);
        const fileName = p.split('/').slice(-1)[0];
        fileNode.innerHTML = `<span class="node-icon">${getFileIcon(fileName)}</span><span>${fileName}</span>`;
        fileNode.addEventListener('click', () => selectFile(p));
        DOM.fileTreeContainer.appendChild(fileNode);
      }
    });
  });

  // Render Root files
  rootFiles.forEach(p => {
    const fileNode = document.createElement('div');
    fileNode.className = 'tree-node file-node';
    fileNode.setAttribute('data-path', p);
    fileNode.innerHTML = `<span class="node-icon">${getFileIcon(p)}</span><span>${p}</span>`;
    fileNode.addEventListener('click', () => selectFile(p));
    DOM.fileTreeContainer.appendChild(fileNode);
  });
}

function getFileIcon(filename) {
  if (filename.endsWith('.html')) return '🌐';
  if (filename.endsWith('.css')) return '🎨';
  if (filename.endsWith('.js') || filename.endsWith('.ts') || filename.endsWith('.tsx')) return '📄';
  if (filename.endsWith('.json')) return '⚙️';
  if (filename.endsWith('.py')) return '🐍';
  if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return '📝';
  return '📄';
}

function setupFileListeners() {
  DOM.refreshTree.addEventListener('click', () => {
    renderFileTree();
    addTerminalLine(`Refreshed virtual file explorer cache.`, 'cmd-output');
  });
}

function selectFile(filePath) {
  state.selectedFile = filePath;
  
  // Highlight in file tree
  document.querySelectorAll('.file-node').forEach(node => {
    if (node.getAttribute('data-path') === filePath) {
      node.classList.add('active');
    } else {
      node.classList.remove('active');
    }
  });

  const workspace = WORKSPACES[state.currentWorkspace];
  const content = workspace.files[filePath];
  
  DOM.editorFilename.textContent = filePath.split('/').slice(-1)[0];
  DOM.saveIndicator.classList.remove('hidden');
  DOM.saveIndicator.textContent = 'Saved';
  DOM.saveIndicator.style.background = 'rgba(0, 230, 118, 0.1)';
  DOM.saveIndicator.style.color = 'var(--accent-green)';

  // Determine Language
  const ext = filePath.split('.').slice(-1)[0];
  let lang = 'Plain Text';
  if (ext === 'html') lang = 'HTML';
  if (ext === 'css') lang = 'CSS';
  if (ext === 'js') lang = 'JavaScript';
  if (ext === 'ts' || ext === 'tsx') lang = 'TypeScript';
  if (ext === 'json') lang = 'JSON';
  if (ext === 'py') lang = 'Python';
  DOM.editorLang.textContent = lang;

  // Render Editor code & line numbers
  DOM.codeText.innerHTML = simulateSyntaxHighlight(content, ext);
  
  const lineCount = content.split('\n').length;
  DOM.editorLineNumbers.innerHTML = Array.from({length: lineCount}, (_, i) => i + 1).join('<br>');
}

function simulateSyntaxHighlight(code, ext) {
  // Safe HTML escapes
  let safeCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (ext === 'js' || ext === 'ts' || ext === 'tsx' || ext === 'py') {
    // Comments
    safeCode = safeCode.replace(/(\/\/.*)/g, '<span class="token-comment">$1</span>');
    safeCode = safeCode.replace(/(#.*)/g, '<span class="token-comment">$1</span>');
    
    // Keywords
    const keywords = ['const', 'let', 'var', 'function', 'import', 'export', 'default', 'return', 'if', 'else', 'def', 'class', 'from', 'assert', 'for', 'in', 'while'];
    keywords.forEach(kw => {
      const reg = new RegExp(`\\b${kw}\\b`, 'g');
      safeCode = safeCode.replace(reg, `<span class="token-keyword">${kw}</span>`);
    });

    // Strings
    safeCode = safeCode.replace(/(["'`])(.*?)\1/g, '<span class="token-string">$1$2$1</span>');
    
    // Numbers
    safeCode = safeCode.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');
  } else if (ext === 'json') {
    safeCode = safeCode.replace(/(["'])(.*?)\1(\s*:)/g, '<span class="token-keyword">$1$2$1</span>$3');
    safeCode = safeCode.replace(/(["'])(.*?)\1/g, '<span class="token-string">$1$2$1</span>');
    safeCode = safeCode.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');
  }
  
  return safeCode;
}

/* ==========================================
   GIT MANAGER
   ========================================== */
function setupGitListeners() {
  DOM.gitCommitBtn.addEventListener('click', () => {
    const msg = DOM.commitMessageInput.value.trim();
    if (!msg) {
      alert("Please enter a commit message.");
      return;
    }

    // Check if anything is staged
    const workspace = WORKSPACES[state.currentWorkspace];
    const stagedFiles = workspace.git.filter(f => f.staged);

    if (stagedFiles.length === 0) {
      alert("No changes staged to commit.");
      return;
    }

    // Switch to Terminal and run git commit
    switchTab('terminal');
    addTerminalLine(`antigravity@macbook % git commit -m "${msg}"`, 'term-line');
    
    setTimeout(() => {
      stagedFiles.forEach(f => {
        addTerminalLine(`  [main ${Math.random().toString(16).substr(2, 6)}] committed: ${f.path}`, 'cmd-success');
        // Update files state to apply the git diff modifications
        workspace.files[f.path] = f.contentAfter;
      });
      
      // Remove committed files from modifications list
      workspace.git = workspace.git.filter(f => !f.staged);
      
      addTerminalLine(`Committed ${stagedFiles.length} file(s) to git repository.`, 'cmd-output');
      addTerminalLine(`antigravity@macbook % git push origin main`, 'term-line');
      
      setTimeout(() => {
        addTerminalLine(`Everything up-to-date. Successfully pushed main to GitHub.`, 'cmd-success');
        renderGitPanel();
        DOM.commitMessageInput.value = '';
      }, 1000);

    }, 800);
  });
}

function renderGitPanel() {
  DOM.gitFileList.innerHTML = '';
  const workspace = WORKSPACES[state.currentWorkspace];
  
  if (!workspace.git || workspace.git.length === 0) {
    DOM.gitFileList.innerHTML = '<div class="git-empty-state">No changes to stage. Clean repository.</div>';
    DOM.gitChangeCount.classList.add('hidden');
    DOM.gitDiffContainer.textContent = 'Select a modified file to view diff details.';
    return;
  }

  // Update badge count
  DOM.gitChangeCount.classList.remove('hidden');
  DOM.gitChangeCount.textContent = workspace.git.length;

  workspace.git.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'git-file-item';
    row.innerHTML = `
      <div class="git-file-left">
        <input type="checkbox" class="git-checkbox" ${item.staged ? 'checked' : ''} data-index="${index}">
        <span class="git-path">${item.path}</span>
      </div>
      <span class="git-status-indicator ${item.status}">${item.status}</span>
    `;

    // Clicking file row (outside checkbox) loads diff
    row.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        showGitDiff(item);
      }
    });

    // Checkbox toggles staged status
    row.querySelector('.git-checkbox').addEventListener('change', (e) => {
      item.staged = e.target.checked;
      renderGitPanel();
    });

    DOM.gitFileList.appendChild(row);
  });
}

function showGitDiff(gitItem) {
  const container = DOM.gitDiffContainer;
  container.innerHTML = '';

  const header = document.createElement('div');
  header.style.color = 'var(--text-muted)';
  header.style.marginBottom = '6px';
  header.textContent = `diff --git a/${gitItem.path} b/${gitItem.path}`;
  container.appendChild(header);

  const linesBefore = gitItem.contentBefore.split('\n');
  const linesAfter = gitItem.contentAfter.split('\n');

  // Simple rendering of differences
  linesBefore.forEach(line => {
    if (!linesAfter.includes(line)) {
      const el = document.createElement('span');
      el.className = 'diff-removed';
      el.textContent = `- ${line}`;
      container.appendChild(el);
    }
  });

  linesAfter.forEach(line => {
    if (!linesBefore.includes(line)) {
      const el = document.createElement('span');
      el.className = 'diff-added';
      el.textContent = `+ ${line}`;
      container.appendChild(el);
    } else {
      const el = document.createElement('span');
      el.textContent = `  ${line}`;
      container.appendChild(el);
    }
  });
}

/* ==========================================
   TERMINAL SHELL SIMULATOR
   ========================================== */
function setupTerminalListeners() {
  DOM.terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = DOM.terminalInput.value.trim();
      DOM.terminalInput.value = '';
      if (command) {
        handleTerminalCommand(command);
      }
    }
  });
}

function addTerminalLine(text, className = '') {
  const line = document.createElement('div');
  line.className = `term-line ${className}`;
  line.innerHTML = text;
  DOM.terminalLogs.appendChild(line);
  scrollTerminalToBottom();
}

function scrollTerminalToBottom() {
  DOM.terminalBody.scrollTop = DOM.terminalBody.scrollHeight;
}

function handleTerminalCommand(rawCmd) {
  addTerminalLine(`antigravity@macbook % ${rawCmd}`, 'term-line');
  
  const parts = rawCmd.split(' ');
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ');

  const workspace = WORKSPACES[state.currentWorkspace];

  switch(cmd) {
    case 'help':
      addTerminalLine(`Available CLI Commands:`, 'cmd-header');
      addTerminalLine(`  help              - List available commands`);
      addTerminalLine(`  ls                - List files in current directory`);
      addTerminalLine(`  cat &lt;file&gt;        - View details of a file`);
      addTerminalLine(`  git status        - Show staged and unstaged repo changes`);
      addTerminalLine(`  npm run test      - Run automated tests in workspace`);
      addTerminalLine(`  npm run dev       - Boot a local preview developer server`);
      addTerminalLine(`  clear             - Clear output log console`);
      break;
    
    case 'clear':
      DOM.terminalLogs.innerHTML = '';
      break;

    case 'ls':
      const files = Object.keys(workspace.files);
      addTerminalLine(`Listing files in workspace: <strong>${state.currentWorkspace}</strong>`, 'cmd-header');
      files.forEach(f => {
        addTerminalLine(`  📄 ${f}`);
      });
      break;

    case 'cat':
      if (!arg) {
        addTerminalLine(`Error: specify file path. Example: cat index.html`, 'cmd-error');
        break;
      }
      if (workspace.files[arg] !== undefined) {
        addTerminalLine(`--- reading ${arg} ---`, 'cmd-header');
        const escapedContent = workspace.files[arg]
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        addTerminalLine(escapedContent.replace(/\n/g, '<br>'));
      } else {
        addTerminalLine(`Error: File not found: ${arg}`, 'cmd-error');
      }
      break;

    case 'git':
      if (arg === 'status') {
        addTerminalLine(`🌿 On branch main`, 'cmd-header');
        if (workspace.git.length === 0) {
          addTerminalLine(`nothing to commit, working tree clean`, 'cmd-success');
          break;
        }
        
        const staged = workspace.git.filter(f => f.staged);
        const unstaged = workspace.git.filter(f => !f.staged);

        if (staged.length > 0) {
          addTerminalLine(`Changes to be committed:`, 'cmd-success');
          staged.forEach(f => addTerminalLine(`  staged: ${f.path}`, 'cmd-success'));
        }
        if (unstaged.length > 0) {
          addTerminalLine(`Changes not staged for commit:`, 'cmd-error');
          unstaged.forEach(f => addTerminalLine(`  modified: ${f.path}`, 'cmd-error'));
        }
      } else {
        addTerminalLine(`Command mock: git ${arg} has been executed.`, 'cmd-output');
      }
      break;

    case 'npm':
      if (arg === 'run test') {
        runAutomatedTests();
      } else if (arg === 'run dev') {
        startMockDevServer();
      } else {
        addTerminalLine(`Running script package: npm ${arg}...`, 'cmd-output');
      }
      break;

    default:
      addTerminalLine(`zsh: command not found: ${cmd}. Type 'help' for support.`, 'cmd-error');
  }
}

function runAutomatedTests() {
  addTerminalLine(`&gt; testing ${state.currentWorkspace}...`, 'cmd-header');
  addTerminalLine(`Running JEST testing suite on container...`, 'cmd-output');
  
  let i = 0;
  const progressInterval = setInterval(() => {
    i += 20;
    addTerminalLine(`  [TEST SUITE] Progress: ${i}% completed`, 'cmd-output');
    if (i >= 100) {
      clearInterval(progressInterval);
      addTerminalLine(`PASS  tests/runner.test.js (4.21s)`, 'cmd-success');
      addTerminalLine(`  ✓ Verify model configuration bindings (18ms)`, 'cmd-success');
      addTerminalLine(`  ✓ Verify network request caching parameters (4ms)`, 'cmd-success');
      addTerminalLine(`Test Suites: 1 passed, 1 total`, 'cmd-success');
      addTerminalLine(`Tests:       2 passed, 2 total`, 'cmd-success');
      addTerminalLine(`Snapshots:   0 total`, 'cmd-output');
      addTerminalLine(`Time:        4.5s, estimated 5.0s`, 'cmd-output');
      addTerminalLine(`Ran all unit tests successfully.`, 'cmd-success');
    }
  }, 300);
}

function startMockDevServer() {
  addTerminalLine(`&gt; starting dev server...`, 'cmd-header');
  addTerminalLine(`[Ready] Compiled files dynamically.`, 'cmd-output');
  addTerminalLine(`[Hot Loader] Active file watcher binding.`, 'cmd-output');
  addTerminalLine(`🚀 Server running locally at: <a href="#" style="color:var(--accent-cyan); text-decoration:underline;">http://localhost:3000</a>`, 'cmd-success');
  addTerminalLine(`Web socket reload tunnels bound.`, 'cmd-output');
}

/* ==========================================
   AI AGENT FLOW & SIMULATOR
   ========================================== */
function setupAgentListeners() {
  DOM.simulationRunBtn.addEventListener('click', triggerAgentSimulation);
  
  DOM.sendGoalBtn.addEventListener('click', submitUserGoal);
  DOM.agentGoalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitUserGoal();
  });

  DOM.quickPromptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-prompt');
      DOM.agentGoalInput.value = text;
      submitUserGoal();
    });
  });
}

function submitUserGoal() {
  const goal = DOM.agentGoalInput.value.trim();
  if (!goal) return;
  DOM.agentGoalInput.value = '';

  // Append user bubble
  appendAgentMessage(goal, 'user-bubble');

  // Trigger agent response depending on goal
  setTimeout(() => {
    triggerAgentSimulation(goal);
  }, 1000);
}

function appendAgentMessage(text, className = '') {
  const bubble = document.createElement('div');
  bubble.className = `agent-bubble ${className}`;
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  DOM.agentTimeline.appendChild(bubble);
  scrollTimelineToBottom();
}

function appendTimelineEvent(title, desc, icon = '🤖', type = '') {
  const event = document.createElement('div');
  event.className = `timeline-event ${type}`;
  event.innerHTML = `
    <div class="event-icon">${icon}</div>
    <div class="event-body">
      <p class="event-title">${title}</p>
      <p class="event-desc">${desc}</p>
      <span class="event-meta">now</span>
    </div>
  `;
  DOM.agentTimeline.appendChild(event);
  scrollTimelineToBottom();
}

function scrollTimelineToBottom() {
  DOM.agentTimeline.scrollTop = DOM.agentTimeline.scrollHeight;
}

function triggerAgentSimulation(goal = '') {
  if (state.isAgentRunning) return;
  
  const targetGoal = goal || "Implement code changes for version update and verify via test runner.";
  
  // Start simulation state
  state.isAgentRunning = true;
  state.toolsUsed = 0;
  state.agentDuration = 0.0;
  DOM.activeAgentState.textContent = 'RUNNING';
  DOM.activeAgentState.style.color = 'var(--accent-red)';
  DOM.agentRunningBadge.classList.remove('hidden');

  appendTimelineEvent("Agent Goal Received", `Task: "${targetGoal}"`, '🎯');

  // Duration ticking
  DOM.runDuration.textContent = '0.0s';
  state.agentDurationInterval = setInterval(() => {
    state.agentDuration += 0.1;
    DOM.runDuration.textContent = `${state.agentDuration.toFixed(1)}s`;
  }, 100);

  // Step 1: Research (after 1s)
  setTimeout(() => {
    state.toolsUsed++;
    DOM.toolExecCount.textContent = state.toolsUsed;
    appendTimelineEvent(
      "Planning & Research: call_tool(grep_search)", 
      "Searching directories for configuration variables related to the task objective...", 
      "🔍", 
      "tool-event"
    );
  }, 1200);

  // Step 2: Thought Log (after 2.5s)
  setTimeout(() => {
    appendTimelineEvent(
      "Thought (Gemini 3.5 Flash)", 
      "Analyzing project requirements. I found files in the active workspace that need modifications. Let's write code tweaks into the index.html and style configuration.", 
      "💡", 
      "thought-event"
    );
  }, 3000);

  // Step 3: Edit File (after 4s)
  setTimeout(() => {
    state.toolsUsed++;
    DOM.toolExecCount.textContent = state.toolsUsed;
    appendTimelineEvent(
      "Modifying file: call_tool(replace_file_content)", 
      "Writing target content replacement strings into <strong>styles.css</strong> and <strong>app.js</strong>", 
      "✏️", 
      "tool-event"
    );

    // Let's modify the local cache of app.js and styles.css!
    const workspace = WORKSPACES['antigravity-mobile-ide'];
    // Make changes
    workspace.files['app.js'] = `// Antigravity AI Mobile Client core file\nconsole.log("Antigravity client initialized.");\n// Added custom theme hook\nconst activeAccent = localStorage.getItem("accent") || "cyan";`;
    workspace.files['styles.css'] = `/* Mobile IDE Theme Styles */\n:root {\n  --theme-accent: #00e5ff;\n  --bg-primary: #06080d;\n}\nbody {\n  background: var(--bg-primary);\n  color: #fff;\n}\n.theme-cyan { --theme-accent: #00e5ff; }\n.theme-purple { --theme-accent: #b026ff; }`;
    
    // Add to modified list if not already there
    if (workspace.git.length === 0) {
      workspace.git = [
        { path: 'app.js', status: 'modified', staged: false, contentBefore: 'console.log("Antigravity client ready.");', contentAfter: workspace.files['app.js'] },
        { path: 'styles.css', status: 'modified', staged: false, contentBefore: '/* Mobile IDE Theme Styles */', contentAfter: workspace.files['styles.css'] }
      ];
    }
    
    // Update files UI
    renderGitPanel();
    if (state.selectedFile === 'app.js') selectFile('app.js');
    if (state.selectedFile === 'styles.css') selectFile('styles.css');

  }, 4800);

  // Step 4: Run Tests (after 6.5s)
  setTimeout(() => {
    state.toolsUsed++;
    DOM.toolExecCount.textContent = state.toolsUsed;
    appendTimelineEvent(
      "Verifying changes: call_tool(run_command)", 
      "Executing verification script: <code>npm run test</code> inside the sandbox terminal container", 
      "🧪", 
      "tool-event"
    );

    // Log this command in the terminal logs as well!
    addTerminalLine(`antigravity@macbook % npm run test`, 'term-line');
    addTerminalLine(`Executing test suite from remote agent trigger...`, 'cmd-output');
    setTimeout(() => {
      addTerminalLine(`PASS  tests/runner.test.js (3.88s)`, 'cmd-success');
      addTerminalLine(`  ✓ Verify model configuration bindings (12ms)`, 'cmd-success');
      addTerminalLine(`  ✓ Verify network request caching parameters (3ms)`, 'cmd-success');
      addTerminalLine(`Ran all unit tests successfully.`, 'cmd-success');
    }, 1500);

  }, 6800);

  // Step 5: Finish (after 9.5s)
  setTimeout(() => {
    // Clear run duration interval
    clearInterval(state.agentDurationInterval);
    state.isAgentRunning = false;
    DOM.activeAgentState.textContent = 'COMPLETED';
    DOM.activeAgentState.style.color = 'var(--accent-green)';
    DOM.agentRunningBadge.classList.add('hidden');

    appendTimelineEvent(
      "Task Execution Complete", 
      "Successfully modified style tokens, verified integration via unit testing and loaded staged items into git drawer. Ready for commit.", 
      "🎉",
      "sys-event"
    );

    // Trigger PWA Push Notification Mock
    showNotification(
      "🎉 Task Finished Successfully", 
      `Antigravity agent compiled workspace changes and passed build tests in ${state.agentDuration.toFixed(1)}s.`
    );

  }, 9500);
}

function showNotification(title, text) {
  DOM.notifTitle.textContent = title;
  DOM.notifDesc.textContent = text;
  DOM.pwaNotification.classList.add('active');

  // Vibrate phone if supported
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100]);
  }

  // Slide up notification banner after 4s
  setTimeout(() => {
    DOM.pwaNotification.classList.remove('active');
  }, 5000);
}

/* ==========================================
   SETTINGS PANEL & THEMING
   ========================================== */
function setupSettingsListeners() {
  DOM.settingsBypassSandbox.addEventListener('change', (e) => {
    state.isBypassSandbox = e.target.checked;
    addTerminalLine(`Security configuration updated: bypass sandbox set to <strong>${state.isBypassSandbox}</strong>`, 'cmd-output');
  });

  DOM.settingsAutoApproveRead.addEventListener('change', (e) => {
    state.isAutoApproveRead = e.target.checked;
  });

  DOM.requestPushBtn.addEventListener('click', () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          state.pushEnabled = true;
          DOM.requestPushBtn.textContent = 'Enabled';
          DOM.requestPushBtn.style.color = 'var(--accent-green)';
        }
      });
    } else if (Notification.permission === 'granted') {
      alert("Push notifications are already active!");
    } else {
      alert("Notification access has been denied. Please reset permissions in your browser configurations.");
    }
  });

  DOM.accentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const color = dot.getAttribute('data-color');
      setAccentColor(color);
    });
  });
}

function setAccentColor(color) {
  state.accentColor = color;
  localStorage.setItem('pwaAccent', color);

  // Remove active styling on dots
  DOM.accentDots.forEach(d => d.classList.remove('active'));
  document.querySelector(`.dot-${color}`).classList.add('active');

  // Change CSS variable values on body
  let val, rgb, glow;
  if (color === 'cyan') {
    val = '#00e5ff';
    rgb = '0, 229, 255';
    glow = 'rgba(0, 229, 255, 0.25)';
  } else if (color === 'purple') {
    val = '#b026ff';
    rgb = '176, 38, 255';
    glow = 'rgba(176, 38, 255, 0.25)';
  } else if (color === 'green') {
    val = '#00e676';
    rgb = '0, 230, 118';
    glow = 'rgba(0, 230, 118, 0.25)';
  } else if (color === 'amber') {
    val = '#ffea00';
    rgb = '255, 234, 0';
    glow = 'rgba(255, 234, 0, 0.25)';
  }

  document.documentElement.style.setProperty('--theme-accent', val);
  document.documentElement.style.setProperty('--theme-accent-rgb', rgb);
  document.documentElement.style.setProperty('--theme-accent-glow', glow);
  
  // Re-glow phone case shadow dynamically
  const casing = document.querySelector('.phone-case');
  if (casing) {
    casing.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 30px 0 ${glow}`;
  }
}

// Start
init();
