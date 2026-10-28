# FitLedger OS — Commercial Gym Operating System & Zero-Trust Anti-Theft SaaS

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-orange?style=flat)](https://turbo.build/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)]()

**FitLedger OS** is a high-availability, multi-tenant operating system built specifically for commercial fitness chains and gym owners in emerging markets (Nigeria & West Africa). It eliminates cash shrinkage, prevents queue congestion during rush hours, survives power outages (NEPA blackouts), and reconciles daily front-desk shifts with zero paper dependency.

---

## ⚡ Core Platform Capabilities

1. **Anti-Theft Reception Terminal (`/terminal`)**:
   - Sub-2-second scanner gun check-ins with Web Audio synthesizer chimes.
   - 45-second rapid member registration with 1-click test scan and webcam face capture.
   - Pro-shop touch retail POS for drinks and supplements.
   - Blind cash drawer closeout with automatic generator diesel/petty cash deductions.

2. **Rush-Hour Counter QR Stand (`/checkin?gym=<slug>`)**:
   - Dynamic scannable QR code matrix rendered on front-desk tablet stands or printed acrylic posters.
   - Dual-mode rush check-in (phone camera scan vs counter scanner gun).
   - Strict multi-tenant cross-branch isolation enforcing club boundaries.

3. **Owner Business Suite (`/owner`)**:
   - Real-time gross revenue telemetry across Cash, POS card slips, and verified bank transfers.
   - Staff Shift PIN management & immutable tamper-evident audit ledger.
   - At-risk member churn radar with 1-click WhatsApp retention broadcasts.
   - 1-Click Excel / CSV / Paper notebook member importer.

4. **Member Digital Barcode Pass (`/m/[code]`)**:
   - Personal digital barcode pass formatted for smartphone screens.
   - Built-in Paystack 1-click membership renewal.
   - Viral Member-Get-Member referral engine (+days reward system).

5. **Founder Fleet Command & Remote Kill Switch (`/admin`)**:
   - Fleet-wide telemetry and multi-tenant provisioning.
   - Remote license kill switch: 1-click **Lock Out (Suspend)**, **Extend 14-Day Pilot**, and **Mark Paid**.
   - VIP impersonation mode for remote onboarding.

6. **Self-Serve 14-Day Free Pilot Onboarding (`/login`)**:
   - In-app modal provisioning fresh gym workspaces on a 14-day trial in 15 seconds.

---

## 🏗️ Architecture & Tech Stack

* **Framework:** Next.js 16.4.2 (App Router with Turbopack)
* **Language:** TypeScript 5.x
* **Styling:** Tailwind CSS v4 with Lucide Icons
* **Payments:** Paystack Inline (Cards, Bank Transfers, USSD `*737#`)
* **Database:** Supabase Cloud PostgreSQL with LocalStorage / IndexedDB fallback
* **Audio:** Web Audio API Dual Synthesizer (Harmonic Sine & Disharmonic Sawtooth)
* **Barcodes / QR:** `qrcode`, `jsqr` real-time camera decoding

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18.x or 20.x
* npm / pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/fitledger/fitledger-os.git
cd fitledger

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Credentials (Development & Test)

### 1. Platform Founder & Super Admin
* **Portal:** [`/admin`](http://localhost:3000/admin) or [`/login`](http://localhost:3000/login)
* **Email:** `abiodunoludolapo@gmail.com`
* **Password:** `Opeyemiazeez@3007`

### 2. Receptionist Shift PIN
* **Portal:** [`/terminal`](http://localhost:3000/terminal) or [`/login`](http://localhost:3000/login)
* **Shift PIN:** `1234`

### 3. Create a Fresh Gym Workspace
* Open [`/login`](http://localhost:3000/login) $\rightarrow$ Click **"Start 14-Day Free Pilot →"**.

---

## 📂 Key Application Routes

| Route | Role | Description |
| :--- | :--- | :--- |
| `/` | Public | Commercial landing page with interactive ROI calculator and scanner simulator. |
| `/login` | Public | Universal portal for Founder, Gym Owners, Staff PINs, and 14-day trial signup. |
| `/admin` | Founder | Platform fleet command, MRR tracker, remote license kill switch. |
| `/owner` | Gym Owner | Financial telemetry, staff PIN management, audit trails, retail restock. |
| `/terminal` | Front Desk | Counter check-ins, pro-shop retail register, blind shift drawer handover. |
| `/checkin` | Members | Express counter tablet kiosk stand for morning & evening rush hours. |
| `/m/[code]` | Members | Personal digital pass with live calendar heatmap and Paystack renewal. |

---

## 🔒 Security & Data Isolation
* **Multi-Tenant Separation:** All entities strictly resolve to their respective `tenantId`.
* **Zero Client-Side Spoofing:** Tier features and permissions validate through `canAccessFeature()` in `src/lib/entitlements.ts`.
* **PCI-DSS Compliance:** Card PANs and PINs are tokenized directly through Paystack.
* **Audit Immutability:** Overrides and discrepancies are permanently logged in the audit ledger.

---

## 📄 License
Copyright © 2026 FitLedger OS. All rights reserved. Built by Abiodun Oludolapo.
