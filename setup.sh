#!/bin/bash

# MatchboxPro Setup Script
# Compatibile con Mac Intel e Apple Silicon

echo "🚀 MatchboxPro Setup Script"
echo "Configurazione per Mac Intel e Apple Silicon"
echo "=========================================="

# Verifica architettura
ARCH=$(uname -m)
echo "📋 Architettura rilevata: $ARCH"

if [[ "$ARCH" == "arm64" ]]; then
    echo "🍎 Apple Silicon (M1/M2/M3) rilevato"
elif [[ "$ARCH" == "x86_64" ]]; then
    echo "💻 Intel Mac rilevato"
else
    echo "⚠️  Architettura non riconosciuta: $ARCH"
fi

# Pulizia dipendenze esistenti
echo "🧹 Pulizia dipendenze esistenti..."
rm -rf node_modules package-lock.json

# Verifica Node.js
NODE_VERSION=$(node --version 2>/dev/null || echo "non installato")
echo "📦 Node.js version: $NODE_VERSION"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trovato. Installa Node.js da https://nodejs.org/"
    exit 1
fi

# Installazione dipendenze con configurazione per architettura
echo "📥 Installazione dipendenze..."
npm config set target_arch $ARCH
npm config set target_platform darwin

# Installazione con rebuild forzato per architettura corrente
npm install --force

# Verifica installazione esbuild
echo "🔧 Verifica esbuild..."
if npm list esbuild &> /dev/null; then
    echo "✅ esbuild installato correttamente"
else
    echo "⚠️  Reinstallazione esbuild..."
    npm install esbuild --force
fi

# Verifica dipendenze native
echo "🔍 Verifica dipendenze native..."
npm rebuild

echo "✅ Setup completato!"
echo "🚀 Per avviare l'applicazione: npm run dev"
echo "🌐 L'app sarà disponibile su: http://localhost:3001"
