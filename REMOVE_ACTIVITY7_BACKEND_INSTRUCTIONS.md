# Remove Activity 7/backend from GitHub

I made a local backup and removed the `Activity 7/backend` folder from this workspace. Follow these commands in your local clone of the repo to remove it from GitHub and open a PR.

> IMPORTANT: Run these commands in a safe local clone of your repository (not inside this workspace which is not a git repo).

Commands (PowerShell):

```powershell
# 1. Move to your repo clone
cd C:\path\to\your\Group-4A-Repository-main

# 2. Create a branch for the deletion
git checkout -b remove-activity7-backend

# 3. Remove the folder and commit
git rm -r -- "Activity 7/backend"
git commit -m "chore: remove Activity 7/backend"

# 4. Push branch and open a PR on GitHub
git push -u origin remove-activity7-backend
# Then create a Pull Request on GitHub from remove-activity7-backend into main (or whichever default branch you use).
```

Notes:
- I created a local backup folder in this workspace named `Activity7-backend-backup` (copy of the deleted folder). If you want a single zip file, you can create one locally before deleting in your clone.
- If you want, I can prepare a patch file instead; tell me and I will generate one.
