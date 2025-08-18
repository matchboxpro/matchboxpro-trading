#!/usr/bin/env node

/**
 * 🔍 MatchboxPro - Supabase Configuration Inspector
 * Utility per consultare rapidamente schema e configurazione database
 */

// Colori per output console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (color, text) => console.log(`${colors[color]}${text}${colors.reset}`);

// Schema database estratto da shared/schema.ts
const TABLES = {
  users: {
    description: "👥 Gestione Utenti",
    columns: {
      id: "UUID PK (auto-generated)",
      nickname: "VARCHAR(50) UNIQUE NOT NULL",
      password: "TEXT NOT NULL",
      cap: "VARCHAR(5) NOT NULL",
      raggio_km: "INTEGER DEFAULT 10",
      album_selezionato: "UUID FK → albums.id",
      start_trial: "TIMESTAMP DEFAULT NOW()",
      is_premium: "BOOLEAN DEFAULT false",
      role: "VARCHAR(10) DEFAULT 'user'",
      created_at: "TIMESTAMP DEFAULT NOW()"
    },
    validation: "nickname: 3-50 chars, cap: 5 digits, password: min 6 chars"
  },
  albums: {
    description: "📚 Album Figurine",
    columns: {
      id: "UUID PK (auto-generated)",
      name: "TEXT NOT NULL",
      year: "INTEGER NOT NULL",
      is_active: "BOOLEAN DEFAULT true",
      created_at: "TIMESTAMP DEFAULT NOW()"
    }
  },
  stickers: {
    description: "🎴 Figurine",
    columns: {
      id: "UUID PK (auto-generated)",
      album_id: "UUID NOT NULL FK → albums.id CASCADE",
      number: "VARCHAR(10) NOT NULL",
      name: "TEXT NOT NULL",
      team: "TEXT (nullable)",
      created_at: "TIMESTAMP DEFAULT NOW()"
    },
    example: "number: 'UPD07', name: 'Inter-Milan 2-3 - supercoppa'"
  },
  user_stickers: {
    description: "👤 Collezione Utente",
    columns: {
      id: "UUID PK (auto-generated)",
      user_id: "UUID NOT NULL FK → users.id CASCADE",
      sticker_id: "UUID NOT NULL FK → stickers.id CASCADE",
      status: "VARCHAR(10) NOT NULL ('yes'|'no'|'double')",
      updated_at: "TIMESTAMP DEFAULT NOW()"
    }
  },
  matches: {
    description: "🤝 Sistema Scambi",
    columns: {
      id: "UUID PK (auto-generated)",
      user1_id: "UUID NOT NULL FK → users.id CASCADE",
      user2_id: "UUID NOT NULL FK → users.id CASCADE",
      album_id: "UUID NOT NULL FK → albums.id CASCADE",
      status: "VARCHAR(20) DEFAULT 'active'",
      created_at: "TIMESTAMP DEFAULT NOW()"
    }
  },
  messages: {
    description: "💬 Chat Scambi",
    columns: {
      id: "UUID PK (auto-generated)",
      match_id: "UUID NOT NULL FK → matches.id CASCADE",
      sender_id: "UUID NOT NULL FK → users.id CASCADE",
      content: "TEXT NOT NULL",
      created_at: "TIMESTAMP DEFAULT NOW()"
    }
  },
  reports: {
    description: "🚨 Sistema Segnalazioni",
    columns: {
      id: "UUID PK (auto-generated)",
      reporter_id: "UUID NOT NULL FK → users.id CASCADE",
      reported_user_id: "UUID FK → users.id CASCADE (nullable)",
      type: "VARCHAR(20) NOT NULL",
      description: "TEXT NOT NULL",
      status: "VARCHAR(20) DEFAULT 'nuovo'",
      priority: "VARCHAR(10) DEFAULT 'media'",
      page: "VARCHAR(100) (nullable)",
      error_details: "TEXT (nullable)",
      user_agent: "TEXT (nullable)",
      url: "TEXT (nullable)",
      created_at: "TIMESTAMP DEFAULT NOW()"
    }
  }
};

const API_ENDPOINTS = {
  albums: [
    "GET /api/albums - Lista album",
    "POST /api/albums - Crea album (admin)",
    "PUT /api/albums/:id - Modifica album (admin)",
    "DELETE /api/albums/:id - Elimina album (admin)"
  ],
  stickers: [
    "GET /api/albums/:albumId/stickers - Lista figurine album",
    "POST /api/albums/:albumId/stickers/bulk - Import bulk (admin)",
    "DELETE /api/albums/:albumId/stickers - Elimina tutte (admin)"
  ],
  user_stickers: [
    "GET /api/user-stickers/:albumId - Collezione utente",
    "POST /api/user-stickers - Aggiorna status figurina",
    "PUT /api/user-stickers/:stickerId - Modifica status"
  ],
  auth: [
    "POST /api/auth/register - Registrazione",
    "POST /api/auth/login - Login",
    "POST /api/auth/logout - Logout",
    "GET /api/auth/me - Profilo utente"
  ]
};

