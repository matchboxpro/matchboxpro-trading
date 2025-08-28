# MatchboxPro - Struttura Progetto

> **IMPORTANTE**: Consultare sempre questo file prima di modifiche per evitare errori di percorso o duplicazioni.

## 📋 Info Generali

**Progetto**: MatchboxPro - Web App scambio figurine Panini  
**Stack**: React + TypeScript + Express + PostgreSQL  
**Porta**: 3001 (evita conflitto AirTunes macOS)  
**Build**: Vite (frontend) + esbuild (backend)  
**DB**: PostgreSQL su Render  
**Auth**: JWT + cookie HttpOnly + bcrypt  
**Deploy**: Render ($7/mese) - https://matchboxpro.onrender.com  
**Aggiornato**: 29/08/2025 - PWA Layout Unification + Mobile Optimization

## 🎯 Funzionalità Principali

### 📱 App Mobile
- **HOME**: Dashboard + statistiche
- **MATCH**: Algoritmo 1:1 + chat integrata
- **ALBUM**: Stati SI/NO/DOPPIA + sync admin
- **PROFILO**: Gestione dati + preferenze

### 🖥️ Admin Panel
- **Accesso**: Solo role="admin"
- **Gestione**: Album, figurine, utenti, segnalazioni
- **Export**: CSV/JSON

### 🔐 Sicurezza
- **Auth**: JWT + cookie HttpOnly + bcrypt
- **Validazioni**: CAP, nickname, anti-spam
- **Rate limiting**: 30 req/10s endpoint critici

## 🏗️ Architettura

```
matchboxpro_current/
├── client/     # Frontend React + Vite
├── server/     # Backend Express + storage modulare  
├── api/        # Diagnostici (_health, _seed, _whoami)
├── shared/     # Tipi + schema DB
├── migrations/ # Drizzle migrations
└── scripts/    # Utility + governance
```

**IMPORTANTE**: Server serve solo `/client/`, NON `/matchboxpro/client/`

## 🎯 Frontend (Client)

```
client/src/
├── components/
│   ├── ui/     # Componenti base (Button, Dialog, etc.)
│   └── admin/  # Componenti admin modulari
│       ├── reports/  # ReportsSection, ReportsTable, ReportsActions, ReportsMutations
│       └── modals/   # StickerManagementModal, etc.
├── pages/      # admin.tsx, album.tsx, dashboard.tsx, match.tsx, chat.tsx
├── hooks/      # use-toast.ts
├── lib/        # queryClient.ts
└── utils/      # Utility functions
```

### Admin Panel
**File**: `/client/src/pages/admin.tsx` (modulare, 176 righe)

**Sezioni**: dashboard, albums, users, reports, settings

**Componenti modulari**:
- **ReportsSection** → estratto in ReportsActions + ReportsMutations
- **StickerManagementModal** (204 righe)
- **UsersSection** - Gestione utenti con toggle attivo/disattivo
- **EditAlbumDialog** + **DeleteAlbumDialog**

## 🔧 Backend (Server)

```
server/
├── index.ts    # Entry point Express
├── routes.ts   # API routes
└── storage/    # Sistema modulare
    ├── DatabaseStorage.ts (174 righe)
    ├── database/connection.ts
    ├── interfaces/IStorage.ts
    └── repositories/  # Pattern Repository
        ├── UserRepository.ts (50 righe)
        ├── AlbumRepository.ts (46 righe)
        ├── StickerRepository.ts (89 righe)
        ├── MatchRepository.ts (158 righe)
        ├── MessageRepository.ts (28 righe)
        ├── ReportRepository.ts (146 righe)
        └── AdminRepository.ts (24 righe)
```

### API Endpoints

**Auth**: `/api/auth/login|logout|me`  
**User**: `/api/user/profile|stickers/:albumId`  
**Admin**: `/api/admin/stats|users|reports`  
**Albums**: `/api/albums` (CRUD + stickers)  
**Matching**: `/api/matches|potential`  
**Utils**: `/api/_health|_seed|_whoami`

