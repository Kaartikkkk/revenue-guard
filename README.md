# 🛡️ RevenueGuard AI — Intelligent Payment Recovery Agent

> **Razorpay AI Buildathon 2026 • Track 3: AI Revenue Recovery**

An AI-powered revenue recovery agent that autonomously detects failed payments, diagnoses failure reasons using Google Gemini, orchestrates smart retry strategies, and sends personalized recovery communications — all with **full audit trails**, **human-gating safety controls**, and **graceful failure handling**.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Razorpay Test Mode API Keys ([Get here](https://dashboard.razorpay.com/app/keys))
- Google Gemini API Key ([Get here](https://aistudio.google.com/apikey))

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# 3. Start the development server
npm run dev

# 4. Open the dashboard
open http://localhost:3000
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RAZORPAY_KEY_ID` | Razorpay test mode key ID (`rzp_test_...`) | ✅ |
| `RAZORPAY_KEY_SECRET` | Razorpay test mode key secret | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature secret | Optional |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `NEXT_PUBLIC_APP_URL` | App URL (default: `http://localhost:3000`) | Optional |

---

## 🏗️ Architecture

```
Failed Payment → Webhook/Simulation
       ↓
  AI Failure Diagnostor (Gemini + Rule-based fallback)
       ↓
  Strategy Engine (selects optimal recovery action)
       ↓
  ┌─────────────────────────────────────┐
  │ Immediate Retry │ Delayed Retry     │
  │ Payment Link    │ Notification      │
  │ Escalate (Human Gate)               │
  └─────────────────────────────────────┘
       ↓
  Full Audit Trail (every decision logged)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | SQLite (better-sqlite3) |
| AI | Google Gemini API |
| Payments | Razorpay Node.js SDK (test mode) |

---

## 🎮 Demo: Simulation Lab

Navigate to `/simulate` to test the agent with 8 pre-built failure scenarios:

| Scenario | What It Tests |
|----------|--------------|
| 🌐 Network Timeout | Immediate retry with exponential backoff |
| 💳 Card Declined | Payment link generation with alternative methods |
| 💸 Insufficient Funds | Delayed retry strategy |
| 🔒 Expired Card | New payment link creation |
| 🛡️ High-Value Transaction | Human-gate approval flow |
| 📊 Budget Cap Test | Spending limit enforcement |
| 🔐 Auth Failed | Customer notification nudge |
| 🏦 Bank Server Down | Delayed retry with diagnosis |

---

## 🔒 Safety & Control (Judging Criteria)

### Human-Gating
- All transactions above ₹5,000 require **explicit merchant approval**
- Approval/rejection actions are logged in the audit trail
- Configurable threshold via Settings page

### Budget Controls
- Daily, weekly, and monthly budget caps
- Hard-stop when budget is exhausted — no recovery actions taken
- Visual budget meter on the dashboard

### Bounded Actions
- Maximum 3 retry attempts per payment (configurable)
- Cooldown period between retries (default: 1 hour)
- Auto-recovery can be disabled entirely

---

## 📋 Audit Trail (Judging Criteria)

Every agent action is logged with:
- **What** happened (action type)
- **Why** (AI reasoning with confidence scores)
- **When** (timestamp)
- **Details** (full context of the decision)

Navigate to `/audit` to see the complete timeline.

---

## 💥 Failure Handling (Judging Criteria)

| Failure Mode | Recovery |
|-------------|----------|
| Razorpay API timeout | Exponential backoff (1s → 2s → 4s), max 3 retries |
| Invalid webhook payload | Signature verification → reject with 400 |
| Budget cap exceeded | Hard stop + merchant notification |
| Gemini API unavailable | Automatic fallback to rule-based diagnosis |
| Duplicate webhook | Idempotency check on payment_id |
| Rate limit exceeded | Queue with delay |

---

## 🧠 AI Judgment (Judging Criteria)

### Uses AI For:
- ✅ Failure diagnosis (pattern recognition across error types)
- ✅ Optimal retry timing (learning from payment patterns)
- ✅ Personalized recovery messages (tone and content)

### Does NOT Use AI For:
- ❌ Payment amount calculations (deterministic)
- ❌ Security decisions (rule-based)
- ❌ Budget cap enforcement (hard-coded limits)

### Graceful Degradation:
When Gemini is unavailable, the system seamlessly falls back to:
- Rule-based error code mapping for diagnosis
- Template-based messages for recovery communications
- This fallback is logged in the audit trail

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Dashboard
│   ├── recovery/page.tsx         # Recovery management
│   ├── audit/page.tsx            # Audit trail
│   ├── simulate/page.tsx         # Simulation lab
│   ├── settings/page.tsx         # Agent configuration
│   └── api/                      # API routes
│       ├── webhooks/razorpay/    # Webhook handler
│       ├── recovery/             # Recovery CRUD + approval
│       ├── audit/                # Audit logs
│       ├── dashboard/stats/      # Dashboard data
│       ├── settings/             # Config management
│       └── simulate/             # Simulation engine
├── components/                   # UI components
│   ├── Sidebar.tsx
│   ├── StatsCard.tsx
│   └── StatusBadge.tsx
└── lib/                          # Core logic
    ├── agent/                    # AI Agent
    │   ├── recovery-agent.ts     # Main orchestrator
    │   ├── failure-diagnostor.ts # Gemini-powered diagnosis
    │   ├── strategy-engine.ts    # Recovery strategy selection
    │   └── message-generator.ts  # Recovery message creation
    ├── razorpay/                 # Razorpay integration
    │   ├── client.ts             # SDK wrapper with retry
    │   └── webhooks.ts           # Signature verification
    ├── db/
    │   └── database.ts           # SQLite data layer
    ├── config.ts                 # Environment config
    └── types.ts                  # TypeScript types
```

---

## 📄 License

MIT — Built for Razorpay AI Buildathon 2026
