#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('========= BUILD VERIFICATION =========');
console.log('Current directory:', process.cwd());

// Check if .next exists
const nextDir = path.join(process.cwd(), '.next');
const nextExists = fs.existsSync(nextDir);
console.log('.next directory exists:', nextExists);

if (nextExists) {
  try {
    // List contents of .next
    const nextContents = fs.readdirSync(nextDir);
    console.log('.next directory contents:', nextContents);
    
    // Check for required files
    const buildIdPath = path.join(nextDir, 'BUILD_ID');
    const buildIdExists = fs.existsSync(buildIdPath);
    console.log('BUILD_ID file exists:', buildIdExists);
    
    if (buildIdExists) {
      const buildId = fs.readFileSync(buildIdPath, 'utf8');
      console.log('BUILD_ID:', buildId);
    }
  } catch (error) {
    console.error('Error reading .next directory:', error);
  }
} else {
  console.error('ERROR: .next directory does not exist. Build may have failed.');
  
  // List all directories and files in the current directory
  try {
    const rootContents = fs.readdirSync(process.cwd());
    console.log('Root directory contents:', rootContents);
  } catch (error) {
    console.error('Error reading root directory:', error);
  }
}

console.log('======================================'); 