function showHelp() {
  log('cyan', '\n🔍 MatchboxPro Supabase Inspector\n');
  log('yellow', 'Comandi disponibili:');
  console.log('  tables              - Mostra tutte le tabelle');
  console.log('  table <nome>        - Dettagli tabella specifica');
  console.log('  api                 - Mostra tutti gli endpoint API');
  console.log('  api <categoria>     - Endpoint API per categoria');
  console.log('  connection          - Info connessione database');
  console.log('  schema              - Schema completo database');
  console.log('  help                - Mostra questo help');
  console.log('\nEsempi:');
  console.log('  node scripts/supabase-info.js tables');
  console.log('  node scripts/supabase-info.js table stickers');
  console.log('  node scripts/supabase-info.js api albums');
}

function showTables() {
  log('cyan', '\n📊 Tabelle Database MatchboxPro\n');
  Object.entries(TABLES).forEach(([name, info]) => {
    log('green', `${info.description} - ${name}`);
    console.log(`  Colonne: ${Object.keys(info.columns).length}`);
    if (info.validation) console.log(`  Validazione: ${info.validation}`);
    if (info.example) console.log(`  Esempio: ${info.example}`);
    console.log('');
  });
}

function showTable(tableName) {
  if (!TABLES[tableName]) {
    log('red', `❌ Tabella '${tableName}' non trovata`);
    log('yellow', `Tabelle disponibili: ${Object.keys(TABLES).join(', ')}`);
    return;
  }

  const table = TABLES[tableName];
  log('cyan', `\n${table.description} - ${tableName}\n`);
  
  Object.entries(table.columns).forEach(([col, type]) => {
    console.log(`  ${col.padEnd(20)} ${type}`);
  });
  
  if (table.validation) {
    log('yellow', `\n📋 Validazione: ${table.validation}`);
  }
  
  if (table.example) {
    log('blue', `\n💡 Esempio: ${table.example}`);
  }
}

function showAPI(category = null) {
  if (category && !API_ENDPOINTS[category]) {
    log('red', `❌ Categoria API '${category}' non trovata`);
    log('yellow', `Categorie disponibili: ${Object.keys(API_ENDPOINTS).join(', ')}`);
    return;
  }

  log('cyan', '\n🚀 API Endpoints MatchboxPro\n');
  
  const categories = category ? [category] : Object.keys(API_ENDPOINTS);
  
  categories.forEach(cat => {
    log('green', `📂 ${cat.toUpperCase()}`);
    API_ENDPOINTS[cat].forEach(endpoint => {
      console.log(`  ${endpoint}`);
    });
    console.log('');
  });
}

function showConnection() {
  log('cyan', '\n🔗 Connessione Database\n');
  console.log('  Host: aws-0-eu-central-1.pooler.supabase.com');
  console.log('  Porta: 6543 (Connection Pooler)');
  console.log('  Database: postgres');
  console.log('  Regione: EU Central (Frankfurt)');
  console.log('  SSL: Richiesto');
  console.log('');
  log('yellow', '🔧 Test Connessione:');
  console.log('  npm run dev  # Verifica log "✅ CONNECTING TO SUPABASE"');
}

function showSchema() {
  log('cyan', '\n📋 Schema Completo Database\n');
  
  // Mostra relazioni
  log('yellow', '🔗 Relazioni Principali:');
  console.log('  users.album_selezionato → albums.id');
  console.log('  stickers.album_id → albums.id (CASCADE)');
  console.log('  user_stickers.user_id → users.id (CASCADE)');
  console.log('  user_stickers.sticker_id → stickers.id (CASCADE)');
  console.log('  matches.user1_id, user2_id → users.id (CASCADE)');
  console.log('  matches.album_id → albums.id (CASCADE)');
  console.log('  messages.match_id → matches.id (CASCADE)');
  console.log('  reports.reporter_id → users.id (CASCADE)');
  console.log('');
  
  // Mostra constraint
  log('yellow', '🔒 Constraint Principali:');
  console.log('  users.nickname UNIQUE');
  console.log('  Tutti gli ID sono UUID auto-generati');
  console.log('  Timestamp automatici per audit trail');
  console.log('  CASCADE DELETE per integrità referenziale');
}

// Main execution
const command = process.argv[2];
const param = process.argv[3];

switch (command) {
  case 'tables':
    showTables();
    break;
  case 'table':
    if (!param) {
      log('red', '❌ Specifica nome tabella: node scripts/supabase-info.js table <nome>');
      break;
    }
    showTable(param);
    break;
  case 'api':
    showAPI(param);
    break;
  case 'connection':
    showConnection();
    break;
  case 'schema':
    showSchema();
    break;
  case 'help':
  default:
    showHelp();
    break;
}
