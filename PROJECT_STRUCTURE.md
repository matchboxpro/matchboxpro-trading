# MatchboxPro - Documentazione Struttura Progetto

> **IMPORTANTE**: Questo file deve essere sempre aggiornato quando si modificano componenti, routing, API o strutture dati. Consultare sempre questo file prima di iniziare modifiche per evitare errori di percorso o duplicazioni.

## 📋 Informazioni Generali

- **Nome Progetto**: MatchboxPro (MATCHBOX)
- **Tipo**: Web Application per scambio figurine Panini tra utenti
- **Stack**: React + TypeScript + Express + PostgreSQL
- **Porta Server**: 3001 (configurata per evitare conflitto AirTunes macOS su porta 5000)
- **Build Tool**: Vite (frontend) + esbuild (backend)
- **Database**: PostgreSQL su Render
- **Autenticazione**: JWT con cookie HttpOnly sicuri + bcrypt
- **Deployment**: Render Starter ($7/mese) - https://matchboxpro.onrender.com
- **Ultimo Aggiornamento**: 18/08/2025 - Deploy completo su Render con JWT

## 🎯 Obiettivo Progetto (PROMPT ORIGINALE)

**MATCHBOX** è una web app per lo scambio di figurine Panini tra utenti con:

### 📱 App Mobile (Utenti)
- **HOME**: Dashboard iniziale
- **MATCH**: Algoritmo 1:1 per scambio figurine, elenco utenti compatibili per CAP
- **ALBUM**: Gestione figurine con 3 stati (SI/NO/DOPPIA), sincronizzazione con admin
- **PROFILO**: Modifica nickname, CAP, raggio, album attivo

### 🖥️ Admin Panel (Solo Desktop)
- **Accesso**: Solo utenti con role === "admin", URL diretto
- **Funzionalità**: Creazione album, inserimento figurine, visualizzazione segnalazioni/errori
- **Export**: Dati in CSV/JSON

### 🔐 Autenticazione & Sicurezza
- **Login**: nickname + password con JWT tokens
- **Password**: Hashate con bcrypt (salt rounds: 10)
- **Tokens**: JWT firmati, cookie HttpOnly, Secure, SameSite=Lax
- **Profilo**: cap, raggioKm, albumSelezionato, role
- **Validazioni**: CAP 5 cifre, nickname lunghezza, anti-spam
- **Trust Proxy**: Abilitato per deployment Render

### 💬 Sistema Match & Chat
- **Algoritmo**: 1:1 per figurine mancanti/doppie
- **Chat**: Testuale persistente, realtime Supabase
- **Match**: Pulsante "Matcha" → chat tra utenti

### 🚨 Sistema Segnalazioni (AUTOMATICO)
- **Modalità**: Silenziosa, automatica dall'app
- **Dati**: Errore + nome utente + data + orario
- **Admin**: Visualizzazione e gestione segnalazioni

## 🏗️ Architettura del Progetto

### Directory Principale
```
/Users/dero/Documents/MatchboxPro_Portable/matchboxpro_current/
├── client/          ← Frontend React + Vite
├── server/          ← Backend Express + esbuild
├── api/             ← Endpoint diagnostici (_health, _seed, _whoami)
├── shared/          ← Tipi condivisi e schema database
├── migrations/      ← Migrazioni database Drizzle
├── scripts/         ← Script utilità e governance
├── package.json     ← Dipendenze unificate
├── vite.config.ts   ← Configurazione Vite
├── vercel.json      ← Blocco deployment Vercel (solo Render)
└── tsconfig.json    ← Configurazione TypeScript
```

### ⚠️ IMPORTANTE - Directory Servite
- **ATTIVA**: `/client/` - Servita da Vite in sviluppo
- **OBSOLETA**: `/matchboxpro/client/` - NON utilizzata dal server
- **Server Entry**: `/server/index.ts` → `/server/vite.ts` → serve `/client/index.html`

## 🎯 Frontend (Client)

