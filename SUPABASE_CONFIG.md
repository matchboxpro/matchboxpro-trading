# 🗄️ MatchboxPro - Configurazione Supabase

> **Aggiornato**: 2025-08-14 23:37  
> **Versione Schema**: 1.0  
> **Database**: PostgreSQL 15 su AWS EU-Central-1

## 🔗 Connessione Database

```bash
Host: aws-0-eu-central-1.pooler.supabase.com
Porta: 6543 (Connection Pooler)
Database: postgres
Regione: EU Central (Frankfurt)
```

## 📊 Schema Database

### 👥 **users** - Gestione Utenti
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nickname VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    cap VARCHAR(5) NOT NULL,
    raggio_km INTEGER NOT NULL DEFAULT 10,
    album_selezionato UUID REFERENCES albums(id),
    start_trial TIMESTAMP NOT NULL DEFAULT NOW(),
    is_premium BOOLEAN NOT NULL DEFAULT false,
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Validazione Zod:**
- `nickname`: 3-50 caratteri, solo lettere/numeri/underscore
- `cap`: esattamente 5 cifre
- `password`: minimo 6 caratteri

---

### 📚 **albums** - Album Figurine
```sql
CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Esempi:**
- Panini Calciatori 2024-25
- Champions League 2024
- Serie A 2023-24

---

### 🎴 **stickers** - Figurine
```sql
CREATE TABLE stickers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    number VARCHAR(10) NOT NULL,
    name TEXT NOT NULL,
    team TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Formato Dati:**
- `number`: "UPD07", "001", "C1"
- `name`: "Inter-Milan 2-3 - supercoppa"
- `team`: "Inter", "Milan" (opzionale)

---

### 👤 **user_stickers** - Collezione Utente
```sql
CREATE TABLE user_stickers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sticker_id UUID NOT NULL REFERENCES stickers(id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL, -- 'yes', 'no', 'double'
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Status Values:**
- `yes`: Figurina posseduta
- `no`: Figurina mancante
- `double`: Figurina doppia (per scambio)

---

### 🤝 **matches** - Sistema Scambi
```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Status Values:**
- `active`: Match attivo
- `completed`: Scambio completato
- `cancelled`: Match annullato

---

### 💬 **messages** - Chat Scambi
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

### 🚨 **reports** - Sistema Segnalazioni
```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'nuovo',
    priority VARCHAR(10) NOT NULL DEFAULT 'media',
    page VARCHAR(100),
    error_details TEXT,
    user_agent TEXT,
    url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Tipi Report:**
- `user`: Segnalazione utente
- `error`: Errore applicazione
- `spam`: Contenuto spam
- `js_error`: Errore JavaScript
- `network_error`: Errore rete
- `api_error`: Errore API

## 🔧 API Endpoints

### Albums
- `GET /api/albums` - Lista album
- `POST /api/albums` - Crea album (admin)
- `PUT /api/albums/:id` - Modifica album (admin)
- `DELETE /api/albums/:id` - Elimina album (admin)

### Stickers
- `GET /api/albums/:albumId/stickers` - Lista figurine album
- `POST /api/albums/:albumId/stickers/bulk` - Import bulk figurine (admin)
- `DELETE /api/albums/:albumId/stickers` - Elimina tutte figurine (admin)

### User Stickers
- `GET /api/user-stickers/:albumId` - Collezione utente
- `POST /api/user-stickers` - Aggiorna status figurina
- `PUT /api/user-stickers/:stickerId` - Modifica status

### Auth
- `POST /api/auth/register` - Registrazione
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Profilo utente

## 🔒 Sicurezza

### Middleware Auth
- `requireAuth`: Richiede login utente
- `requireAdmin`: Richiede privilegi admin (attualmente aperto)

### Validazione
- **Zod schemas** per tutti gli input
- **Sanitizzazione** automatica dati
- **Type safety** completo con TypeScript

## 📈 Performance

### Ottimizzazioni
- **Connection Pooler** Supabase attivo
- **Cache headers** su endpoint stickers (1 ora)
- **No-cache** su endpoint albums per aggiornamenti real-time
- **Cascade delete** per integrità referenziale

### Indici Consigliati
```sql
-- Per performance query frequenti
CREATE INDEX idx_stickers_album_id ON stickers(album_id);
CREATE INDEX idx_user_stickers_user_id ON user_stickers(user_id);
CREATE INDEX idx_user_stickers_sticker_id ON user_stickers(sticker_id);
CREATE INDEX idx_matches_users ON matches(user1_id, user2_id);
CREATE INDEX idx_messages_match_id ON messages(match_id);
```

## 🛠️ Comandi Utili

### Connessione Database
```bash
# Via psql
psql "postgresql://postgres.ihytoeyaxufmvvlvptrg:Jazzclub-00!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Test connessione
npm run dev  # Verifica log "✅ CONNECTING TO SUPABASE"
```

### Debug Query
```javascript
// Nel codice, abilita log Drizzle
const db = drizzle(pool, { logger: true });
```

---

**📝 Nota**: Questo file viene aggiornato automaticamente ad ogni modifica dello schema database.
