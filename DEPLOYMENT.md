# MatchboxPro - Deployment Render

## 🚀 Deploy su Render

Configurato per **Render Starter Plan** ($7/mese) + PostgreSQL.

### 📋 Prerequisiti

Account Render Starter + GitHub repo + PostgreSQL DB

## 🔧 Configurazione

### Web Service

**Build**: `npm install && npm run build`  
**Start**: `npm start`  
**Node**: 18+  
**Auto-Deploy**: Push su `main`

### Environment Variables

`SUPABASE_DATABASE_URL` (PostgreSQL connection)  
`JWT_SECRET` (production key)  
`NODE_ENV=production`  
`NPM_CONFIG_PRODUCTION=false` (installa devDependencies)

### Database Schema

Tabelle: `users`, `albums`, `stickers`, `user_stickers`, `matches`, `messages`, `reports` (vedi `/shared/schema.ts`)

## 🏗️ Build Process

**Build Unificato**: Vite (React → `client/dist/`) + esbuild (Express → `dist/index.js`) + static serving

```json
{
  "build": "npm run build:client && npm run build:server",
  "start": "node dist/index.js"
}
```

## 🩺 Diagnostics

**Health Check**: `GET /api/_health` (status, DB_OK, JWT_SECRET, environment)  
**Seed Users**: `GET /api/_seed` (crea utenti test se DB vuoto)  
**User Info**: `GET /api/_whoami` (info da JWT token)

## 🔐 Security

**JWT**: Cookie HttpOnly/Secure/SameSite, 7 giorni, trust proxy  
**Password**: bcrypt salt 10, validazione lunghezza, timing attack protection  
**Database**: Connection pool, prepared statements, input validation

## 🚨 Troubleshooting

**Build Failure**: Verifica Build Command include `npm install`  
**Start Failure**: Verifica Start Command `npm start`  
**DB Connection**: Verifica `SUPABASE_DATABASE_URL`  
**JWT Errors**: Verifica `JWT_SECRET`

**Log Monitoring**: Build errors, runtime errors, DB connections, API requests

## 📊 Monitoring

**Endpoints**: https://matchboxpro.onrender.com (app), `/api/_health` (health), `/api/albums` (API test)  
**Metriche**: Response time, DB status, JWT validation, error rate

## 🔄 Deploy

**Auto**: Push `main` → build → deploy → health check  
**Manual**: Dashboard Render → Manual Deploy → select branch

## 📝 Pre-Deploy Checklist

☐ Env vars ☐ PostgreSQL ☐ Build/Start commands ☐ JWT_SECRET ☐ DB schema ☐ Local tests

## 🎯 Production

**Live**: https://matchboxpro.onrender.com  
**API**: `/api/auth/login`, `/api/albums`, `/api/_health`, `/admin`

---

**Ultimo aggiornamento**: 2025-08-22 - Refactoring + governance compliance + bulk management
