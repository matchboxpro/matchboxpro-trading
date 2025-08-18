#!/usr/bin/env node

/**
 * MatchboxPro Documentation Auto-Updater
 * Automatically updates PROJECT_STRUCTURE.md and other documentation files
 * when significant changes are detected in the codebase
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  // Files to monitor for changes
  WATCH_PATTERNS: [
    'client/src/components/**/*.tsx',
    'client/src/pages/**/*.tsx', 
    'server/**/*.ts',
    'shared/**/*.ts'
  ],
  
  // Documentation files to update
  DOCS_FILES: {
    PROJECT_STRUCTURE: 'PROJECT_STRUCTURE.md',
    DEVELOPMENT_SETUP: 'DEVELOPMENT_SETUP.md'
  },
  
  // Significant change thresholds
  THRESHOLDS: {
    NEW_COMPONENT: true,
    DELETED_COMPONENT: true,
    MAJOR_REFACTOR: 50, // lines changed
    NEW_API_ENDPOINT: true,
    LAYOUT_CHANGES: true
  }
};

class DocumentationUpdater {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.changes = [];
    this.timestamp = new Date().toISOString().split('T')[0];
  }

  // Detect significant changes in the codebase
  detectChanges() {
    console.log('🔍 Rilevamento modifiche significative...');
    
    try {
      // Get git status to see what changed
      const gitStatus = execSync('git status --porcelain', { 
        cwd: this.projectRoot,
        encoding: 'utf8' 
      }).trim();
      
      if (!gitStatus) {
        console.log('ℹ️  Nessuna modifica rilevata');
        return false;
      }

      const lines = gitStatus.split('\n');
      let hasSignificantChanges = false;

      for (const line of lines) {
        const status = line.substring(0, 2);
        const filePath = line.substring(3);
        
        // Check for significant changes
        if (this.isSignificantChange(status, filePath)) {
          this.changes.push({ status, filePath, type: this.getChangeType(filePath) });
          hasSignificantChanges = true;
        }
      }

      return hasSignificantChanges;
    } catch (error) {
      console.log('⚠️  Git non disponibile, controllo modifiche manuali...');
      return this.detectManualChanges();
    }
  }

  // Check if a change is significant enough to update docs
  isSignificantChange(status, filePath) {
    // New or deleted files
    if (status.includes('A') || status.includes('D')) return true;
    
    // Modified React/TS files in key directories
    if (status.includes('M')) {
      return filePath.includes('client/src/components/') ||
             filePath.includes('client/src/pages/') ||
             filePath.includes('server/') ||
             filePath.includes('shared/');
    }
    
    return false;
  }

  // Determine the type of change
  getChangeType(filePath) {
    if (filePath.includes('components/admin/')) return 'ADMIN_COMPONENT';
    if (filePath.includes('components/')) return 'COMPONENT';
    if (filePath.includes('pages/')) return 'PAGE';
    if (filePath.includes('server/routes')) return 'API_ENDPOINT';
    if (filePath.includes('server/')) return 'SERVER';
    if (filePath.includes('shared/')) return 'SCHEMA';
    return 'OTHER';
  }

  // Fallback: detect changes manually by checking file timestamps
  detectManualChanges() {
    // This is a simplified version - in a real implementation,
    // you might want to store file hashes or timestamps
    return true; // For now, assume there are always changes to document
  }

  // Update PROJECT_STRUCTURE.md with detected changes
  updateProjectStructure() {
    console.log('📝 Aggiornamento PROJECT_STRUCTURE.md...');
    
    const filePath = path.join(this.projectRoot, CONFIG.DOCS_FILES.PROJECT_STRUCTURE);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update timestamp
    content = content.replace(
      /\*\*Ultimo aggiornamento\*\*: \d{4}-\d{2}-\d{2}[^\\n]*/,
      `**Ultimo aggiornamento**: ${this.timestamp} - Aggiornamento automatico documentazione`
    );
    
    // Update backup timestamp
    content = content.replace(
      /- \*\*Ultimo Backup\*\*: \d{4}-\d{2}-\d{2} \d{2}:\d{2}[^\\n]*/,
      `- **Ultimo Backup**: ${this.timestamp} ${new Date().toTimeString().substring(0,5)} - Sistema backup automatico a 2 rotazioni`
    );
    
    // Add change summary if significant changes detected
    if (this.changes.length > 0) {
      const changesSummary = this.generateChangesSummary();
      
      // Find the last section and add new changes
      const lastSectionRegex = /(### 🔧 Componenti Modulari Creati[\s\S]*?)(\n\n|$)/;
      content = content.replace(lastSectionRegex, `$1

### 📋 Ultime Modifiche (${this.timestamp})
${changesSummary}
$2`);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ PROJECT_STRUCTURE.md aggiornato');
  }

  // Generate a summary of detected changes
  generateChangesSummary() {
    const changesByType = {};
    
    for (const change of this.changes) {
      if (!changesByType[change.type]) {
        changesByType[change.type] = [];
      }
      changesByType[change.type].push(change);
    }
    
    let summary = '';
    
    for (const [type, changes] of Object.entries(changesByType)) {
      const typeLabel = this.getTypeLabel(type);
      summary += `- **${typeLabel}**: ${changes.length} file${changes.length > 1 ? 's' : ''} modificat${changes.length > 1 ? 'i' : 'o'}\n`;
      
      for (const change of changes.slice(0, 3)) { // Show max 3 files per type
        const statusLabel = this.getStatusLabel(change.status);
        summary += `  - ${statusLabel} \`${change.filePath}\`\n`;
      }
      
      if (changes.length > 3) {
        summary += `  - ... e altri ${changes.length - 3} file\n`;
      }
    }
    
    return summary;
  }

  // Get human-readable type labels
  getTypeLabel(type) {
    const labels = {
      'ADMIN_COMPONENT': 'Componenti Admin',
      'COMPONENT': 'Componenti UI',
      'PAGE': 'Pagine',
      'API_ENDPOINT': 'Endpoint API',
      'SERVER': 'Server',
      'SCHEMA': 'Schema Database',
      'OTHER': 'Altri file'
    };
    return labels[type] || type;
  }

  // Get human-readable status labels
  getStatusLabel(status) {
    if (status.includes('A')) return '➕ Aggiunto';
    if (status.includes('D')) return '🗑️ Eliminato';
    if (status.includes('M')) return '✏️ Modificato';
    return '🔄 Cambiato';
  }

  // Update component count and file sizes
  updateComponentStats() {
    console.log('📊 Aggiornamento statistiche componenti...');
    
    const adminComponents = this.getDirectoryStats('client/src/components/admin');
    const totalComponents = this.getDirectoryStats('client/src/components');
    
    // This could be expanded to update specific stats in the documentation
    console.log(`📈 Componenti admin: ${adminComponents.count}, Totale: ${totalComponents.count}`);
  }

  // Get statistics about a directory
  getDirectoryStats(dirPath) {
    const fullPath = path.join(this.projectRoot, dirPath);
    if (!fs.existsSync(fullPath)) return { count: 0, totalLines: 0 };
    
    let count = 0;
    let totalLines = 0;
    
    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanDirectory(itemPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          count++;
          const content = fs.readFileSync(itemPath, 'utf8');
          totalLines += content.split('\n').length;
        }
      }
    };
    
    scanDirectory(fullPath);
    return { count, totalLines };
  }

  // Main execution method
  async run() {
    console.log('🚀 MatchboxPro Documentation Auto-Updater');
    console.log('==========================================');
    
    const hasChanges = this.detectChanges();
    
    if (hasChanges) {
      console.log(`📋 Rilevate ${this.changes.length} modifiche significative`);
      
      this.updateProjectStructure();
      this.updateComponentStats();
      
      console.log('✅ Documentazione aggiornata automaticamente!');
      
      // Optional: create a backup after significant changes
      if (this.changes.length >= 3) {
        console.log('💾 Creazione backup per modifiche significative...');
        try {
          execSync('./backup_manager.sh', { cwd: this.projectRoot });
          console.log('✅ Backup creato automaticamente');
        } catch (error) {
          console.log('⚠️  Errore nella creazione backup automatico');
        }
      }
    } else {
      console.log('ℹ️  Nessuna modifica significativa rilevata');
    }
    
    console.log('🎉 Processo completato!');
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const updater = new DocumentationUpdater();
  updater.run().catch(console.error);
}

export default DocumentationUpdater;