### Struttura Client
```
client/
├── src/
│   ├── components/
│   │   ├── ui/              ← Componenti base (Button, Dialog, etc.)
│   │   └── admin/           ← Componenti admin modulari
│   │       ├── sections/    ← Sezioni admin (DashboardSection, AlbumsSection, ReportsSection)
│   │       ├── modals/      ← Modal admin (StickerManagementModal, NewAlbumModal)
│   │       ├── dialogs/     ← Dialog admin (EditAlbumDialog, DeleteAlbumDialog)
│   │       └── lists/       ← Liste admin (AlbumList)
│   ├── pages/
│   │   ├── admin.tsx        ← PAGINA ADMIN PRINCIPALE (monolitica)
│   │   ├── album.tsx        ← Gestione album utente
│   │   ├── dashboard.tsx    ← Dashboard utente
│   │   ├── match.tsx        ← Sistema matching
│   │   └── chat.tsx         ← Chat/messaggi
│   ├── hooks/
│   │   └── use-toast.ts     ← Hook per notifiche
│   ├── lib/
│   │   └── queryClient.ts   ← Configurazione React Query
│   └── utils/               ← Utility functions
├── index.html               ← Template HTML principale
└── public/                  ← Asset statici
```

### Pagina Admin (REFACTORED)
**File**: `/client/src/pages/admin.tsx` (modulare)

**Sezioni**:
- `dashboard` - Statistiche generali
- `albums` - Gestione album e figurine
- `users` - Gestione utenti registrati ← **SEZIONE AGGIUNTA**
- `reports` - Gestione segnalazioni
- `settings` - Impostazioni sistema

**Stato React**:
```typescript
const [activeSection, setActiveSection] = useState<"dashboard" | "albums" | "users" | "reports" | "settings">("dashboard");
const [stickerManagementModal, setStickerManagementModal] = useState<{show: boolean, album: any | null}>({show: false, album: null});
const [editAlbumDialog, setEditAlbumDialog] = useState<{show: boolean, album: any | null}>({show: false, album: null});
const [deleteAlbumDialog, setDeleteAlbumDialog] = useState<{show: boolean, album: any | null}>({show: false, album: null});
```

**Funzionalità Album**:
- ✅ Lista album con pulsante "Gestisci" (collegato a StickerManagementModal)
- ✅ **StickerManagementModal** (204 righe, modulare) con:
  - Textarea import manuale figurine
  - Campo URL import da Panini
  - Pulsanti: Importa, Esporta, Svuota
  - Tabella figurine con azioni eliminazione
- ✅ **EditAlbumDialog** - Dialog personalizzato per modifica nome
- ✅ **DeleteAlbumDialog** - Dialog personalizzato per conferma eliminazione

**Funzionalità Utenti (NUOVO)**:
- ✅ **UsersSection** - Componente modulare per gestione utenti
- ✅ Header azzurro con titolo "Gestione Utenti" e campo ricerca
- ✅ Statistiche: Utenti Totali, Attivi, Disattivati
- ✅ Lista utenti con avatar, badge status, date iscrizione/accesso
- ✅ Pulsante toggle "Attiva/Disattiva" per controllo stato utente
- ✅ Layout consistente con altre sezioni admin (sfondo bianco, header azzurro)

## 🔧 Backend (Server)

### Struttura Server (REFACTORED - Architettura Modulare)
```
server/
├── index.ts         ← Entry point Express
├── vite.ts          ← Configurazione Vite middleware
├── routes.ts        ← Definizione API routes
└── storage/         ← Sistema storage modulare (NUOVO)
    ├── index.ts                    ← Export principale (6 righe)
    ├── DatabaseStorage.ts          ← Orchestratore (174 righe)
    ├── database/
    │   └── connection.ts           ← Connessione DB (15 righe)
    ├── interfaces/
    │   └── IStorage.ts             ← Interface principale (78 righe)
    └── repositories/               ← Pattern Repository
        ├── UserRepository.ts       ← Gestione utenti (50 righe)
        ├── AlbumRepository.ts      ← Gestione album (46 righe)
        ├── StickerRepository.ts    ← Gestione figurine (89 righe)
        ├── MatchRepository.ts      ← Sistema matching (158 righe)
        ├── MessageRepository.ts    ← Chat/messaggi (28 righe)
        ├── ReportRepository.ts     ← Segnalazioni (146 righe)
        └── AdminRepository.ts      ← Statistiche admin (24 righe)
```

