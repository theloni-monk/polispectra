# Polispectra Test Scripts

Quick reference for running tests and setting up the local development environment.

## Quick Start

```bash
# 1. Initial setup (one-time)
bash setup-local.sh

# 2. Start development server
bash dev.sh

# 3. Run tests
bash test.sh

# 4. Test API (after deployment)
bash test-api.sh
```

## Scripts

### `setup-local.sh`
Initializes the project for local development.
- Checks Node.js/npm installation
- Installs dependencies
- Compiles TypeScript
- Creates `.env.local` config

**Usage**: `bash setup-local.sh`

---

### `dev.sh`
Runs the development environment with auto-recompilation.
- Starts TypeScript watcher
- Starts local HTTP server (port 3000)

**Usage**: `bash dev.sh`
**Stop**: Press `Ctrl+C`

---

### `test.sh`
Comprehensive test suite (~24 checks).
- Build validation
- File structure checks
- Dependencies verification
- Code quality checks
- Functional code validation

**Usage**: `bash test.sh`
**Expected output**: "All checks passed!"

---

### `test-api.sh`
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

### `setup-local.bat` (Windows)
Windows alternative to `setup-local.sh`.

**Usage**: Double-click `setup-local.bat` in File Explorer, or:
```cmd
scripts\setup-local.bat
```

---

## Using npm Scripts

As an alternative, run from project root:

```bash
npm run setup      # = scripts/setup-local.sh
npm run build      # = tsc (compile TypeScript)
npm run dev        # = tsc --watch (watch mode)
npm run serve      # = python -m http.server (dev server)
npm test           # = scripts/test.sh (run tests)
npm run test:api   # = scripts/test-api.sh (test API)
```

---

## Examples

### First Time Setup
```bash
bash scripts/setup-local.sh
# Creates .env.local with template values
```

### Local Development
```bash
# Terminal 1
bash scripts/dev.sh
# Starts: TypeScript watcher + HTTP server on :3000

# Terminal 2
# Edit files in src/ -> auto-compiles to src/js/
# Open http://localhost:3000 in browser
# Refresh to see changes
```

### Before Committing
```bash
npm run build      # Check for compilation errors
bash scripts/test.sh  # Run full test suite
```

### After API Deployment
```bash
API_URL=https://your-domain.vercel.app bash scripts/test-api.sh
```

---

## Environment Variables

Scripts reference `.env.local` (created by setup-local.sh):

```env
REDIS_URL=redis://localhost:6379
REDIS_TOKEN=your_token_here
HCAPTCHA_SECRET=your_hcaptcha_secret
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
VITE_API_URL=http://localhost:3001
```

---

## Troubleshooting

**"Node not found"**: Install from https://nodejs.org/ (LTS)

**"Port 3000 in use"**: Kill the process:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

**"TypeScript compilation failed"**: Clear and rebuild:
```bash
rm -rf src/js/*.js src/js/**/*.js
npm run build
```

---

See [TESTING.md](../TESTING.md) for detailed documentation.
