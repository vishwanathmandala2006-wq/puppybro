#!/usr/bin/env bash
# Quick Render Deployment Checklist
# Run this script to verify everything is ready for Render deployment

echo "🚀 PuppyBro Render Deployment Checklist"
echo "========================================"
echo ""

# Check 1: npm installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not installed. Install Node.js first."
    exit 1
fi
echo "✅ npm installed"

# Check 2: Git installed
if ! command -v git &> /dev/null; then
    echo "❌ git not installed. Install git first."
    exit 1
fi
echo "✅ git installed"

# Check 3: package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi
echo "✅ package.json exists"

# Check 4: pg module in dependencies
if grep -q '"pg"' package.json; then
    echo "✅ PostgreSQL (pg) in dependencies"
else
    echo "⚠️  PostgreSQL (pg) NOT in dependencies. Run: npm install pg"
fi

# Check 5: Procfile exists
if [ -f "Procfile" ]; then
    echo "✅ Procfile exists"
else
    echo "⚠️  Procfile not found (will be created)"
fi

# Check 6: .env.render exists
if [ -f ".env.render" ]; then
    echo "✅ .env.render template exists"
else
    echo "⚠️  .env.render not found"
fi

# Check 7: server.js exists
if [ -f "server.js" ]; then
    echo "✅ server.js exists"
else
    echo "❌ server.js not found"
    exit 1
fi

# Check 8: Git repository
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "✅ Git repository initialized"
else
    echo "⚠️  Not a git repository. Run: git init"
fi

# Check 9: Git remote
if git remote -v | grep -q origin; then
    echo "✅ Git remote origin configured"
else
    echo "⚠️  No remote origin. Add with: git remote add origin https://github.com/YOUR_USERNAME/puppybro.git"
fi

# Check 10: PORT environment variable support
if grep -q "process.env.PORT" server.js; then
    echo "✅ Server uses environment PORT variable"
else
    echo "⚠️  Server may not use environment PORT"
fi

echo ""
echo "========================================"
echo "📋 Deployment Checklist Complete!"
echo ""
echo "📝 Next steps:"
echo "1. Commit all changes: git add . && git commit -m 'Ready for Render'"
echo "2. Push to GitHub: git push origin main"
echo "3. Go to https://render.com"
echo "4. Follow RENDER_DEPLOYMENT_GUIDE.md"
echo ""
echo "Happy deploying! 🚀"