### API Endpoints Principali
```
# Autenticazione
POST /api/auth/login            ← Login utente
POST /api/auth/logout           ← Logout utente
GET  /api/auth/me              ← Verifica sessione

# Gestione Utenti
GET  /api/user/profile         ← Profilo utente
PUT  /api/user/profile         ← Aggiorna profilo
POST /api/user/register        ← Registrazione nuovo utente

# Admin - Statistiche
GET  /api/admin/stats          ← Statistiche dashboard admin

# Admin - Gestione Utenti (NUOVO)
GET  /api/admin/users          ← Lista tutti gli utenti
PATCH /api/admin/users/:id/toggle-status ← Attiva/disattiva utente

# Gestione Album
GET  /api/albums               ← Lista album attivi
GET  /api/albums/:id           ← Dettagli album specifico
POST /api/albums               ← Crea nuovo album (admin)
PUT  /api/albums/:id           ← Modifica album (admin)
DELETE /api/albums/:id         ← Elimina album (admin)

# Gestione Figurine
GET  /api/albums/:id/stickers  ← Figurine di un album
POST /api/albums/:id/stickers  ← Crea singola figurina (admin)
PUT  /api/stickers/:id         ← Modifica figurina (admin)
DELETE /api/stickers/:id       ← Elimina figurina (admin)
POST /api/albums/:id/stickers/bulk ← Import figurine bulk (admin)

# Sistema Matching
GET  /api/matches              ← Lista match utente
POST /api/matches              ← Crea nuovo match
GET  /api/matches/potential    ← Trova potenziali match

# Chat/Messaggi
GET  /api/matches/:id/messages ← Messaggi di un match
POST /api/matches/:id/messages ← Invia messaggio

# Sistema Segnalazioni
GET  /api/admin/reports        ← Lista segnalazioni (admin)
POST /api/reports              ← Crea segnalazione automatica
PUT  /api/reports/:id          ← Aggiorna stato segnalazione (admin)

# User Stickers (Collezione Utente)
GET  /api/user/stickers/:albumId ← Stato figurine utente per album
PUT  /api/user/stickers/:stickerId ← Aggiorna stato figurina (SI/NO/DOPPIA)
```

### Configurazione Vite
**File**: `/server/vite.ts`
- **Template Path**: `path.resolve(import.meta.dirname, "..", "client", "index.html")`
- **Middleware**: Vite serve tutto da `/client/`
- **Hot Reload**: Attivo in sviluppo

## 💾 Database (Supabase)

### Tabelle Principali
- `albums` - Album figurine
- `stickers` - Figurine individuali
- `users` - Utenti sistema
- `reports` - Segnalazioni
- `matches` - Sistema matching

### Connessione Database
- **File**: `/server/storage/database/connection.ts`
- **Driver**: Drizzle ORM + node-postgres
- **Pool**: PostgreSQL connection pool
- **URL**: `process.env.SUPABASE_DATABASE_URL` (PostgreSQL su Render)
- **Schema**: Definito in `/shared/schema.ts` con timestamptz
- **Migrazioni**: Gestite con Drizzle Kit in `/migrations/`

### Pattern Repository Implementato
- **UserRepository**: Gestione utenti, autenticazione, admin user management
- **AlbumRepository**: CRUD album, conteggio figurine
- **StickerRepository**: CRUD figurine, gestione collezioni utente
- **MatchRepository**: Algoritmo matching, ricerca potenziali scambi
- **MessageRepository**: Sistema chat persistente
- **ReportRepository**: Segnalazioni automatiche, paginazione
- **AdminRepository**: Statistiche dashboard admin

