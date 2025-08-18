# MatchboxPro - Guida Setup Sviluppo

## 🚀 Setup per Mac Intel e Apple Silicon

Questa guida ti aiuta a configurare MatchboxPro per lo sviluppo su Windsurf, compatibile con entrambe le architetture Mac.

### 📋 Prerequisiti

- **Node.js**: v18+ (consigliato v20.16.11)
- **npm**: v8+
- **Git**: Per il controllo versione
- **Windsurf**: IDE di sviluppo

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

Copia `.env.example` in `.env` e configura:
```bash
cp .env.example .env
# Modifica .env con le tue credenziali
```

### 🆘 Supporto

Se incontri problemi:
1. Esegui `npm run setup`
2. Verifica la versione Node.js con `node --version`
3. Controlla i log del server per errori specifici
4. Consulta `PROJECT_STRUCTURE.md` per dettagli architettura
