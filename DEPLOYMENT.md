# SHAI Deployment Guide

## ✅ Current Status

### What's Working (Production-Ready)
- ✅ **AI Code Analysis** - Real AI-powered analysis using Claude/GPT via Rork toolkit
- ✅ **UI/UX** - Complete responsive mobile app with all screens
- ✅ **State Management** - Global store with persistence
- ✅ **Navigation** - Tab navigation with auth protection
- ✅ **Real-time Activity** - Live monitoring simulation
- ✅ **Settings** - Notification preferences and configurations
- ✅ **Subscription Page** - UI ready for Stripe integration

### What's Missing (Requires Backend)
- ❌ **GitHub API Integration** - Currently using mock repository data
- ❌ **Stripe Payment Processing** - UI ready, backend needed
- ❌ **Database** - No persistence for user data, repos, analysis results
- ❌ **Authentication** - Currently mock OAuth, needs real GitHub OAuth
- ❌ **Repository Scanning** - No actual code fetching from GitHub

---

## 🔧 Required Backend Services

### 1. **GitHub API Integration**

#### Purpose
- Fetch user's repositories
- Access repository code files
- Create pull requests for auto-fixes
- Manage webhooks for real-time monitoring

#### Required APIs
```
GET /user/repos - List user repositories
GET /repos/{owner}/{repo}/contents/{path} - Get file contents
POST /repos/{owner}/{repo}/pulls - Create pull request
POST /repos/{owner}/{repo}/hooks - Create webhook
GET /repos/{owner}/{repo}/commits - Get commit history
```

#### Setup Steps
1. Register OAuth app at https://github.com/settings/developers
2. Get `CLIENT_ID` and `CLIENT_SECRET`
3. Set callback URL: `your-app://oauth/callback`
4. Implement OAuth flow:
   - Redirect to: `https://github.com/login/oauth/authorize?client_id={CLIENT_ID}`
   - Handle callback with code
   - Exchange code for access token
5. Store access token securely (AsyncStorage or SecureStore)

#### Environment Variables Needed
```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_CALLBACK_URL=your-app://oauth/callback
```

#### Code Integration Points
- `store/shai-store.tsx` - Replace `handleGitHubAuth()` with real OAuth
- Replace mock repos in line 116-122 with actual GitHub API calls
- Create `services/github-api.ts` for API calls

---

### 2. **Stripe Payment Integration**

#### Purpose
- Process subscription payments
- Manage recurring billing
- Handle plan upgrades/downgrades
- Invoice generation

#### Required Stripe Components
- **Stripe Publishable Key** (frontend)
- **Stripe Secret Key** (backend only)
- **Webhook Secret** (for payment events)

#### Setup Steps
1. Create account at https://stripe.com
2. Get API keys from Dashboard → Developers → API keys
3. Create products and prices in Dashboard → Products
4. Set up webhook endpoint for payment events
5. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/webhook`

#### Products to Create in Stripe
Based on `app/subscription.tsx`:
- Developer: $49/month, $468/year (product_developer)
- Professional: $199/month, $1,908/year (product_professional)
- Business: $799/month, $7,668/year (product_business)
- Enterprise: $2,499/month, $23,988/year (product_enterprise)
- Enterprise Plus: Custom pricing

#### Environment Variables Needed
```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...  # Backend only
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Code Integration Points
- `app/subscription.tsx` line 277-308 - Replace mock payment with Stripe Checkout
- Create `services/stripe.ts` for Stripe SDK integration
- Backend API endpoint: `POST /api/create-checkout-session`
- Backend webhook: `POST /api/stripe-webhook`

#### Example Stripe Integration
```typescript
// services/stripe.ts
import { Stripe } from '@stripe/stripe-react-native';

export async function createCheckoutSession(priceId: string) {
  const response = await fetch('https://your-backend.com/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });
  
  const { sessionId } = await response.json();
  
  const { error } = await Stripe.redirectToCheckout({ sessionId });
  if (error) throw error;
}
```

---

### 3. **Database Requirements**

#### Purpose
- Store user accounts and settings
- Save repository connections
- Persist analysis results
- Track subscription status
- Store notification preferences

#### Recommended: PostgreSQL or MongoDB

#### Required Tables/Collections

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  github_id VARCHAR(255) UNIQUE,
  github_username VARCHAR(255),
  email VARCHAR(255),
  avatar_url TEXT,
  stripe_customer_id VARCHAR(255),
  subscription_tier VARCHAR(50),
  subscription_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**repositories**
```sql
CREATE TABLE repositories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  github_id BIGINT,
  name VARCHAR(255),
  owner VARCHAR(255),
  language VARCHAR(100),
  private BOOLEAN,
  health_score INTEGER,
  last_scanned TIMESTAMP,
  webhook_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**analysis_results**
```sql
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY,
  repository_id UUID REFERENCES repositories(id),
  file_path TEXT,
  line_number INTEGER,
  issue_type VARCHAR(50),
  severity VARCHAR(20),
  issue_title TEXT,
  description TEXT,
  suggestion TEXT,
  fixed_code TEXT,
  auto_fixed BOOLEAN,
  pr_number INTEGER,
  impact TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  message TEXT,
  type VARCHAR(50),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**user_settings**
