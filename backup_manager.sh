#!/bin/bash

# MatchboxPro Backup Manager
# Mantiene solo 2 backup nella cartella, sovrascrivendo sempre quello più vecchio

PORTABLE_DIR="/Users/dero/Documents/MatchboxPro_Portable"
CURRENT_DIR="$PORTABLE_DIR/matchboxpro_current"
BACKUP_1="$PORTABLE_DIR/matchboxpro_backup_1"
BACKUP_2="$PORTABLE_DIR/matchboxpro_backup_2"

echo "🔄 MatchboxPro Backup Manager - Avvio backup..."

# Verifica che la directory corrente esista
if [ ! -d "$CURRENT_DIR" ]; then
    echo "❌ Errore: Directory corrente non trovata: $CURRENT_DIR"
    exit 1
fi

# Sistema di rotazione backup:
# Se backup_1 esiste, diventa backup_2
if [ -d "$BACKUP_1" ]; then
    echo "📦 Spostamento backup_1 -> backup_2..."
    # Rimuovi backup_2 se esiste per fare spazio
    if [ -d "$BACKUP_2" ]; then
        echo "🗑️  Rimozione backup_2 vecchio..."
        rm -rf "$BACKUP_2"
    fi
    mv "$BACKUP_1" "$BACKUP_2"
fi

# Crea nuovo backup_1 dalla directory corrente
echo "💾 Creazione nuovo backup_1..."
cp -r "$CURRENT_DIR" "$BACKUP_1"

# Rimuovi node_modules dai backup per risparmiare spazio
echo "🗑️  Rimozione node_modules dai backup..."
rm -rf "$BACKUP_1/node_modules"
rm -rf "$BACKUP_1/client/node_modules"
rm -rf "$BACKUP_1/server/node_modules"

if [ -d "$BACKUP_2" ]; then
    rm -rf "$BACKUP_2/node_modules"
    rm -rf "$BACKUP_2/client/node_modules"
    rm -rf "$BACKUP_2/server/node_modules"
fi

# Verifica risultato
BACKUP_COUNT=$(ls -d "$PORTABLE_DIR"/matchboxpro_backup* 2>/dev/null | wc -l)
echo "✅ Backup completato! Backup presenti: $BACKUP_COUNT/2"

if [ -d "$BACKUP_1" ]; then
    echo "📁 backup_1 (più recente): $(date -r "$BACKUP_1" '+%Y-%m-%d %H:%M:%S')"
fi

if [ -d "$BACKUP_2" ]; then
    echo "📁 backup_2 (più vecchio): $(date -r "$BACKUP_2" '+%Y-%m-%d %H:%M:%S')"
fi

echo "🎉 Sistema di backup automatico completato!"
