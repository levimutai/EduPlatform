# GitHub Repository Setup Guide

Your local Git repository is ready! Follow these steps to create the GitHub repository and push your code.

## Step 1: Create Repository on GitHub

1. **Go to GitHub**: Open https://github.com in your browser
2. **Sign in** with your account (username: levi mutai)
3. **Click the "+" icon** in the top right corner
4. **Select "New repository"**

## Step 2: Repository Settings

Fill in the repository details:

- **Repository name**: `EduPlatform` (or `eduplatform`)
- **Description**: `Advanced Learning Management System with AI tutoring, real-time communication, and analytics`
- **Visibility**: 
  - Choose **Public** (if you want to share it)
  - Choose **Private** (if you want to keep it private)
- **DO NOT** initialize with README, .gitignore, or license (we already have these)
- **Click "Create repository"**

## Step 3: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your PowerShell:

### Option A: If your GitHub username is "levimutai" (no space):

```powershell
git remote add origin https://github.com/levimutai/EduPlatform.git
git branch -M main
git push -u origin main
```

### Option B: If your GitHub username has a space or is different:

Replace `levimutai` with your actual GitHub username in the URL above.

**Example**: If your username is `levi-mutai`, use:
```powershell
git remote add origin https://github.com/levi-mutai/EduPlatform.git
git branch -M main
git push -u origin main
```

## Step 4: Authentication

When you run `git push`, GitHub will ask for authentication:

- **Option 1**: Use a Personal Access Token (recommended)
  - Go to: https://github.com/settings/tokens
  - Generate a new token with `repo` permissions
  - Use the token as your password when prompted

- **Option 2**: Use GitHub CLI
  - Install: `winget install GitHub.cli`
  - Run: `gh auth login`
  - Then push again

## Step 5: Verify

After pushing, refresh your GitHub repository page. You should see all your files!

## Quick Reference Commands

```powershell
# Check current status
git status

# View commit history
git log --oneline

# Add new changes
git add .
git commit -m "Your commit message"
git push

# View remote repository
git remote -v
```

## Troubleshooting

### If you get "repository not found":
- Check that the repository name matches exactly
- Verify your GitHub username is correct
- Make sure you have access to the repository

### If you get authentication errors:
- Use a Personal Access Token instead of password
- Or set up SSH keys for easier authentication

### If you need to change the remote URL:
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/EduPlatform.git
```

## Next Steps After Pushing

1. Add a repository description on GitHub
2. Add topics/tags: `education`, `lms`, `nodejs`, `express`, `mongodb`
3. Consider adding a license file
4. Set up GitHub Actions for CI/CD (optional)
5. Add collaborators if working with a team

---

**Your repository is ready to push!** 🚀

