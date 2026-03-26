# Polispectra Test Scripts

Quick reference for running tests and setting up the local development environment.

## Quick Start

### macOS/Linux (Bash)
```bash
# 1. Initial setup (one-time)
bash scripts/setup-local.sh

# 2. Start development server
bash scripts/dev.sh

# 3. Run tests
bash scripts/test.sh

# 4. Test API (after deployment)
bash scripts/test-api.sh
```

### Windows (PowerShell)
```powershell
# 1. Initial setup (one-time)
.\scripts\setup-local.ps1

# 2. Start development server
.\scripts\dev.ps1

# 3. Run tests
.\scripts\test.ps1

# 4. Test API (after deployment)
.\scripts\test-api.ps1
```

## Scripts

### Bash Versions

#### `setup-local.sh`
Initializes the project for local development.
- Checks Node.js/npm installation
- Installs dependencies
- Compiles TypeScript
- Creates `.env.local` config

**Usage**: `bash setup-local.sh`

---

#### `dev.sh`
Runs the development environment with auto-recompilation.
- Starts TypeScript watcher
- Starts local HTTP server (port 3000)

**Usage**: `bash dev.sh`
**Stop**: Press `Ctrl+C`

---

#### `test.sh`
Comprehensive test suite (~24 checks).
- Build validation
- File structure checks
- Dependencies verification
- Code quality checks
- Functional code validation

**Usage**: `bash test.sh`
**Expected output**: "All checks passed!"

---

#### `test-api.sh`
Tests API endpoints (requires API running).
- Tests POST /api/submit
- Tests GET /api/philosophies
- Tests GET /api/spectrum
- Validates error handling

**Usage**:
```bash
# Default (API at http://localhost:3001)
bash test-api.sh

# Custom API URL
API_URL=https://your-api.vercel.app bash test-api.sh
```

---

### PowerShell Versions (Windows)

#### `setup-local.ps1`
Initializes the project for local development (Windows).
- Checks Node.js/npm installation
- Installs dependencies
- Compiles TypeScript
- Creates `.env.local` config

**Usage**: `.\scripts\setup-local.ps1`

---

#### `dev.ps1`
Runs the development environment with auto-recompilation (Windows).
- Starts TypeScript watcher (background job)
- Starts local HTTP server on port 3000 (background job)

**Usage**: `.\scripts\dev.ps1`
**Stop**: Press `Ctrl+C`

---

#### `test.ps1`
Comprehensive test suite (~24 checks) (Windows).
- Build validation
- File structure checks
- Dependencies verification
- Code quality checks
- Functional code validation

**Usage**: `.\scripts\test.ps1`
**Expected output**: "All checks passed!"

---

#### `test-api.ps1`
Tests API endpoints (requires API running) (Windows).
- Tests POST /api/submit
- Tests GET /api/philosophies
- Tests GET /api/spectrum
- Validates error handling

**Usage**:
```powershell
# Default (API at http://localhost:3001)
.\scripts\test-api.ps1

# Custom API URL
.\scripts\test-api.ps1 -ApiUrl "https://your-api.vercel.app"
```

---

### Batch Versions (Windows Legacy)

#### `setup-local.bat`
Legacy batch script (Windows).

**Usage**: Double-click in File Explorer, or:
```cmd
scripts\setup-local.bat
```

---

## Using pnpm Scripts

As an alternative, run from project root using pnpm:

```bash
pnpm run setup      # = bash scripts/setup-local.sh (or .\scripts\setup-local.ps1 on Windows)
pnpm run build      # = tsc (compile TypeScript)
pnpm run dev        # = tsc --watch (watch mode)
pnpm run serve      # = pnpx serve -l 3000 (dev server on port 3000)
pnpm test           # = bash scripts/test.sh (or .\scripts\test.ps1 on Windows)
pnpm run test:api   # = bash scripts/test-api.sh (or .\scripts\test-api.ps1 on Windows)
```

---

## Examples

### First Time Setup (Bash)
```bash
bash scripts/setup-local.sh
# Creates .env.local with template values
```

### First Time Setup (PowerShell)
```powershell
.\scripts\setup-local.ps1
# Creates .env.local with template values
```

---

### Local Development (Bash)
```bash
# Terminal 1
bash scripts/dev.sh
# Starts: TypeScript watcher + HTTP server on :3000

# Terminal 2
# Edit files in src/ -> auto-compiles to src/js/
# Open http://localhost:3000 in browser
# Refresh to see changes
```

### Local Development (PowerShell)
```powershell
# Terminal 1
.\scripts\dev.ps1
# Starts: TypeScript watcher + HTTP server on :3000

# Terminal 2
# Edit files in src/ -> auto-compiles to src/js/
# Open http://localhost:3000 in browser
# Refresh to see changes
```

---

### Before Committing
```bash
# Works on both bash and PowerShell
pnpm run build      # Check for compilation errors
pnpm test           # Run full test suite
```

---

### After API Deployment (Bash)
```bash
API_URL=https://your-domain.vercel.app bash scripts/test-api.sh
```

### After API Deployment (PowerShell)
```powershell
.\scripts\test-api.ps1 -ApiUrl "https://your-domain.vercel.app"
```

---

## Environment Variables

Scripts reference `.env.local` (created by setup scripts):

```env
REDIS_URL=redis://localhost:6379
REDIS_TOKEN=your_token_here
HCAPTCHA_SECRET=your_hcaptcha_secret
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
VITE_API_URL=http://localhost:3001
```

---

## Troubleshooting

### PowerShell Execution Policy

If you get "cannot be loaded because running scripts is disabled", enable script execution:

```powershell
# For current user only
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# For all users (requires admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

---

### "Node not found"

Install from https://nodejs.org/ (LTS recommended)

```bash
# Verify installation
node --version  # Should show v18+
pnpm --version  # Should show v8+
```

---

### "Port 3000 in use"

#### macOS/Linux
```bash
lsof -ti:3000 | xargs kill -9
```

#### Windows (PowerShell)
```powershell
# Find process using port 3000
netstat -ano | Select-String ":3000"

# Kill process by PID
Stop-Process -Id <PID> -Force
```

#### Windows (Command Prompt)
```cmd
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

---

### "TypeScript compilation failed"

Clear and rebuild:

```bash
# Bash
rm -rf src/js/*.js src/js/**/*.js
pnpm run build

# PowerShell
Remove-Item -Recurse src/js/*.js
pnpm run build
```

---

### "dev.ps1 cannot be loaded"

Run PowerShell as Administrator, then:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run the script normally (no admin required after this).

---

### ".env.local not created"

Manually create it:

**Bash**:
```bash
cp .env.example .env.local
# Edit with your values
```

**PowerShell**:
```powershell
Copy-Item .env.example -Destination .env.local
# Edit with your values
```

---

See [TESTING.md](../TESTING.md) for detailed documentation.
