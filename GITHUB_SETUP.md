# ✅ Create GitHub Repository - Manual Steps

## 🎯 Quick Setup (2 minutes)

### Step 1: Go to GitHub
1. Open: https://github.com/new
2. Make sure you're logged in as **vishwanathmandala2006**

### Step 2: Create Repository
Fill in these details:

| Field | Value |
|-------|-------|
| **Repository name** | `puppybro` |
| **Description** | `Dog Welfare Management System` |
| **Visibility** | **Public** (IMPORTANT) |
| **Initialize this repository with** | **LEAVE EMPTY** (don't check any boxes) |

**IMPORTANT:** Do NOT check:
- ❌ Add a README file
- ❌ Add .gitignore
- ❌ Choose a license

### Step 3: Click "Create repository"

You'll see a page that says:
```
…or push an existing repository from the command line

git remote add origin https://github.com/vishwanathmandala2006/puppybro.git
git branch -M main
git push -u origin main
```

---

## ✅ After Creating Repository

Once the repository is created on GitHub, run this in PowerShell:

```powershell
cd C:\Users\vishw\.cursor

# Set up authentication (for first push)
git config credential.helper store

# Push code
git push -u origin main
```

When prompted for credentials:
- **Username:** vishwanathmandala2006
- **Password:** Your GitHub personal access token (if 2FA enabled) or password

---

## 🔑 If You Have 2FA Enabled

You need a **Personal Access Token** instead of password:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token"
3. Name it: "PuppyBro Deployment"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you can't see it again!)
7. Use this token as password when pushing

---

## ✅ Quick Checklist

- [ ] Created repository at https://github.com/vishwanathmandala2006/puppybro
- [ ] Repository is **PUBLIC**
- [ ] No README/gitignore/license added
- [ ] Copied remote URL from GitHub
- [ ] Added remote origin with correct URL
- [ ] Ready to push!

---

## 🚀 Then Run This Command

```powershell
cd C:\Users\vishw\.cursor
git push -u origin main
```

**Expected output:**
```
Enumerating objects: 11, done.
Counting objects: 100%
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

**After this succeeds, you're ready for Render deployment!** ✅