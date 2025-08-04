#!/bin/bash
echo "🔍 Vérification des fichiers non poussés..."

echo ""
echo "📦 Fichiers non ajoutés (untracked):"
git ls-files --others --exclude-standard

echo ""
echo "📝 Fichiers modifiés mais non commités:"
git diff --name-only

echo ""
echo "🚀 Commits en attente de push (si branché à un remote):"
git log origin/main..HEAD --oneline