### Vite Config
**File**: `/server/vite.ts` - Serve `/client/` con hot reload

## 💾 Database

**Tabelle**: users, albums, stickers, user_stickers, matches, messages, reports  
**ORM**: Drizzle + PostgreSQL su Render  
**Schema**: `/shared/schema.ts` con timestamptz  
**Migrazioni**: Drizzle Kit in `/migrations/`

### Pattern Repository
- **UserRepository**: Auth + gestione utenti
- **AlbumRepository**: CRUD album
- **StickerRepository**: Figurine + collezioni
- **MatchRepository**: Algoritmo matching
- **MessageRepository**: Chat persistente
- **ReportRepository**: Segnalazioni + paginazione
- **AdminRepository**: Statistiche

**Governance**: ✅ File <200 righe, responsabilità singola, interface segregation

## 🎨 UI/UX

**Design**: Primary `#05637b`, Accent `#f8b400`, Background `#fff4d6`  
**Componenti**: Radix UI + Tailwind CSS + Lucide React  
**Toast**: `useToast()` per feedback operazioni

## 🔄 Data Flow

**React Query**: `/lib/queryClient.ts` con cache keys per albums, stats, reports  
**Mutations**: Invalidazione cache + optimistic updates + error handling toast

## 🚨 Problemi Risolti

**Directory sbagliata**: Server serve `/client/` NON `/matchboxpro/client/`  
**Hot reload**: Cache browser + file corretto + hard refresh  
**Architettura modulare**: Admin refactored da 507 a 176 righe + componenti separati  
**Governance**: Sistema automatico per file >300 righe

## 📝 Convenzioni

**Naming**: PascalCase componenti, camelCase utils, REST API  
**Styling**: Tailwind CSS + Radix UI + mobile-first  
**Error Handling**: Try/catch + toast (frontend), middleware + auto-reporting (backend)

## 💾 Backup

**Script**: `./backup_manager.sh` - Rotazioni automatiche a 2 backup  
**Esclusioni**: node_modules, .git, dist, .DS_Store  
**Quando**: Prima modifiche strutturali, dopo feature, prima refactoring

**Ripristino**: `tar -xzf backup.tar.gz && npm install && npm run dev`

## 🔄 Workflow

**Prima**: Backup + consultare file + verificare `/client/` + check API  
**Durante**: File corretto + hot reload + console check + toast  
**Dopo**: Aggiornare doc + test + pulizia + backup + commit

## 🎯 Roadmap

**Completato**: ✅ Refactoring admin modulare, backup automatico, governance compliance  
**TODO**: TypeScript strict mode, bundle optimization, testing suite, monitoring

---

## 📞 Note Sviluppatori

> **RICORDA**: Server serve SOLO `/client/`, NON `/matchboxpro/client/`
> **IMPORTANTE**: Aggiornare questo file ad ogni modifica significativa

## 🚀 Deployment

**URL**: https://matchboxpro.onrender.com  
**Build**: `npm install && npm run build`  
**Start**: `npm start`  
**Env**: SUPABASE_DATABASE_URL, JWT_SECRET, NODE_ENV=production

**Utils**: `/api/_health`, `/api/_seed`, `/api/_whoami`

---

**Ultimo aggiornamento**: 2025-08-29 - PWA Layout Unification + Mobile Optimization

### ✅ Aggiornamenti Recenti
- **PWA Safe-Area**: CSS variables unificati (--sat, --sab, --sal, --sar) con @media (display-mode: standalone)
- **Bottom Navigation**: Sistema overlay con ::after pseudo-element per safe-area-inset-bottom
- **Color Normalization**: Sostituzione completa hex colors con CSS variables --brand-azzurro/giallo
- **Mobile Fixes**: Scroll verticale figurine, modal touch outside, icone navigazione migliorate
- **Code Cleanup**: Rimossi console.log debug da server routes e repositories per produzione

