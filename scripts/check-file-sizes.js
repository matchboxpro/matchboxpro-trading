#!/usr/bin/env node

/**
 * File Size Governance Checker
 * Prevents monolithic files and enforces modular architecture
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  // File size limits (lines)
  MAX_LINES_REACT: 300,
  MAX_LINES_TS: 400,
  MAX_LINES_JS: 400,
  
  // Warning thresholds
  WARN_LINES_REACT: 200,
  WARN_LINES_TS: 250,
  WARN_LINES_JS: 250,
  
  // Directories to check
  DIRECTORIES: [
    'client/src',
    'server',
    'shared'
  ],
  
  // Files to ignore
  IGNORE_PATTERNS: [
    'node_modules',
    '.git',
    'dist',
    'build',
    '*.config.js',
    '*.config.ts',
    'vite.config.ts'
  ]
};

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').filter(line => line.trim() !== '').length;
  } catch (error) {
    return 0;
  }
}

function getFileType(filePath) {
  const ext = path.extname(filePath);
  if (ext === '.tsx' || ext === '.jsx') return 'REACT';
  if (ext === '.ts') return 'TS';
  if (ext === '.js') return 'JS';
  return null;
}

function shouldIgnoreFile(filePath) {
  return CONFIG.IGNORE_PATTERNS.some(pattern => 
    filePath.includes(pattern) || filePath.endsWith(pattern.replace('*', ''))
  );
}

function checkDirectory(dirPath, results = []) {
  if (!fs.existsSync(dirPath)) return results;
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    
    if (shouldIgnoreFile(fullPath)) continue;
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      checkDirectory(fullPath, results);
    } else if (stat.isFile()) {
      const fileType = getFileType(fullPath);
      if (!fileType) continue;
      
      const lineCount = countLines(fullPath);
      const relativePath = path.relative(process.cwd(), fullPath);
      
      let status = 'OK';
      let maxLines = CONFIG[`MAX_LINES_${fileType}`];
      let warnLines = CONFIG[`WARN_LINES_${fileType}`];
      
      if (lineCount > maxLines) {
        status = 'ERROR';
      } else if (lineCount > warnLines) {
        status = 'WARNING';
      }
      
      results.push({
        path: relativePath,
        type: fileType,
        lines: lineCount,
        maxLines,
        warnLines,
        status
      });
    }
  }
  
  return results;
}

function printResults(results) {
  console.log('\n🔍 MatchboxPro File Size Governance Report\n');
  
  const errors = results.filter(r => r.status === 'ERROR');
  const warnings = results.filter(r => r.status === 'WARNING');
  const ok = results.filter(r => r.status === 'OK');
  
  if (errors.length > 0) {
    console.log('❌ ERRORS (Files too large):');
    errors.forEach(file => {
      console.log(`   ${file.path}: ${file.lines} lines (max: ${file.maxLines})`);
      console.log(`      → Refactor into smaller components!`);
    });
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (Files getting large):');
    warnings.forEach(file => {
      console.log(`   ${file.path}: ${file.lines} lines (warn: ${file.warnLines})`);
      console.log(`      → Consider refactoring soon`);
    });
    console.log('');
  }
  
  console.log(`✅ Summary: ${ok.length} OK, ${warnings.length} warnings, ${errors.length} errors`);
  
  if (errors.length > 0) {
    console.log('\n🚨 GOVERNANCE VIOLATION: Files exceed maximum size limits!');
    console.log('   Please refactor large files into smaller components.');
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Some files are approaching size limits. Consider refactoring.');
  } else {
    console.log('\n🎉 All files comply with governance rules!');
  }
}

function main() {
  console.log('🔄 Checking file sizes for governance compliance...');
  
  let allResults = [];
  
  for (const dir of CONFIG.DIRECTORIES) {
    if (fs.existsSync(dir)) {
      const results = checkDirectory(dir);
      allResults = allResults.concat(results);
    }
  }
  
  if (allResults.length === 0) {
    console.log('No files found to check.');
    return;
  }
  
  printResults(allResults);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