```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  auto_fix_enabled BOOLEAN DEFAULT TRUE,
  monitoring_enabled BOOLEAN DEFAULT TRUE,
  create_prs_enabled BOOLEAN DEFAULT TRUE,
  notify_security BOOLEAN DEFAULT TRUE,
  notify_autofix BOOLEAN DEFAULT TRUE,
  notify_weekly BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Database Providers
- **Supabase** (PostgreSQL with auth) - https://supabase.com
- **MongoDB Atlas** - https://www.mongodb.com/cloud/atlas
- **PlanetScale** (MySQL) - https://planetscale.com
- **Neon** (PostgreSQL) - https://neon.tech

#### Environment Variables Needed
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

---

### 4. **Backend API Endpoints Needed**

Create these endpoints (Express.js, Next.js API routes, or similar):

#### Authentication
- `POST /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/callback` - Handle OAuth callback
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user

#### Repositories
- `GET /api/repos` - List user repositories from DB
- `POST /api/repos/sync` - Sync with GitHub
- `POST /api/repos/:id/analyze` - Trigger AI analysis
- `GET /api/repos/:id/results` - Get analysis results
- `DELETE /api/repos/:id` - Disconnect repository

#### Analysis
- `POST /api/analyze/code` - Analyze code snippet
- `GET /api/analyze/:id` - Get specific analysis
- `POST /api/analyze/:id/fix` - Apply auto-fix
- `GET /api/analyze/stats` - Get analysis statistics

#### Subscriptions
- `POST /api/stripe/create-checkout` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `GET /api/subscription/status` - Get subscription details
- `POST /api/subscription/cancel` - Cancel subscription
- `POST /api/subscription/upgrade` - Upgrade/downgrade plan

#### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

#### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

---

### 5. **Real-time Monitoring Setup**

#### Purpose
Monitor repository changes in real-time and trigger automatic analysis

#### Options

**Option A: GitHub Webhooks**
```javascript
// Backend webhook handler
app.post('/api/webhooks/github', async (req, res) => {
  const event = req.headers['x-github-event'];
  
  if (event === 'push') {
    const { repository, commits } = req.body;
    // Trigger analysis for changed files
    await analyzeCommits(repository.id, commits);
  }
  
  res.status(200).send('OK');
});
```

**Option B: Polling (every 5 minutes)**
```javascript
// Cron job or setInterval
setInterval(async () => {
  const repos = await getActiveRepositories();
  for (const repo of repos) {
    const latestCommit = await github.getLatestCommit(repo);
    if (isNewCommit(latestCommit)) {
      await analyzeRepository(repo);
    }
  }
}, 5 * 60 * 1000); // 5 minutes
```

**Option C: GitHub Actions**
Create `.github/workflows/shai-analysis.yml` in user repos:
```yaml
name: SHAI Analysis
on: [push, pull_request]
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run SHAI Analysis
        run: |
          curl -X POST https://your-api.com/api/analyze \
            -H "Authorization: Bearer ${{ secrets.SHAI_TOKEN }}" \
            -d '{"repo": "${{ github.repository }}"}'
```

---

### 6. **Environment Variables Summary**

Create `.env` file for backend:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/shai_db

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=https://your-app.com/auth/callback

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI (Rork Toolkit)
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com

# App
NODE_ENV=production
API_URL=https://your-api.com
JWT_SECRET=your_random_secret_key
SESSION_SECRET=your_session_secret

# Optional: Email notifications
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@shai.app

# Optional: Error tracking
SENTRY_DSN=your_sentry_dsn
```

For React Native app (`.env.local`):
```env
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_STRIPE_KEY=pk_live_...
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com
```

---

## 🚀 Deployment Checklist

### Phase 1: Backend Setup (1-2 weeks)
- [ ] Set up database (Supabase/PostgreSQL)
- [ ] Create backend API (Node.js/Express or Next.js)
- [ ] Implement GitHub OAuth
- [ ] Set up Stripe integration
- [ ] Create all API endpoints
- [ ] Deploy backend (Vercel, Railway, Render)

### Phase 2: Integration (1 week)
- [ ] Connect app to real GitHub API
- [ ] Replace mock auth with real OAuth
- [ ] Integrate Stripe payment flow
- [ ] Connect to database
- [ ] Test all features end-to-end

### Phase 3: Production (1 week)
- [ ] Set up error tracking (Sentry)
- [ ] Configure monitoring (Uptime Robot)
- [ ] Set up analytics
- [ ] Test on real devices
- [ ] Submit to App Store/Play Store
- [ ] Launch! 🎉

---

## 📊 Current AI Implementation

The app NOW uses **real AI analysis** via Rork's toolkit:

- ✅ `generateObject()` - Structured code analysis with schema validation
- ✅ `generateText()` - Natural language fix suggestions
- ✅ Claude/GPT models automatically selected

**Location:** `services/code-analysis.ts`

When you click "Analyze" on a repository, it:
1. Takes a code sample
2. Sends it to Claude/GPT via Rork toolkit
3. Gets back structured issues (security, performance, quality)
4. Displays with auto-fix suggestions and code examples

**This is production-ready AI!** Just needs real repository code input instead of the sample.

---

## 💡 Next Steps to Full Production

1. **Quick MVP (No backend needed)**
   - Users manually paste code snippets
   - AI analyzes on-device
   - No user accounts or persistence
   - Use current AI implementation

2. **Full Product (With backend)**
   - Implement all backend services above
   - Real GitHub integration
   - Paid subscriptions via Stripe
   - Multi-repository monitoring
   - Team collaboration features

---

## 🆘 Support

For backend implementation help:
- Backend: Use Express.js, Next.js API routes, or Supabase Edge Functions
- Database: Start with Supabase (includes auth + PostgreSQL)
- Deployment: Vercel (frontend) + Railway/Render (backend)
- AI: Already integrated via Rork toolkit ✅

Current AI cost: Paid by Rork. For production, you may need your own OpenAI/Anthropic API keys for higher volume.
