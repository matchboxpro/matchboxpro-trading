# MatchboxPro - Guida Setup Sviluppo

## 🚀 Setup Completo per Sviluppo e Deploy

Questa guida copre il setup locale per sviluppo e le istruzioni per il deployment su Render con PostgreSQL.

### 📋 Prerequisiti

**Per Sviluppo Locale:**
- **Node.js**: v18+ (consigliato v20.16.11)
- **npm**: v8+
- **Git**: Per il controllo versione
- **Windsurf**: IDE di sviluppo

**Per Deployment Render:**
- Account Render con Starter Plan ($7/mese)
- Database PostgreSQL su Render
- Repository GitHub collegato

### 🔧 Setup Automatico

Il modo più semplice per configurare il progetto:

```bash
# Esegui lo script di setup automatico
npm run setup
```

Questo script:
- ✅ Rileva automaticamente l'architettura (Intel/Apple Silicon)
- ✅ Pulisce le dipendenze esistenti
- ✅ Configura npm per l'architettura corretta
- ✅ Installa tutte le dipendenze
- ✅ Ricompila i moduli nativi per l'architettura corrente

### 🛠️ Setup Manuale

Se preferisci il controllo manuale:

```bash
# 1. Pulizia
npm run clean

# 2. Installazione dipendenze
npm install

# 3. Avvio sviluppo
npm run dev
```

### 🏗️ Architetture Supportate

| Architettura | Supporto | Note |
|--------------|----------|------|
| Apple Silicon (M1/M2/M3) | ✅ | Configurazione automatica |
| Intel Mac | ✅ | Configurazione automatica |
| Linux | ⚠️ | Supporto base |

### 🔍 Risoluzione Problemi

#### Problema: esbuild architecture mismatch
```bash
# Soluzione
npm run clean
npm install --force
```

#### Problema: Dipendenze native non funzionano
```bash
# Ricompila moduli nativi
npm rebuild
```

#### Problema: Porta 3001 occupata
```bash
# Il server usa la porta 3001 per evitare conflitti AirTunes
# Se necessario, modifica la porta in server/index.ts
```

### 📦 Dipendenze Critiche

- **esbuild**: Binari specifici per architettura
- **bcrypt**: Modulo nativo che richiede compilazione
- **pg**: Driver PostgreSQL nativo (usato da Drizzle ORM)
- **bufferutil**: Ottimizzazioni WebSocket native
- **drizzle-orm**: ORM per database PostgreSQL/Supabase
- **tsx**: TypeScript execution engine per sviluppo

### 🚀 Comandi Disponibili

```bash
npm run dev        # Avvia server sviluppo (porta 3001)
npm run build      # Build produzione
npm run start      # Avvia produzione
npm run setup      # Setup automatico cross-platform
npm run clean      # Pulizia dipendenze
npm run check      # Controllo TypeScript
npm run db:push    # Aggiorna schema database
./backup_manager.sh # Backup automatico progetto
```

### 🌐 Accesso Applicazione

Dopo l'avvio:
- **Frontend**: http://localhost:3001
- **API**: http://localhost:3001/api/*
- **Database**: Supabase (configurato in .env)

### 📝 Note per Windsurf

- Il progetto è ottimizzato per Windsurf IDE
- Configurazione TypeScript inclusa
- Hot reload automatico in sviluppo
- Debugging integrato supportato

### 🔐 Configurazione Ambiente

**Sviluppo Locale:**
```bash
cp .env.example .env
# Configura nel .env:
# SUPABASE_DATABASE_URL=postgresql://...
# JWT_SECRET=your-secret-key
# NODE_ENV=development
```

**Produzione Render:**
Configura le seguenti variabili ambiente su Render:
```bash
SUPABASE_DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
NODE_ENV=production
NPM_CONFIG_PRODUCTION=false
```

## 🚀 Deployment su Render

### 🔄 Workflow di Sviluppo

1. **Modifica codice** in locale
2. **Test** con `npm run dev`
3. **Aggiorna file informativi** se necessario
4. **Attendere richiesta esplicita** per commit
5. **Commit** solo su richiesta utente
6. **Push** su GitHub
7. **Deploy automatico** su Render

⚠️ **IMPORTANTE**: I commit su GitHub vengono eseguiti solo su esplicita richiesta dell'utente.

### Setup Iniziale
1. **Crea Web Service** su Render
2. **Collega Repository** GitHub
3. **Configura Build Settings:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Node Version: 18+

### Variabili Ambiente Render
```bash
SUPABASE_DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-production-jwt-secret-key
NODE_ENV=production
NPM_CONFIG_PRODUCTION=false
```

### Endpoint Diagnostici Live
- **Health Check**: https://matchboxpro.onrender.com/api/_health
- **App Live**: https://matchboxpro.onrender.com
- **Seed Test Users**: https://matchboxpro.onrender.com/api/_seed

### 🆘 Supporto

**Problemi Sviluppo:**
1. Esegui `npm run setup`
2. Verifica Node.js: `node --version`
3. Controlla log server per errori
4. Consulta `PROJECT_STRUCTURE.md`

**Problemi Deploy Render:**
1. Verifica Build Command: `npm install && npm run build`
2. Verifica Start Command: `npm start`
3. Controlla variabili ambiente
4. Monitora log deployment su Render dashboard
