#!/usr/bin/env node

const { create } = require('ipfs-http-client');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create console interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default gateway
const DEFAULT_GATEWAY = 'https://ipfs.io';

// IPFS client
let ipfs;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Clear screen
console.clear();

// Display banner
console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════╗
║                                                    ║
║     IPFS File Sharing - Command Line Interface     ║
║                                                    ║
╚════════════════════════════════════════════════════╝
${colors.reset}`);

// Help command
function showHelp() {
  console.log(`
${colors.bright}Available Commands:${colors.reset}

  ${colors.cyan}connect [gateway]${colors.reset} - Connect to IPFS (default: ${DEFAULT_GATEWAY})
  ${colors.cyan}upload <file_path>${colors.reset} - Upload a file to IPFS
  ${colors.cyan}download <cid> <output_path>${colors.reset} - Download a file from IPFS
  ${colors.cyan}pin <cid>${colors.reset} - Pin a file on IPFS
  ${colors.cyan}unpin <cid>${colors.reset} - Unpin a file on IPFS
  ${colors.cyan}ls [directory]${colors.reset} - List files in current or specified directory
  ${colors.cyan}cat <cid>${colors.reset} - Display the contents of a file (text files only)
  ${colors.cyan}help${colors.reset} - Show this help message
  ${colors.cyan}exit${colors.reset} - Exit the CLI
  `);
}

// Connect to IPFS
async function connectToIPFS(gateway = DEFAULT_GATEWAY) {
  try {
    console.log(`${colors.yellow}Connecting to IPFS via ${gateway}...${colors.reset}`);
    
    ipfs = create({
      host: gateway.replace(/^https?:\/\//, ''),
      port: 443,
      protocol: 'https'
    });
    
    // Simple test to check connection
    const nodeId = await ipfs.id();
    console.log(`${colors.green}Connected to IPFS!${colors.reset}`);
    console.log(`${colors.dim}Node ID: ${nodeId.id}${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Failed to connect to IPFS: ${error.message}${colors.reset}`);
    return false;
  }
}

// Upload a file
async function uploadFile(filePath) {
  if (!ipfs) {
    console.log(`${colors.red}Not connected to IPFS. Use 'connect' first.${colors.reset}`);
    return;
  }
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`${colors.red}File not found: ${filePath}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.yellow}Uploading ${filePath} to IPFS...${colors.reset}`);
    
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    const result = await ipfs.add({
      path: fileName,
      content: fileContent
    });
    
    console.log(`${colors.green}File uploaded successfully!${colors.reset}`);
    console.log(`${colors.bright}CID: ${result.cid.toString()}${colors.reset}`);
    console.log(`${colors.dim}Gateway URL: ${DEFAULT_GATEWAY}/ipfs/${result.cid.toString()}${colors.reset}`);
    
    // Save file reference to local cache
    saveFileReference(result.cid.toString(), fileName, fileContent.length);
    
    return result.cid.toString();
  } catch (error) {
    console.error(`${colors.red}Error uploading file: ${error.message}${colors.reset}`);
  }
}

// Download a file
async function downloadFile(cid, outputPath) {
  if (!ipfs) {
    console.log(`${colors.red}Not connected to IPFS. Use 'connect' first.${colors.reset}`);
    return;
  }
  
  try {
    console.log(`${colors.yellow}Downloading file with CID ${cid}...${colors.reset}`);
    
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    
    const content = Buffer.concat(chunks);
    fs.writeFileSync(outputPath, content);
    
    console.log(`${colors.green}File downloaded successfully to ${outputPath}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error downloading file: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}Trying to download from gateway...${colors.reset}`);
    
    try {
      const fetch = require('node-fetch');
      const response = await fetch(`${DEFAULT_GATEWAY}/ipfs/${cid}`);
      
      if (!response.ok) {
        throw new Error(`Gateway returned ${response.status}: ${response.statusText}`);
      }
      
      const content = await response.buffer();
      fs.writeFileSync(outputPath, content);
      
      console.log(`${colors.green}File downloaded successfully from gateway to ${outputPath}${colors.reset}`);
    } catch (fallbackError) {
      console.error(`${colors.red}Error downloading from gateway: ${fallbackError.message}${colors.reset}`);
    }
  }
}

// Pin a file
async function pinFile(cid) {
  if (!ipfs) {
    console.log(`${colors.red}Not connected to IPFS. Use 'connect' first.${colors.reset}`);
    return;
  }
  
  try {
    console.log(`${colors.yellow}Pinning file with CID ${cid}...${colors.reset}`);
    
    await ipfs.pin.add(cid);
    
    console.log(`${colors.green}File pinned successfully!${colors.reset}`);
    
    // Update file reference in local cache
    updateFilePinStatus(cid, true);
  } catch (error) {
    console.error(`${colors.red}Error pinning file: ${error.message}${colors.reset}`);
  }
}

// Unpin a file
async function unpinFile(cid) {
  if (!ipfs) {
    console.log(`${colors.red}Not connected to IPFS. Use 'connect' first.${colors.reset}`);
    return;
  }
  
  try {
    console.log(`${colors.yellow}Unpinning file with CID ${cid}...${colors.reset}`);
    
    await ipfs.pin.rm(cid);
    
    console.log(`${colors.green}File unpinned successfully!${colors.reset}`);
    
    // Update file reference in local cache
    updateFilePinStatus(cid, false);
  } catch (error) {
    console.error(`${colors.red}Error unpinning file: ${error.message}${colors.reset}`);
  }
}

// List files in directory
function listFiles(directory = '.') {
  try {
    const files = fs.readdirSync(directory);
    
    console.log(`${colors.bright}\nFiles in ${directory}:${colors.reset}`);
    console.log('─'.repeat(50));
    
    files.forEach(file => {
      const fullPath = path.join(directory, file);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        console.log(`${colors.blue}📁 ${file}/${colors.reset}`);
      } else {
        const sizeStr = formatFileSize(stats.size);
        console.log(`📄 ${file} ${colors.dim}(${sizeStr})${colors.reset}`);
      }
    });
    
    console.log('─'.repeat(50));
  } catch (error) {
    console.error(`${colors.red}Error listing files: ${error.message}${colors.reset}`);
  }
}

// Cat a file (display contents)
async function catFile(cid) {
  if (!ipfs) {
    console.log(`${colors.red}Not connected to IPFS. Use 'connect' first.${colors.reset}`);
    return;
  }
  
  try {
    console.log(`${colors.yellow}Fetching content for CID ${cid}...${colors.reset}`);
    
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    
    const content = Buffer.concat(chunks).toString();
    
    console.log(`${colors.bright}\nFile Content:${colors.reset}`);
    console.log('─'.repeat(50));
    console.log(content);
    console.log('─'.repeat(50));
  } catch (error) {
    console.error(`${colors.red}Error fetching file content: ${error.message}${colors.reset}`);
  }
}

// Save file reference to local cache
function saveFileReference(cid, name, size) {
  try {
    const cacheDir = path.join(__dirname, '.cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    const cacheFile = path.join(cacheDir, 'files.json');
    
    let files = [];
    if (fs.existsSync(cacheFile)) {
      const data = fs.readFileSync(cacheFile, 'utf8');
      files = JSON.parse(data);
    }
    
    files.push({
      cid,
      name,
      size,
      dateAdded: new Date().toISOString(),
      isPinned: false,
      lastAccessed: new Date().toISOString(),
    });
    
    fs.writeFileSync(cacheFile, JSON.stringify(files, null, 2));
  } catch (error) {
    console.error(`${colors.red}Error saving file reference: ${error.message}${colors.reset}`);
  }
}

// Update file pin status in local cache
function updateFilePinStatus(cid, isPinned) {
  try {
    const cacheDir = path.join(__dirname, '.cache');
    const cacheFile = path.join(cacheDir, 'files.json');
    
    if (!fs.existsSync(cacheFile)) {
      return;
    }
    
    const data = fs.readFileSync(cacheFile, 'utf8');
    const files = JSON.parse(data);
    
    const updatedFiles = files.map(file => 
      file.cid === cid ? { ...file, isPinned } : file
    );
    
    fs.writeFileSync(cacheFile, JSON.stringify(updatedFiles, null, 2));
  } catch (error) {
    console.error(`${colors.red}Error updating file reference: ${error.message}${colors.reset}`);
  }
}

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// Main CLI loop
function startCLI() {
  showHelp();
  
  rl.setPrompt(`${colors.bright}${colors.cyan}ipfs-cli>${colors.reset} `);
  rl.prompt();
  
  rl.on('line', async (line) => {
    const args = line.trim().split(' ');
    const command = args[0].toLowerCase();
    
    try {
      switch (command) {
        case 'connect':
          await connectToIPFS(args[1] || DEFAULT_GATEWAY);
          break;
          
        case 'upload':
          if (args.length < 2) {
            console.log(`${colors.red}Usage: upload <file_path>${colors.reset}`);
          } else {
            await uploadFile(args[1]);
          }
          break;
          
        case 'download':
          if (args.length < 3) {
            console.log(`${colors.red}Usage: download <cid> <output_path>${colors.reset}`);
          } else {
            await downloadFile(args[1], args[2]);
          }
          break;
          
        case 'pin':
          if (args.length < 2) {
            console.log(`${colors.red}Usage: pin <cid>${colors.reset}`);
          } else {
            await pinFile(args[1]);
          }
          break;
          
        case 'unpin':
          if (args.length < 2) {
            console.log(`${colors.red}Usage: unpin <cid>${colors.reset}`);
          } else {
            await unpinFile(args[1]);
          }
          break;
          
        case 'ls':
          listFiles(args[1] || '.');
          break;
          
        case 'cat':
          if (args.length < 2) {
            console.log(`${colors.red}Usage: cat <cid>${colors.reset}`);
          } else {
            await catFile(args[1]);
          }
          break;
          
        case 'help':
          showHelp();
          break;
          
        case 'exit':
        case 'quit':
          console.log(`${colors.green}Goodbye!${colors.reset}`);
          rl.close();
          return;
          
        case '':
          // Empty line, do nothing
          break;
          
        default:
          console.log(`${colors.red}Unknown command: ${command}${colors.reset}`);
          console.log(`Type ${colors.cyan}help${colors.reset} to see available commands.`);
      }
    } catch (error) {
      console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    }
    
    rl.prompt();
  }).on('close', () => {
    console.log(`${colors.green}Exiting IPFS CLI. Goodbye!${colors.reset}`);
    process.exit(0);
  });
}

// Start the CLI
startCLI();