### Governance Rispettata
- ✅ **File < 200 righe**: Tutti i repository sotto il limite
- ✅ **Responsabilità singola**: Un dominio per repository
- ✅ **Interface segregation**: IStorage ben definita
- ✅ **Dependency injection**: Composition pattern nel DatabaseStorage

## 🎨 UI/UX

### Design System
- **Colori Principali**:
  - Primary: `#05637b` (blu scuro)
  - Secondary: `#052b3e` (blu molto scuro)
  - Accent: `#f8b400` (giallo/arancione)
  - Background: `#fff4d6` (crema)
- **Componenti**: Radix UI + Tailwind CSS
- **Icons**: Lucide React

### Toast System
- **Hook**: `useToast()` da `/hooks/use-toast.ts`
- **Utilizzo**: Feedback operazioni (successo/errore)

## 🔄 Flusso Dati

### React Query
- **Client**: `/lib/queryClient.ts`
- **Cache Keys**: 
  - `["/api/albums"]` - Lista album
  - `["/api/albums", albumId, "stickers"]` - Figurine album
  - `["/api/admin/stats"]` - Statistiche
  - `["/api/admin/reports"]` - Segnalazioni

### Mutations
- **Invalidazione Cache**: `queryClient.invalidateQueries()`
- **Ottimistic Updates**: Per UX fluida
- **Error Handling**: Try/catch con toast

## 🚨 Problemi Risolti e Lezioni Apprese

### Problema Principale (Risolto)
- **Errore**: Modifiche applicate a `/matchboxpro/client/src/components/admin-v2/albums/AlbumsSection.tsx`
- **Causa**: Directory sbagliata - server serve `/client/` non `/matchboxpro/client/`
- **Soluzione**: Modifiche applicate a `/client/src/pages/admin.tsx`

### Hot Reload Issues
- **Problema**: Vite non aggiornava modifiche
- **Causa**: Cache browser + file sbagliato
- **Soluzione**: File corretto + hard refresh

### Architettura Modulare Admin (REFACTORED)
- **Scelta**: Pagina admin modulare (507 righe) + componenti separati
- **Pro**: File corti, manutenzione facile, riutilizzabilità
- **Contro**: Più file da gestire
- **Governance**: Sistema automatico per prevenire file > 300 righe

## 📝 Convenzioni di Sviluppo

### Naming
- **Componenti**: PascalCase (`AlbumCard`)
- **File**: camelCase per utils, PascalCase per componenti
- **API**: REST convention (`/api/resource/:id`)

### Styling
- **Framework**: Tailwind CSS
- **Componenti**: Radix UI primitives
- **Responsive**: Mobile-first approach

### Error Handling
- **Frontend**: Try/catch + toast notifications
- **Backend**: Express error middleware + auto-reporting
- **Database**: Supabase error handling

## 💾 Gestione Backup

### Sistema Backup Automatico (CORRETTO)
**Script**: `./backup_manager.sh` - Sistema a 2 rotazioni automatiche

**Funzionamento**:
1. **backup_1** (più recente) → **backup_2** (più vecchio)
2. Nuovo **backup_1** creato dalla directory corrente
3. **backup_2** vecchio eliminato automaticamente
4. **node_modules** rimossi per ottimizzare spazio

**Directory escluse dal backup**:
- `node_modules/` - Dipendenze (ricostruibili con npm install)
- `.git/` - Repository git (troppo pesante)
- `dist/` - Build artifacts (ricostruibili)
- `.DS_Store` - File sistema macOS

**Quando creare backup**:
- ✅ **Prima di modifiche strutturali importanti**
- ✅ **Dopo completamento di feature significative**
- ✅ **Prima di refactoring maggiori**
- ✅ **Dopo risoluzione di bug critici**
- ✅ **Prima di aggiornamenti dipendenze**

**Backup Attuali**:
- **backup_1** (più recente): 2025-08-14 23:07:51
- **backup_2** (più vecchio): 2025-08-14 23:06:41
- **Stato**: Modal StickerManagement ripristinato, architettura modulare, sistema backup corretto
- **Tipo**: Sistema rotativo automatico a 2 backup
- **Problemi risolti**: Admin modulare (507 righe), modal funzionante, backup rotativo

