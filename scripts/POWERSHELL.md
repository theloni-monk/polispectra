# Bash vs PowerShell Script Comparison

Quick reference for running scripts on different platforms.

## Setup & Initialization

| Task | Bash | PowerShell | Windows (Legacy) |
|------|------|-----------|------------------|
| **Initial Setup** | `bash scripts/setup-local.sh` | `.\scripts\setup-local.ps1` | `scripts\setup-local.bat` |
| Installs dependencies | ✅ | ✅ | ✅ |
| Compiles TypeScript | ✅ | ✅ | ✅ |
| Creates `.env.local` | ✅ | ✅ | ✅ |
| Checks Node.js/npm | ✅ | ✅ | ✅ |

## Development

| Task | Bash | PowerShell |
|------|------|-----------|
| **Start Dev Server** | `bash scripts/dev.sh` | `.\scripts\dev.ps1` |
| Auto-compile TypeScript | ✅ (watch mode) | ✅ (background job) |
| Local HTTP server (port 3000) | ✅ | ✅ |
| Ctrl+C to stop | ✅ | ✅ |
| Show live errors | ✅ | ✅ |

## Testing

| Task | Bash | PowerShell |
|------|------|-----------|
| **Run Test Suite** | `bash scripts/test.sh` | `.\scripts\test.ps1` |
| Build validation | ✅ | ✅ |
| File structure checks | ✅ | ✅ |
| Dependencies verify | ✅ | ✅ |
| Code quality checks | ✅ | ✅ |
| ~24 total tests | ✅ | ✅ |

## API Testing

| Task | Bash | PowerShell |
|------|------|-----------|
| **Test API** | `bash scripts/test-api.sh` | `.\scripts\test-api.ps1` |
| Test POST endpoints | ✅ | ✅ |
| Test GET endpoints | ✅ | ✅ |
| Error handling | ✅ | ✅ |
| Custom API URL | `API_URL=<url>` | `-ApiUrl <url>` |

## Environment Setup

| Requirement | Status |
|-------------|--------|
| Node.js 18+ | Required |
| npm 9+ | Required |
| TypeScript | Installed with `npm install` |
| Python 3 | Only needed for `npm run serve` |
| Git | Optional (for version control) |

## Platform Requirements

### macOS/Linux
- ✅ Bash 4+
- ✅ Use `bash scripts/*.sh`

### Windows 10/11
- ✅ PowerShell 5+
- ✅ Use `.\scripts\*.ps1`
- ⚠️ May need execution policy change (see troubleshooting)
- ✅ Python 3 needed for `npm run serve`
- ✅ Fallback to `scripts\setup-local.bat` if needed

## Quick Command Reference

### Normal Development Workflow

**macOS/Linux**:
```bash
bash scripts/setup-local.sh    # First time only
bash scripts/dev.sh             # Terminal 1
npm test                        # Terminal 2, before commits
```

**Windows (PowerShell)**:
```powershell
.\scripts\setup-local.ps1       # First time only
.\scripts\dev.ps1               # Terminal 1
npm test                        # Terminal 2, before commits
```

---

### Pre-Commit Checklist

**Both platforms**:
```bash
npm run build                   # Check for TypeScript errors
npm test                        # Run full test suite (pass all checks)
```

---

### API Testing After Deployment

**Bash**:
```bash
API_URL=https://your-api.vercel.app bash scripts/test-api.sh
```

**PowerShell**:
```powershell
.\scripts\test-api.ps1 -ApiUrl "https://your-api.vercel.app"
```

---

## Troubleshooting by Platform

### macOS/Linux
- Scripts run natively with bash
- No special configuration needed
- Use `lsof -ti:3000 | xargs kill -9` to free port 3000

### Windows (PowerShell)

#### Issue: "Cannot be loaded because running scripts is disabled"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Issue: Port 3000 in use
```powershell
# Find process
netstat -ano | Select-String ":3000"
# Kill it
Stop-Process -Id <PID> -Force
```

#### Issue: Python not found
- Download from https://www.python.org/
- Add Python to PATH during installation

### Windows (Command Prompt / Legacy)
- Use `scripts\setup-local.bat` instead of PowerShell
- Run `npm` commands directly for dev/test

---

## Migration Guide

### From Bash to PowerShell

**Old**:
```bash
bash scripts/setup-local.sh
bash scripts/dev.sh
bash scripts/test.sh
```

**New**:
```powershell
.\scripts\setup-local.ps1
.\scripts\dev.ps1
.\scripts\test.ps1
```

### Using npm Scripts (Platform-Agnostic)

Works on **all platforms** (recommended):
```bash
npm run setup        # Setup
npm run dev          # Watch TypeScript
npm run serve        # Start dev server
npm test             # Run tests
npm run test:api     # Test API
```

---

## Features by Script

### setup-local.*
✅ Check prerequisites
✅ Install dependencies
✅ Compile TypeScript
✅ Create `.env.local`
✅ Color-coded output

### dev.*
✅ TypeScript watcher
✅ Local HTTP server (port 3000)
✅ Background process handling
✅ Graceful shutdown
✅ Auto-restart on failure

### test.*
✅ Build validation (5 tests)
✅ File structure checks (5 tests)
✅ Dependencies verification (4 tests)
✅ Configuration validation (3 tests)
✅ Code quality checks (2 tests)
✅ Functional verification (6 tests)

### test-api.*
✅ POST endpoint testing
✅ GET endpoint testing
✅ Error handling validation
✅ Custom API URL support
✅ HTTP status verification

---

## File Structure

```
scripts/
├── setup-local.sh          # Bash initialization
├── setup-local.ps1         # PowerShell initialization
├── setup-local.bat         # Windows batch (legacy)
├── dev.sh                  # Bash dev server
├── dev.ps1                 # PowerShell dev server
├── test.sh                 # Bash test suite
├── test.ps1                # PowerShell test suite
├── test-api.sh             # Bash API testing
├── test-api.ps1            # PowerShell API testing
├── README.md               # This file
└── POWERSHELL.md          # PowerShell-specific guide (optional)
```

---

## Performance Comparison

| Operation | Bash | PowerShell | Difference |
|-----------|------|-----------|-----------|
| Setup (install + build) | ~30-45s | ~30-45s | Same |
| TypeScript compile | ~2-5s | ~2-5s | Same |
| Test suite | ~3-5s | ~3-5s | Same |
| Startup overhead | <0.1s | ~0.5s | PS slower to start |

---

## Support Matrix

| Platform | Bash Scripts | PowerShell Scripts | npm Scripts |
|----------|-------------|--------------------|------------|
| macOS | ✅ Full | ⚠️ May work | ✅ Full |
| Linux | ✅ Full | ⚠️ May work | ✅ Full |
| Windows 10/11 | ⚠️ Requires WSL | ✅ Full | ✅ Full |
| Windows (Legacy) | ❌ No | ❌ No | ✅ Limited |

**Recommendation**: Use **npm scripts** for maximum compatibility across all platforms.
