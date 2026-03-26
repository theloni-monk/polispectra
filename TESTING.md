# Polispectra Local Testing Guide

This guide explains how to set up and test the Polispectra project locally.

## Quick Start

### 1. Initial Setup (Run Once)
```bash
bash scripts/setup-local.sh
```

This script:
- ✓ Checks Node.js and npm installation
- ✓ Installs dependencies
- ✓ Compiles TypeScript to JavaScript
- ✓ Creates `.env.local` configuration file

### 2. Start Development Server
```bash
bash scripts/dev.sh
```

This runs:
- TypeScript watcher (auto-compiles on file save)
- Local HTTP server on `http://localhost:3000`

Then open your browser and test:
- **Landing page**: http://localhost:3000
- Answer the initial question to proceed
- Take the spectral survey (answer ≥3 questions)
- View the visualization page

### 3. Run Test Suite
```bash
bash scripts/test.sh
```

Comprehensive checks:
- ✓ TypeScript compilation
- ✓ File structure validation
- ✓ Dependencies installation
- ✓ Configuration files
- ✓ Code quality checks
- ✓ Functional code verification

## Individual Scripts

### `setup-local.sh`
**Purpose**: One-time project initialization

**Steps**:
1. Checks for Node.js and npm
2. Runs `npm install`
3. Runs `npm run build`
4. Creates `.env.local` with template configuration

**When to use**: First time setup, or after major dependency changes

---

### `dev.sh`
**Purpose**: Run the development environment

**Starts**:
- TypeScript file watcher (`npm run dev`)
- Local HTTP server on port 3000 (`npm run serve`)

**Workflow**:
1. Run this script
2. Open http://localhost:3000
3. Make changes to `.ts` files
4. Browser auto-refreshes to see changes

**Stop**: Press `Ctrl+C`

---

### `test.sh`
**Purpose**: Validate project setup and code structure

**Checks** (4 categories, ~20 tests):
- Build output exists
- File structure is correct
- Dependencies installed
- Code quality metrics

**Use for**: Verifying setup after changes or before commits

---

### `test-api.sh`
**Purpose**: Test API endpoints (requires API running)

**Requirements**:
- API deployed to Vercel, OR
- Local serverless emulator running

**Tests**:
- ✓ POST `/api/submit` - Submit philosophy
- ✓ GET `/api/philosophies` - Fetch recent submissions
- ✓ GET `/api/spectrum` - Get spectrum statistics
- ✓ Error handling (invalid data, unsupported methods)

**Usage**:
```bash
# Test default API (must be Vercel deployed)
bash scripts/test-api.sh

# Test local API (if running on different port)
API_URL=http://localhost:3001 bash scripts/test-api.sh
```

---

## Manual Testing Workflow

### 1. Test Frontend Flow
```bash
bash scripts/dev.sh
# In browser: http://localhost:3000
```

**User Journey**:
1. Click "Yes, I am" or "No, the world is"
2. Answer at least 3 pairwise comparison questions
3. Enter a philosophy title
4. Submit and view spectrum visualization
5. Verify heatmap shows comparisons
6. Verify dominance rankings display

**Check**:
- LocalStorage persistence (reload page, answers saved)
- Question navigation (use sidebar to jump questions)
- Slider interaction (drag/click to change preference)
- Responsive design (mobile/tablet view)

### 2. Test TypeScript Compilation
```bash
bash scripts/dev.sh
# Make a change to src/js/utils.ts
# Verify it compiles to src/js/utils.js
```

### 3. Run Full Test Suite
```bash
bash scripts/test.sh
```

Expected output:
```
🧪 Polispectra Full Test Suite
==================================
Build Tests
---
Testing TypeScript compilation... ✓
...
==================================
Passed: 24
Failed: 0

✓ All checks passed!
```

### 4. Test API Integration
After deploying to Vercel:
```bash
API_URL=https://your-vercel-domain.vercel.app bash scripts/test-api.sh
```

---

## Configuration

### `.env.local` (Created by setup-local.sh)
```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_TOKEN=your_token_here

# hCaptcha Configuration (Optional)
HCAPTCHA_SECRET=your_hcaptcha_secret

# reCAPTCHA v3 Configuration (Optional)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret

# Frontend API Base URL
VITE_API_URL=http://localhost:3001
```

**For local frontend testing**: No Redis/captcha keys needed (uses dummy backend)

**For API testing**: Update with real Redis credentials from Upstash

---

## Troubleshooting

### "npm: command not found"
```bash
# Install Node.js from https://nodejs.org/ (LTS recommended)
node --version  # Should show v18+
npm --version   # Should show v9+
```

### TypeScript compilation fails
```bash
# Clear cache and rebuild
rm -rf src/js/*.js src/js/**/*.js
npm run build
```

### Port 3000 already in use
```bash
# Kill process using port 3000
# On Windows: taskkill /PID <pid> /F
# On macOS/Linux: kill -9 $(lsof -t -i:3000)
```

### API endpoint returns 500
- Verify Redis connection (if testing API)
- Check environment variables in `.env.local`
- Review API logs for detailed errors

### Changes not reflecting in browser
```bash
# Full page reload (not just refresh)
# In browser console: ctrl+shift+r (Windows) or cmd+shift+r (Mac)
```

---

## Development Workflow

**Recommended setup**:
```
Terminal 1: bash scripts/dev.sh
Terminal 2: Code editor
Terminal 3: bash scripts/test.sh (run periodically)
```

**Before committing**:
```bash
npm run build           # Check for compilation errors
bash scripts/test.sh    # Verify all checks pass
git status              # Review changes
git commit              # Create commit
```

---

## File Structure Reference

```
src/
  ├── index.html                          # Entry point
  ├── styles/
  │   ├── global.css                      # Base styles
  │   ├── landing.css                     # Landing page styles
  │   ├── spectral.css                    # Spectral page styles
  │   └── visualization.css               # Visualization page styles
  └── js/
      ├── app.ts                          # Router & app initialization
      ├── utils.ts                        # Scales, questions, localStorage
      ├── visualization-utils.ts          # Graph algorithms, dominance
      └── pages/
          ├── landing.ts                  # Landing page component
          ├── spectral.ts                 # Spectral survey component
          └── visualization.ts            # Visualization component
api/
  ├── lib.ts                              # Redis, validation, helpers
  ├── captcha.ts                          # hCaptcha & reCAPTCHA verification
  ├── submit.ts                           # POST /api/submit
  ├── philosophies.ts                     # GET /api/philosophies
  └── spectrum.ts                         # GET /api/spectrum
```

---

## Next Steps

1. **Local Testing**: Run `bash scripts/dev.sh` and test the frontend
2. **Build Verification**: Run `bash scripts/test.sh` to validate setup
3. **Deploy to Vercel**: Follow [Vercel deployment guide](https://vercel.com/docs)
4. **Set up Upstash Redis**: Get credentials and update environment variables
5. **Test API**: Run `bash scripts/test-api.sh` after deployment

---

## Support

For issues or questions:
1. Run `bash scripts/test.sh` to validate setup
2. Check `.env.local` configuration
3. Review browser console for errors
4. Check API response in Network tab (dev tools)
