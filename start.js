#!/usr/bin/env node

/**
 * SkoolCampus Startup Script (Cross-platform)
 * Starts both backend and frontend servers
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkNodeModules(dir) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  return fs.existsSync(nodeModulesPath);
}

function checkEnvFile() {
  const envPath = path.join('backend', '.env');
  if (!fs.existsSync(envPath)) {
    const envExamplePath = path.join('backend', '.env.example');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('⚠️  Created .env file from .env.example', colors.yellow);
      log('⚠️  Please edit backend/.env with your database credentials!', colors.yellow);
      log('', colors.reset);
    }
  }
}

function installDependencies(dir, name) {
  return new Promise((resolve, reject) => {
    log(`📦 Installing ${name} dependencies...`, colors.blue);

    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const install = spawn(npm, ['install'], {
      cwd: dir,
      stdio: 'inherit',
      shell: true,
    });

    install.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${name} installation failed`));
      } else {
        log(`✅ ${name} dependencies installed`, colors.green);
        resolve();
      }
    });
  });
}

async function main() {
  console.clear();
  log('========================================', colors.bright);
  log('    🎓 Starting SkoolCampus', colors.green);
  log('========================================', colors.bright);
  console.log('');

  try {
    // Check if dependencies are installed
    const backendHasModules = checkNodeModules('backend');
    const frontendHasModules = checkNodeModules('frontend');

    // Install if needed
    if (!backendHasModules) {
      await installDependencies('backend', 'Backend');
    }

    if (!frontendHasModules) {
      await installDependencies('frontend', 'Frontend');
    }

    // Check .env file
    checkEnvFile();

    log('', colors.reset);
    log('========================================', colors.bright);
    log('✅ Starting Backend (NestJS)...', colors.green);
    log('========================================', colors.bright);
    log('   Backend: http://localhost:3000', colors.blue);
    log('   API Docs: http://localhost:3000/api/docs', colors.blue);
    console.log('');

    // Start backend
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const backend = spawn(npm, ['run', 'start:dev'], {
      cwd: 'backend',
      stdio: 'inherit',
      shell: true,
    });

    // Wait for backend to initialize
    log('⏳ Waiting for backend to initialize (10 seconds)...', colors.yellow);
    await new Promise((resolve) => setTimeout(resolve, 10000));

    log('', colors.reset);
    log('========================================', colors.bright);
    log('✅ Starting Frontend (Angular)...', colors.green);
    log('========================================', colors.bright);
    log('   Frontend: http://localhost:4200', colors.blue);
    console.log('');

    // Start frontend
    const frontend = spawn(npm, ['start'], {
      cwd: 'frontend',
      stdio: 'inherit',
      shell: true,
    });

    // Wait for frontend to build
    log('⏳ Waiting for frontend to build (30 seconds)...', colors.yellow);
    await new Promise((resolve) => setTimeout(resolve, 30000));

    log('', colors.reset);
    log('========================================', colors.bright);
    log('    🚀 SkoolCampus is Ready!', colors.green);
    log('========================================', colors.bright);
    console.log('');
    log('📊 Services:', colors.blue);
    log('   Backend:  http://localhost:3000/api', colors.reset);
    log('   Frontend: http://localhost:4200', colors.reset);
    log('   API Docs: http://localhost:3000/api/docs', colors.reset);
    console.log('');
    log('✨ Open http://localhost:4200 in your browser!', colors.green);
    console.log('');
    log('Press Ctrl+C to stop all services', colors.yellow);
    log('========================================', colors.bright);
    console.log('');

    // Try to open browser
    const open = require('child_process').exec;
    const url = 'http://localhost:4200';

    switch (process.platform) {
      case 'darwin':
        open(`open ${url}`);
        break;
      case 'win32':
        open(`start ${url}`);
        break;
      default:
        open(`xdg-open ${url}`);
    }

    // Handle process termination
    process.on('SIGINT', () => {
      log('', colors.reset);
      log('🛑 Stopping SkoolCampus...', colors.yellow);
      backend.kill();
      frontend.kill();
      process.exit(0);
    });

    // Keep the process running
    backend.on('close', (code) => {
      log(`Backend exited with code ${code}`, colors.red);
      frontend.kill();
      process.exit(code);
    });

    frontend.on('close', (code) => {
      log(`Frontend exited with code ${code}`, colors.red);
      backend.kill();
      process.exit(code);
    });

  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

main();