### Ripristino Backup
```bash
# Estrazione backup
tar -xzf matchboxpro_backup_YYYYMMDD_HHMMSS.tar.gz

# Reinstallazione dipendenze
cd matchboxpro_current
npm install

# Riavvio server
npm run dev
```

## 🔄 Workflow di Modifica

### Prima di Modificare
1. **Creare backup** se modifica strutturale importante
2. **Consultare questo file** per struttura corretta
3. **Verificare directory attiva**: `/client/` non `/matchboxpro/client/`
4. **Controllare API endpoints** esistenti
5. **Verificare stato React** necessario

### Durante Modifica
1. **File corretto**: `/client/src/pages/admin.tsx` per admin
2. **Test immediato**: Hot reload attivo
3. **Console check**: Verificare errori/warning
4. **Toast feedback**: Implementare notifiche

### Dopo Modifica
1. **Aggiornare questo file** se necessario
2. **Test completo**: Tutte le funzionalità
3. **Pulizia**: Rimuovere file obsoleti
4. **Creare backup** se modifica significativa completata
5. **Commit**: Con messaggio descrittivo

## 🎯 Prossimi Sviluppi

### Miglioramenti Possibili
- [x] Refactoring admin.tsx in componenti separati (COMPLETATO)
- [x] Sistema backup automatico funzionante (COMPLETATO)
- [x] Modal StickerManagement ripristinato (COMPLETATO)
- [ ] Implementazione TypeScript strict mode
- [ ] Ottimizzazione bundle size
- [ ] Implementazione testing suite
- [ ] Documentazione API completa

### Manutenzione
- [ ] Aggiornamento dipendenze
- [ ] Pulizia periodica cache
- [ ] Backup database regolari
- [ ] Monitoring performance

---

## 📞 Note per Sviluppatori

> **RICORDA**: Prima di qualsiasi modifica, verifica sempre che stai lavorando sui file corretti in `/client/` e non su duplicati in `/matchboxpro/client/`. Il server Vite serve SOLO la directory `/client/` dalla root del progetto.

> **IMPORTANTE**: Questo file deve essere aggiornato ad ogni modifica significativa della struttura, API o componenti. È il punto di riferimento principale per orientarsi nel progetto.

## 🚀 Deployment Render

### Configurazione Produzione
- **URL Live**: https://matchboxpro.onrender.com
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18+

### Variabili Ambiente
```bash
SUPABASE_DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=production-secret-key
NODE_ENV=production
NPM_CONFIG_PRODUCTION=false
```

### Endpoint Diagnostici Live
- **Health Check**: https://matchboxpro.onrender.com/api/_health
- **Seed Test Users**: https://matchboxpro.onrender.com/api/_seed
- **Current User**: https://matchboxpro.onrender.com/api/_whoami

### Build Process
1. **Frontend**: Vite build → `client/dist/`
2. **Backend**: esbuild → `dist/index.js`
3. **Static Serving**: Express serve `client/dist/` in produzione
4. **API Routes**: Tutti gli endpoint `/api/*` funzionanti

---

**Ultimo aggiornamento**: 2025-08-18 - Deploy completo Render + JWT + endpoint diagnostici

### ✅ Refactoring Storage Modulare (2025-08-16)
- **Problema**: File `storage.ts` monolitico (624 righe) violava governance
- **Soluzione**: Implementato pattern Repository con architettura modulare
- **Risultato**: 11 file separati, tutti < 200 righe, responsabilità singola
- **Vantaggi**: Manutenibilità, testabilità, scalabilità, governance rispettata

