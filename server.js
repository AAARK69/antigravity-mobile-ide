/**
 * Antigravity Desktop Bridge Server
 * Single-file, zero-dependency Node.js server that bridges the mobile PWA
 * to your desktop computer for live workspace sync & terminal command execution.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const url = require('url');

const PORT = process.env.PORT || 3001;
const WORKSPACE_ROOT = path.resolve(__dirname);

// Helper for CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Read JSON Body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Build File Tree recursively
function getDirectoryTree(dirPath, relativeTo = WORKSPACE_ROOT) {
  const items = fs.readdirSync(dirPath);
  const tree = [];

  for (const item of items) {
    if (item === '.git' || item === 'node_modules' || item === '.DS_Store') continue;
    
    const fullPath = path.join(dirPath, item);
    const relPath = path.relative(relativeTo, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      tree.push({
        name: item,
        path: relPath,
        type: 'directory',
        children: getDirectoryTree(fullPath, relativeTo)
      });
    } else {
      tree.push({
        name: item,
        path: relPath,
        type: 'file',
        size: stat.size
      });
    }
  }

  return tree;
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  try {
    // 1. Health & System Status Endpoint
    if (req.method === 'GET' && pathname === '/api/status') {
      const freeMem = os.freemem();
      const totalMem = os.totalmem();
      const cpus = os.cpus();
      
      const statusData = {
        online: true,
        os: `${os.type()} ${os.release()} (${os.arch()})`,
        hostname: os.hostname(),
        cpuModel: cpus[0] ? cpus[0].model : 'Generic CPU',
        cpuCores: cpus.length,
        memUsedMb: Math.round((totalMem - freeMem) / 1024 / 1024),
        memTotalMb: Math.round(totalMem / 1024 / 1024),
        memUsagePercent: Math.round(((totalMem - freeMem) / totalMem) * 100),
        uptimeSeconds: Math.round(os.uptime()),
        workspaceRoot: WORKSPACE_ROOT,
        nodeVersion: process.version
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(statusData));
      return;
    }

    // 2. Fetch Real Workspace File Tree
    if (req.method === 'GET' && pathname === '/api/workspace') {
      const tree = getDirectoryTree(WORKSPACE_ROOT);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ root: WORKSPACE_ROOT, tree }));
      return;
    }

    // 3. Read Specific File Content
    if (req.method === 'GET' && pathname === '/api/file') {
      const targetRelPath = parsedUrl.query.path;
      if (!targetRelPath) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing path query parameter' }));
        return;
      }

      const fullPath = path.join(WORKSPACE_ROOT, targetRelPath);
      // Prevent directory traversal attacks outside workspace
      if (!fullPath.startsWith(WORKSPACE_ROOT)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Access denied: outside workspace bounds' }));
        return;
      }

      if (!fs.existsSync(fullPath)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'File not found' }));
        return;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ path: targetRelPath, content }));
      return;
    }

    // 4. Save Modified File Content
    if (req.method === 'POST' && pathname === '/api/file') {
      const body = await parseJsonBody(req);
      if (!body.path || body.content === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Body must include path and content' }));
        return;
      }

      const fullPath = path.join(WORKSPACE_ROOT, body.path);
      if (!fullPath.startsWith(WORKSPACE_ROOT)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Access denied: outside workspace bounds' }));
        return;
      }

      // Ensure directory exists
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, body.content, 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, path: body.path }));
      return;
    }

    // 5. Execute Command on Desktop Shell
    if (req.method === 'POST' && pathname === '/api/exec') {
      const body = await parseJsonBody(req);
      if (!body.command) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Command required' }));
        return;
      }

      const targetCwd = body.cwd ? path.resolve(WORKSPACE_ROOT, body.cwd) : WORKSPACE_ROOT;

      exec(body.command, { cwd: targetCwd, timeout: 30000 }, (error, stdout, stderr) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          command: body.command,
          exitCode: error ? error.code || 1 : 0,
          stdout: stdout || '',
          stderr: stderr || (error ? error.message : '')
        }));
      });
      return;
    }

    // 6. Streaming Command Output (Server-Sent Events)
    if (req.method === 'GET' && pathname === '/api/stream-exec') {
      const cmd = parsedUrl.query.command;
      if (!cmd) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Command query required' }));
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      const child = exec(cmd, { cwd: WORKSPACE_ROOT });

      child.stdout.on('data', data => {
        res.write(`data: ${JSON.stringify({ type: 'stdout', text: data.toString() })}\n\n`);
      });

      child.stderr.on('data', data => {
        res.write(`data: ${JSON.stringify({ type: 'stderr', text: data.toString() })}\n\n`);
      });

      child.on('close', code => {
        res.write(`data: ${JSON.stringify({ type: 'end', exitCode: code })}\n\n`);
        res.end();
      });

      req.on('close', () => {
        child.kill();
      });
      return;
    }

    // Default 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));

  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`⚡ Antigravity Desktop Bridge Server Running!`);
  console.log(`📍 Port: http://localhost:${PORT}`);
  console.log(`📁 Workspace Root: ${WORKSPACE_ROOT}`);
  console.log(`===================================================`);
});
