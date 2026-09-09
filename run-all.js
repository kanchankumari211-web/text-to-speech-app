const { spawn } = require('child_process');
const path = require('path');

const serverDir = path.join(__dirname, 'text-to-speech/server');
const clientDir = path.join(__dirname, 'text-to-speech/client');

console.log('🚀 Starting Text-to-Speech Backend & Frontend...\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Start Express Server
const serverProcess = spawn(npmCmd, ['start'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

// 2. Start Vite Client
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\n🛑 Shutting down server and client...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
