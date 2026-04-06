const { spawn, execSync } = require('child_process');
const path = require('path');

// Colors for the terminal
const green = '\x1b[32m';
const blue = '\x1b[34m';
const magenta = '\x1b[35m';
const cyan = '\x1b[36m';
const red = '\x1b[31m';
const yellow = '\x1b[33m';
const reset = '\x1b[0m';
const bold = '\x1b[1m';

console.log(`${bold}${magenta}=================================================${reset}`);
console.log(`${bold}${magenta}   🚀 GREENIE CULTURE - PROJECT STARTUP   ${reset}`);
console.log(`${bold}${magenta}=================================================${reset}`);

// Step 0: Clean existing processes on ports 3000 and 5000
console.log(`${yellow}🧹 Cleaning existing processes on ports 3000 and 5000...${reset}`);
try {
  const ports = [3000, 5000];
  ports.forEach(port => {
    try {
      execSync(`powershell -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }"`, { stdio: 'ignore' });
    } catch (e) {
      // Ignore if no process found
    }
  });
  console.log(`${green}✅ Ports are ready!${reset}`);
} catch (e) {
  console.log(`${red}⚠️  Could not clean ports, but proceeding anyway...${reset}`);
}

console.log(`\n${bold}${cyan}🔗 QUICK ACCESS LINKS:${reset}`);
console.log(`${bold}🏠 Main Website:${reset}  ${blue}http://localhost:3000${reset}`);
console.log(`${bold}⚙️  Backend API:${reset}   ${blue}http://localhost:5000${reset}`);
console.log(`\n${bold}${yellow}⏳ Starting Services...${reset}\n`);

// Function to run a command and pipe output
function runCommand(command, args, name, color) {
  const process = spawn(command, args, { 
    shell: true,
    stdio: 'inherit' // Pipe directly to our terminal
  });

  process.on('error', (err) => {
    console.error(`[${color}${name}${reset}] ${yellow}Error:${reset} ${err.message}`);
  });

  return process;
}

// 1. Start Backend
console.log(`[${blue}BACKEND${reset}] ${green}Initializing (Port 5000)...${reset}`);
const backend = runCommand('npm', ['run', 'dev', '--prefix', 'backend'], 'BACKEND', blue);

// 2. Start Frontend
console.log(`[${green}FRONTEND${reset}] ${green}Building & Serving (Port 3000)...${reset}`);
const frontend = runCommand('npm', ['start', '--prefix', 'frontend'], 'FRONTEND', green);

// Keep script alive and handle exit
process.on('SIGINT', () => {
    console.log(`\n${bold}${magenta}Stopping Services...${reset}`);
    backend.kill();
    frontend.kill();
    process.exit();
});
