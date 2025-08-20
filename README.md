 # MatchboxPro 🃏

**Web Application per lo scambio di figurine Panini tra utenti**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen)](https://matchboxpro.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)

## 🎯 Panoramica

MatchboxPro è una piattaforma moderna per collezionisti di figurine Panini che permette di:

- 📱 **Gestire la propria collezione** con stati SI/NO/DOPPIA
- 🤝 **Trovare match automatici** per scambi 1:1 basati su geolocalizzazione
- 💬 **Chattare con altri collezionisti** per organizzare scambi
- 🏛️ **Amministrare album e figurine** (solo admin)
- 📊 **Monitorare statistiche** e segnalazioni

## 🚀 Demo Live

**🌐 App Live**: https://matchboxpro.onrender.com

**🩺 Health Check**: https://matchboxpro.onrender.com/api/_health

**👤 Test Users**: https://matchboxpro.onrender.com/api/_seed

## 🏗️ Stack Tecnologico

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Radix UI**
- **React Query** per state management
- **Lucide React** per icone

### Backend
- **Express.js** + **TypeScript** + **esbuild**
- **JWT Authentication** con cookie sicuri
- **bcrypt** per password hashing
- **Drizzle ORM** per database

### Database
- **PostgreSQL** su Render
- **Migrazioni** gestite con Drizzle Kit
- **Schema** con timestamptz per timezone awareness

### Deployment
- **Render Starter** ($7/mese)
- **Build unificato** frontend + backend
- **Auto-deploy** da GitHub

## 🔐 Sicurezza

- **JWT tokens** con cookie HttpOnly, Secure, SameSite=Lax
- **Password hashing** con bcrypt (10 salt rounds)
- **Trust proxy** per deployment sicuro
- **Prepared statements** per prevenire SQL injection
- **Input validation** server-side
- **Rate limiting** (30 req/10s su endpoint critici)
- **Request deduplication** (3s TTL anti-spam)
- **Production logging** (solo errori ≥400)

## 📋 Funzionalità

### 👥 Per Utenti
- **Registrazione/Login** con nickname e password
- **Gestione profilo** (CAP, album attivo) con sezione Account espandibile
- **Validazione nickname** (maiuscolo, max 8 caratteri, solo lettere/numeri)
- **Sistema attivazione album** con pulsanti ON/OFF persistenti
- **Collezione figurine** con 3 stati (SI/NO/DOPPIA)
- **UI mobile ottimizzata** con layout fisso e scroll verticale
- **Header uniformi** su tutte le pagine con logo MatchBox
- **Modale info figurine** in sola lettura
- **Menu statistiche** con conteggio figurine possedute/mancanti/doppie
- **PWA fullscreen** con status bar personalizzata
- **Testi compatti** per migliore leggibilità mobile
- **Pagina intro animata** con logo e transizioni fluide (3 secondi)
- **ESLint integrato** per code quality e best practices
- **Algoritmo matching** 1:1 per scambi ottimali
- **Chat persistente** con altri collezionisti
- **Dashboard** con statistiche personali

### 🏛️ Per Admin
- **Gestione album** (creazione, modifica, eliminazione)
- **Import figurine** bulk o singole
- **Gestione utenti** (attivazione/disattivazione)
- **Monitoraggio segnalazioni** automatiche
- **Statistiche sistema** in tempo reale
- **Export dati** CSV/JSON

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+
- npm 8+
- Database PostgreSQL

### Installazione

```bash
# Clone repository
git clone https://github.com/matchboxpro/matchboxpro-trading.git
cd matchboxpro-trading

# Setup automatico (consigliato)
npm run setup

# Oppure manuale
npm install
```

### Configurazione

```bash
# Copia file ambiente
cp .env.example .env

# Configura variabili
SUPABASE_DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Avvio

```bash
# Sviluppo (porta 3001)
npm run dev

# Produzione
npm run build
npm start
```

## 📁 Struttura Progetto

```
matchboxpro_current/
├── client/              # Frontend React + Vite
│   ├── src/
│   │   ├── components/  # Componenti UI
│   │   ├── pages/       # Pagine applicazione
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
├── server/              # Backend Express
│   ├── routes/          # API endpoints
│   ├── storage/         # Database layer
│   └── index.ts         # Server entry point
├── api/                 # Endpoint diagnostici
├── shared/              # Tipi condivisi
├── migrations/          # Database migrations
└── scripts/             # Utility scripts
```

## 🛠️ Comandi Disponibili

```bash
npm run dev          # Sviluppo con hot reload
npm run build        # Build produzione
npm run start        # Avvia produzione
npm run setup        # Setup automatico cross-platform
npm run clean        # Pulizia dipendenze
npm run check        # Controllo TypeScript
npm run db:push      # Aggiorna schema database
```

## 🔌 API Endpoints

### Autenticazione
- `POST /api/auth/login` - Login utente
- `POST /api/auth/logout` - Logout utente  
- `GET /api/auth/me` - Verifica sessione

### Gestione Album
- `GET /api/albums` - Lista album
- `POST /api/albums` - Crea album (admin)
- `PUT /api/albums/:id` - Modifica album (admin)
- `DELETE /api/albums/:id` - Elimina album (admin)

### Sistema Matching
- `GET /api/matches` - Match utente
- `POST /api/matches` - Crea match
- `GET /api/matches/potential` - Trova potenziali match

### Diagnostici
- `GET /api/_health` - Health check sistema
- `GET /api/_seed` - Seed utenti test
- `GET /api/_whoami` - Info utente corrente

## 🗄️ Database Schema

### Tabelle Principali
- `users` - Utenti sistema
- `albums` - Album figurine
- `stickers` - Figurine individuali
- `user_stickers` - Collezioni utente
- `matches` - Sistema matching
- `messages` - Chat persistente
- `reports` - Segnalazioni automatiche

## 🚀 Deployment

### Render (Produzione)

```bash
# Build Settings
Build Command: npm install && npm run build
Start Command: npm start
Node Version: 18+

# Environment Variables
SUPABASE_DATABASE_URL=postgresql://...
JWT_SECRET=production-secret
NODE_ENV=production
NPM_CONFIG_PRODUCTION=false
```

### Locale

```bash
# Setup database locale
createdb matchboxpro
npm run db:push

# Avvia sviluppo
npm run dev
```

## 🧪 Testing

```bash
# Test utenti (dopo seed)
curl https://matchboxpro.onrender.com/api/_seed

# Health check
curl https://matchboxpro.onrender.com/api/_health

# Login test
curl -X POST https://matchboxpro.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nickname":"admin","password":"admin123"}'
```

## 📚 Documentazione

- [**API Documentation**](./API_DOCUMENTATION.md) - Documentazione completa API
- [**Development Setup**](./DEVELOPMENT_SETUP.md) - Guida setup sviluppo
- [**Project Structure**](./PROJECT_STRUCTURE.md) - Architettura progetto
- [**Deployment Guide**](./DEPLOYMENT.md) - Guida deployment Render

## 🤝 Contribuire

1. Fork del repository
2. Crea feature branch (`git checkout -b feature/amazing-feature`)
3. Commit modifiche (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri Pull Request

## 📄 Licenza

Progetto privato - Tutti i diritti riservati

## 🆘 Supporto

**Problemi Comuni:**

- **Build Error**: Verifica Node.js 18+ e `npm run clean`
- **Database Error**: Controlla `SUPABASE_DATABASE_URL`
- **JWT Error**: Verifica `JWT_SECRET` configurato
- **Port Error**: App usa porta 3001 (evita conflitto AirTunes macOS)

**Contatti:**
- 🐛 Issues: [GitHub Issues](https://github.com/matchboxpro/matchboxpro-trading/issues)
- 📧 Email: support@matchboxpro.com
- 💬 Discord: [MatchboxPro Community](https://discord.gg/matchboxpro)

---

**Ultimo aggiornamento**: 2025-08-20 - Sistema attivazione album + UI miglioramenti + validazione nickname

Made with ❤️ by MatchboxPro Team
