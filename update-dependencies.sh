#!/bin/bash

echo "🔄 Limpando cache e dependências antigas..."
rm -rf node_modules
rm -rf .expo
rm -f package-lock.json
rm -f yarn.lock

echo "📦 Instalando dependências base..."
npm install

echo "🔧 Instalando dependências compatíveis com Expo SDK 54..."
npx expo install --fix

echo "✅ Dependências atualizadas!"
echo ""
echo "🚀 Execute agora: npx expo start --clear"


