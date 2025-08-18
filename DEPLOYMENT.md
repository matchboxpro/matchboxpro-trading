# MatchboxPro - Guida Deployment Render

## 🚀 Deployment Completo su Render

MatchboxPro è configurato per il deployment su **Render Starter Plan** ($7/mese) con PostgreSQL integrato.

### 📋 Prerequisiti

- Account Render con Starter Plan attivo
- Repository GitHub collegato
- Database PostgreSQL su Render configurato

## 🔧 Configurazione Render

### 1. Web Service Setup

**Build Settings:**
```bash
Build Command: npm install && npm run build
Start Command: npm start
Node Version: 18+
```

**Auto-Deploy:** Abilitato su push al branch `main`

### 2. Variabili Ambiente

Configura le seguenti variabili nel dashboard Render:

```bash
# Database Connection
SUPABASE_DATABASE_URL=postgresql://user:password@host:port/database

# JWT Authentication
JWT_SECRET=your-production-jwt-secret-key-here

# Environment
NODE_ENV=production
NPM_CONFIG_PRODUCTION=false
```

⚠️ **IMPORTANTE**: `NPM_CONFIG_PRODUCTION=false` è necessario per installare devDependencies durante il build.

### 3. Database PostgreSQL

Il database deve essere configurato con le tabelle definite in `/shared/schema.ts`:

- `users` - Utenti sistema
- `albums` - Album figurine  
- `stickers` - Figurine individuali
- `user_stickers` - Collezioni utente
- `matches` - Sistema matching
- `messages` - Chat persistente
- `reports` - Segnalazioni automatiche

## 🏗️ Processo di Build

### Build Unificato

Il progetto utilizza un build process unificato:

1. **Frontend Build**: Vite compila React → `client/dist/`
2. **Backend Build**: esbuild compila Express → `dist/index.js`
3. **Static Serving**: Express serve `client/dist/` in produzione

### Script npm

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && vite build",
    "build:server": "esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --external:pg-native",
    "start": "node dist/index.js"
  }
}
```

## 🩺 Endpoint Diagnostici

### Health Check
```
GET https://matchboxpro.onrender.com/api/_health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-08-18T20:37:37.000Z",
  "commit": "caf0631",
  "branch": "main",
  "DB_OK": true,
  "HAS_JWT_SECRET": true,
  "environment": "production"
}
```

### Seed Test Users
```
GET https://matchboxpro.onrender.com/api/_seed
```
Crea utenti di test per sviluppo (solo se database vuoto).

### Current User Info
```
GET https://matchboxpro.onrender.com/api/_whoami
```
Restituisce informazioni utente corrente dal JWT token.

## 🔐 Sicurezza Produzione

### JWT Authentication
- Token firmati con secret sicuro
- Cookie HttpOnly, Secure, SameSite=Lax
- Scadenza: 7 giorni
- Trust proxy abilitato per Render

### Password Security
- Hash bcrypt con salt rounds: 10
- Validazione lunghezza minima
- Protezione contro timing attacks

### Database Security
- Connection pool PostgreSQL
- Prepared statements (Drizzle ORM)
- Validazione input server-side

## 🚨 Troubleshooting

### Problemi Comuni

#### Build Failure: "vite: not found"
**Soluzione**: Verificare Build Command include `npm install`
```bash
Build Command: npm install && npm run build
```

#### Start Failure: "Cannot find module"
**Soluzione**: Verificare Start Command
```bash
Start Command: npm start
```

#### Database Connection Error
**Soluzione**: Verificare `SUPABASE_DATABASE_URL` nelle variabili ambiente

#### JWT Errors
**Soluzione**: Verificare `JWT_SECRET` configurato correttamente

### Log Monitoring

Monitorare i log Render per:
- Errori di build
- Errori runtime
- Connessioni database
- Richieste API

## 📊 Monitoraggio

### Endpoint di Monitoraggio

- **App Status**: https://matchboxpro.onrender.com
- **Health Check**: https://matchboxpro.onrender.com/api/_health
- **API Test**: https://matchboxpro.onrender.com/api/albums

### Metriche da Monitorare

- Response time endpoint
- Database connection status
- JWT token validation
- Error rate API calls

## 🔄 Deploy Process

### Automatic Deploy

1. Push al branch `main`
2. Render rileva cambiamenti
3. Esegue build automatico
4. Deploy se build successful
5. Health check automatico

### Manual Deploy

Dal dashboard Render:
1. Vai al Web Service
2. Click "Manual Deploy"
3. Seleziona branch
4. Conferma deploy

## 📝 Checklist Pre-Deploy

- [ ] Variabili ambiente configurate
- [ ] Database PostgreSQL attivo
- [ ] Build command corretto
- [ ] Start command corretto
- [ ] JWT_SECRET sicuro configurato
- [ ] Database schema aggiornato
- [ ] Test locali passati

## 🎯 URL Produzione

**App Live**: https://matchboxpro.onrender.com

**Endpoint Principali**:
- Login: `POST /api/auth/login`
- Albums: `GET /api/albums`
- Health: `GET /api/_health`
- Admin: `/admin` (solo utenti admin)

---

**Ultimo aggiornamento**: 2025-08-18 - Deploy completo con JWT e endpoint diagnostici
