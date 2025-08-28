 # MatchboxPro 🃏

**Web App per scambio figurine Panini tra collezionisti**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen)](https://matchboxpro.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)

## 🎯 Panoramica

Piattaforma moderna per collezionisti di figurine Panini:

- 📱 **Gestione collezione** (SI/NO/DOPPIA)
- 🤝 **Match automatici** per scambi 1:1 
- 💬 **Chat integrata** per coordinare scambi
- 🏛️ **Admin panel** per gestione album/figurine
- 📊 **Statistiche** e segnalazioni

## 🚀 Demo Live

- **App**: https://matchboxpro.onrender.com
- **Health**: https://matchboxpro.onrender.com/api/_health
- **Test Users**: https://matchboxpro.onrender.com/api/_seed

## 🏗️ Stack Tecnologico

**Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Radix UI  
**Backend**: Express.js + TypeScript + JWT + bcrypt + Drizzle ORM  
**Database**: PostgreSQL su Render con migrazioni Drizzle Kit  
**Deployment**: Render Starter ($7/mese) con auto-deploy GitHub

## 🔐 Sicurezza

- JWT tokens con cookie HttpOnly sicuri
- Password hashing bcrypt (10 salt rounds)
- Rate limiting e request deduplication
- Input validation e prepared statements
- Production logging ottimizzato

## 🎯 Funzionalità Principali

### 🔧 Gestione Figurine
- **Stati**: SI (Verde) / NO (Rosso) / DOPPIA (Giallo)
- **Performance**: Feedback immediato zero-lag su mobile
- **Ricerca**: Filtri avanzati per stato/nome/categoria
- **Sync**: Aggiornamenti real-time cross-device

### 🤝 Sistema Matching
- **Algoritmo**: Match intelligenti 1:1 per zona geografica
- **Chat**: Messaggistica integrata per coordinare scambi
- **Tracciamento**: Gestione completa proposte e scambi

### 📱 Esperienza Mobile
- **PWA**: Installabile come app nativa
- **Fullscreen**: Interfaccia senza barre browser
- **Touch**: Controlli ottimizzati 44x44px minimum
- **Performance**: Hardware acceleration + eventi touch ottimizzati

## 🚀 Quick Start

**Prerequisiti**: Node.js 18+, npm 8+, PostgreSQL

```bash
# Installazione
git clone https://github.com/matchboxpro/matchboxpro-trading.git
cd matchboxpro-trading
npm run setup

# Configurazione
cp .env.example .env
# Configura: SUPABASE_DATABASE_URL, JWT_SECRET, NODE_ENV

# Avvio
npm run dev  # Sviluppo (porta 3001)
npm start    # Produzione
```

## 📁 Struttura Progetto

```
matchboxpro_current/
├── client/     # Frontend React + Vite
├── server/     # Backend Express + storage modulare
├── api/        # Endpoint diagnostici
├── shared/     # Tipi condivisi
├── migrations/ # Database migrations
└── scripts/    # Utility scripts
```

## 🛠️ Comandi

```bash
npm run dev     # Sviluppo con hot reload
npm run build   # Build produzione
npm run start   # Avvia produzione
npm run setup   # Setup automatico
npm run db:push # Aggiorna schema database
```

## 🔌 API Endpoints

**Auth**: `/api/auth/login|logout|me`  
**Albums**: `/api/albums` (CRUD + stickers)  
**Matching**: `/api/matches|potential`  
**Admin**: `/api/admin/stats|users|reports`  
**Utils**: `/api/_health|_seed|_whoami`

## 🗄️ Database

**Tabelle**: users, albums, stickers, user_stickers, matches, messages, reports  
**ORM**: Drizzle con PostgreSQL su Render  
**Migrazioni**: Automatiche con Drizzle Kit

## 🚀 Deployment

**Render**: Build `npm install && npm run build`, Start `npm start`  
**Env**: SUPABASE_DATABASE_URL, JWT_SECRET, NODE_ENV=production  
**Locale**: `createdb matchboxpro && npm run db:push && npm run dev`

## 🧪 Testing

```bash
curl https://matchboxpro.onrender.com/api/_seed    # Seed utenti test
curl https://matchboxpro.onrender.com/api/_health  # Health check
```

## 📚 Documentazione

- [API Documentation](./API_DOCUMENTATION.md)
- [Development Setup](./DEVELOPMENT_SETUP.md)  
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contribuire

1. Fork repository
2. Feature branch (`git checkout -b feature/name`)
3. Commit (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/name`)
5. Pull Request

## 📄 Licenza

Progetto privato - Tutti i diritti riservati

## 🆘 Supporto

**Problemi comuni**: Build Error (Node.js 18+), Database Error (URL), JWT Error (SECRET), Port Error (3001)

**Contatti**: [GitHub Issues](https://github.com/matchboxpro/matchboxpro-trading/issues)

---

**Ultimo aggiornamento**: 2025-08-29 - PWA Layout Unification + Mobile Optimization

Made with ❤️ by MatchboxPro Team