### 🏗️ Architettura Storage Implementata
- **DatabaseStorage.ts** (174 righe) - Orchestratore principale
- **UserRepository.ts** (50 righe) - Gestione utenti + admin user management
- **AlbumRepository.ts** (46 righe) - CRUD album
- **StickerRepository.ts** (89 righe) - CRUD figurine + collezioni utente
- **MatchRepository.ts** (158 righe) - Algoritmo matching avanzato
- **MessageRepository.ts** (28 righe) - Sistema chat
- **ReportRepository.ts** (146 righe) - Segnalazioni + paginazione
- **AdminRepository.ts** (24 righe) - Statistiche dashboard

### 👥 Gestione Utenti Admin Implementata
- **UsersSection.tsx** - Componente modulare per admin panel
- **API Endpoints**: `GET /api/admin/users`, `PATCH /api/admin/users/:id/toggle-status`
- **Funzionalità**: Lista utenti, ricerca, statistiche, toggle attivo/disattivo
- **Layout**: Consistente con altre sezioni (header azzurro, box bianchi)
- **Backend**: UserRepository con metodi `getAllUsers()` e `updateUserStatus()`

### 📋 Ultime Modifiche (2025-08-15)
- **Altri file**: 7 files modificati
  - ➕ Aggiunto `PROJECT_STRUCTURE.md`
  - 🗑️ Eliminato `admin_cookies.txt`
  - 🗑️ Eliminato `attached_assets/Pasted--001-Trofeo-Serie-A-002-Player-of-the-Match-003-Trofeo-POTM-004-Atalanta-Logo--1754518792578_1754518792579.txt`
  - ... e altri 4 file
- **Componenti Admin**: 1 file modificato
  - ✏️ Modificato `client/src/components/admin/ReportsSection.tsx`
- **Componenti UI**: 48 files modificati
  - ✏️ Modificato `client/src/components/ui/accordion.tsx`
  - ✏️ Modificato `client/src/components/ui/alert-dialog.tsx`
  - ✏️ Modificato `client/src/components/ui/alert.tsx`
  - ... e altri 45 file
- **Pagine**: 8 files modificati
  - ✏️ Modificato `client/src/pages/admin.tsx`
  - ✏️ Modificato `client/src/pages/album.tsx`
  - ✏️ Modificato `client/src/pages/chat.tsx`
  - ... e altri 5 file
- **Server**: 3 files modificati
  - ✏️ Modificato `server/index.ts`
  - ✏️ Modificato `server/storage.ts`
  - ✏️ Modificato `server/vite.ts`
- **Endpoint API**: 1 file modificato
  - ✏️ Modificato `server/routes.ts`
- **Schema Database**: 1 file modificato
  - ✏️ Modificato `shared/schema.ts`




### 📋 Ultime Modifiche (2025-08-15)
- **Altri file**: 8 files modificati
  - ➕ Aggiunto `PROJECT_STRUCTURE.md`
  - 🗑️ Eliminato `admin_cookies.txt`
  - 🗑️ Eliminato `attached_assets/Pasted--001-Trofeo-Serie-A-002-Player-of-the-Match-003-Trofeo-POTM-004-Atalanta-Logo--1754518792578_1754518792579.txt`
  - ... e altri 5 file
- **Componenti Admin**: 1 file modificato
  - ✏️ Modificato `client/src/components/admin/ReportsSection.tsx`
- **Componenti UI**: 48 files modificati
  - ✏️ Modificato `client/src/components/ui/accordion.tsx`
  - ✏️ Modificato `client/src/components/ui/alert-dialog.tsx`
  - ✏️ Modificato `client/src/components/ui/alert.tsx`
  - ... e altri 45 file
- **Pagine**: 8 files modificati
  - ✏️ Modificato `client/src/pages/admin.tsx`
  - ✏️ Modificato `client/src/pages/album.tsx`
  - ✏️ Modificato `client/src/pages/chat.tsx`
  - ... e altri 5 file
- **Server**: 3 files modificati
  - ✏️ Modificato `server/index.ts`
  - ✏️ Modificato `server/storage.ts`
  - ✏️ Modificato `server/vite.ts`
- **Endpoint API**: 1 file modificato
  - ✏️ Modificato `server/routes.ts`
- **Schema Database**: 1 file modificato
  - ✏️ Modificato `shared/schema.ts`

