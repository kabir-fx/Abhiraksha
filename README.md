# अभिरक्षा (Abhiraksha)

**Insurance Intelligence for Indian Hospitals**

Abhiraksha is an AI-powered copilot designed to streamline health insurance claims processing for Indian hospitals. It integrates directly with hospital workflows to digitize policy lookups, analyze discharge summaries, and predict claim admissibility using Google Gemini.

## Key Features

- **🛡️ Instant Policy Lookup**: Retrieve policy details verify coverage instantly.
- **📄 AI Claim Analysis**: Analyze discharge summaries and bills using **Gemini 2.5 Flash** to predict claim verdicts (Accepted/Rejected) with confidence scores.
- **🏥 Unified Dashboard**: Manage insurance, discharge, and billing documents in a single view.
- **⚡ Export Ready**: Generate consolidated JSON exports for TPA filing.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Prisma ORM)
- **AI**: Google Gemini API (`gemini-2.5-flash`)
- **Auth**: NextAuth.js

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/abhiraksha.git
   cd abhiraksha
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment**:
   Create a `.env` file with the following:

   ```env
   DATABASE_URL="postgresql://..."
   GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_key"
   NEXTAUTH_SECRET="your_secret"
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.
