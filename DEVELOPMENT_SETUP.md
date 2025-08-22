# MatchboxPro - Development Setup

## 🚀 Setup Sviluppo & Deploy

Guida setup locale + deployment Render con PostgreSQL.

### 📋 Prerequisiti

**Locale**: Node.js 18+, npm 8+, Git, Windsurf IDE  
**Render**: Account Starter ($7/mese), PostgreSQL DB, GitHub repo

### 🔧 Setup Automatico

```bash
npm run setup  # Rileva architettura + installa dipendenze + ricompila moduli nativi
```

### 🛠️ Setup Manuale

```bash
npm run clean && npm install && npm run dev
```

### 🏗️ Architetture

**Apple Silicon (M1/M2/M3)**: ✅ Auto-config  
**Intel Mac**: ✅ Auto-config  
**Linux**: ⚠️ Supporto base

### 🔍 Troubleshooting

**esbuild mismatch**: `npm run clean && npm install --force`  
**Dipendenze native**: `npm rebuild`  
**Porta 3001 occupata**: Server usa 3001 (evita conflitto AirTunes)

### 📦 Dipendenze Critiche

**esbuild** (binari architettura), **bcrypt** (nativo), **pg** (PostgreSQL), **drizzle-orm** (ORM), **tsx** (TypeScript engine)

### 🚀 Comandi

```bash
npm run dev         # Server sviluppo (3001)
npm run build       # Build produzione
npm run start       # Avvia produzione
npm run setup       # Setup automatico
npm run db:push     # Schema database
./backup_manager.sh # Backup progetto
```

### 🌐 Accesso

**Frontend**: http://localhost:3001  
**API**: http://localhost:3001/api/*  
**DB**: Supabase (configurato .env)

### 📝 Windsurf IDE

Ottimizzato per Windsurf: TypeScript config, hot reload, debugging integrato

### 🔐 Environment

**Locale**: `cp .env.example .env` + configura SUPABASE_DATABASE_URL, JWT_SECRET, NODE_ENV=development

**Render**: SUPABASE_DATABASE_URL, JWT_SECRET, NODE_ENV=production, NPM_CONFIG_PRODUCTION=false

## 🚀 Deployment su Render

### 🔄 Workflow

1. Modifica locale → 2. Test `npm run dev` → 3. Aggiorna docs → 4. **Attendere OK utente** → 5. Commit → 6. Push → 7. Deploy auto

⚠️ **IMPORTANTE**: Commit solo su esplicita richiesta utente

### 🛠️ Setup Render

**Web Service**: Collega GitHub repo  
**Build**: `npm install && npm run build`  
**Start**: `npm start`  
**Node**: 18+

**Environment Variables**:  
`SUPABASE_DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `NPM_CONFIG_PRODUCTION=false`

### 🩺 Live Endpoints

**Health**: https://matchboxpro.onrender.com/api/_health  
**App**: https://matchboxpro.onrender.com  
**Seed**: https://matchboxpro.onrender.com/api/_seed

### 🆘 Support

**Dev Issues**: `npm run setup` → verifica Node.js → check logs → consulta PROJECT_STRUCTURE.md

**Deploy Issues**: Verifica Build/Start commands → check env vars → monitor Render logs
