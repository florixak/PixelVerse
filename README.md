# PixelVerse

<p align="center">
  <img alt="PixelVerse Logo" width="120" src="https://raw.githubusercontent.com/florixak/PixelVerse/refs/heads/main/public/pixelverse-favicon.png">
</p>

<p align="center">
  <strong>A modern community platform for pixel artists</strong><br/>
  Share your creations, connect with fellow artists, and explore the vibrant world of pixel art.
</p>

<p align="center">
  <!-- Replace with your live URL once deployed -->
  <a href="https://pixelverse.vercel.app">Live Demo</a> ·
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-contributing">Contributing</a>
</p>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🎨 Features

- **Showcase Pixel Art** — Upload and display creations with crisp, pixel-perfect rendering.
- **Community Interaction** — Comment on, react to (upvote/downvote), and discuss artworks.
- **Follow System** — Follow other artists and keep up with their work.
- **Topic Organization** — Browse art by topics, and suggest new ones for the community.
- **User Profiles** — Personalized profiles with activity history and stats.
- **Notifications** — Stay updated on replies, reactions, and follows.
- **AI-Assisted Moderation** — Content is screened via OpenAI or Google Gemini (configurable).
- **Admin & Reporting** — Report content and manage it through an admin dashboard.
- **Responsive Design** — Seamless experience across desktop and mobile.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [Next.js 15](https://nextjs.org) (App Router, Turbopack), [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| **CMS / Database** | [Sanity.io](https://www.sanity.io) (headless CMS, GROQ queries) |
| **Authentication** | [Clerk](https://clerk.com) |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query) |
| **AI** | [Vercel AI SDK](https://sdk.vercel.ai) with OpenAI & Google Gemini providers |
| **Styling / UI** | [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), [Radix UI](https://www.radix-ui.com) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) **v18.18+** (v20+ recommended)
- [pnpm](https://pnpm.io/) (the project uses a pnpm lockfile)
- A [Sanity.io](https://www.sanity.io/) project (project ID, dataset, and a write token)
- A [Clerk](https://clerk.com) application (publishable & secret keys)
- An AI provider key — **OpenAI** and/or **Google Gemini** — required for content moderation

> Don't have pnpm? Install it with `npm install -g pnpm`, or use `corepack enable`.

---

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/florixak/PixelVerse.git
   cd PixelVerse
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root (see [Environment Variables](#-environment-variables) below).

4. **Generate Sanity types** (optional, but recommended after schema changes)

   ```bash
   pnpm typegen
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to see the app running.

---

## 🔐 Environment Variables

Create a `.env.local` file with the following variables. **Never commit this file** — it is already covered by `.gitignore`. Consider adding a committed `.env.example` (with empty values) so contributors know what's required.

```env
# AI provider: "openai" or "gemini"
AI_OPTION=openai

# AI keys (provide the one matching AI_OPTION; both is fine)
OPENAI_API_KEY=your_openai_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_TOKEN=your_sanity_write_token

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variable | Required | Description |
| --- | --- | --- |
| `AI_OPTION` | ✅ | Selects the moderation provider: `openai` or `gemini`. |
| `OPENAI_API_KEY` | Conditional | Required when `AI_OPTION=openai`. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Conditional | Required when `AI_OPTION=gemini`. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key (client-side). |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key (server-side). |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Your Sanity project ID. |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Sanity dataset name (e.g. `production`). |
| `NEXT_PUBLIC_SANITY_TOKEN` | ✅ | Sanity token with write access. |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Base URL used for metadata and absolute links. |

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server (Turbopack) at `localhost:3000`. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Run the production build. |
| `pnpm lint` | Run ESLint. |
| `pnpm typegen` | Extract the Sanity schema and generate TypeScript types. |

---

## 📐 Project Structure

```
PixelVerse/
├── actions/      → Server actions (posts, reactions, follows, moderation, admin, …)
├── app/          → Next.js App Router routes, layouts, and pages
├── components/   → Reusable UI components (incl. shadcn/ui)
├── constants/    → Shared constants
├── hooks/        → Custom React hooks
├── lib/          → Utilities and shared logic (incl. AI moderation service)
├── public/       → Static assets
├── sanity/       → Sanity schemas, client, and GROQ queries
└── types/        → Shared TypeScript types
```

---

## 🔄 How It Works

- **Authentication** — User sessions and identity are managed by Clerk.
- **Data storage** — Posts, comments, topics, and user data live in Sanity.io.
- **Content fetching** — GROQ queries (in `sanity/`) retrieve content; client caching is handled by TanStack Query.
- **Rendering** — Server Components and the App Router render content; Server Actions (in `actions/`) handle mutations.
- **Moderation** — Submitted content is screened by the configured AI provider via the Vercel AI SDK.

---

## 🗺️ Roadmap

Planned and in-progress ideas:

- 🏆 **Achievement system** — earn badges for participation and contributions.
- 📸 **Screenshots & demo GIFs** in this README.
- 🧪 **Automated tests** and CI.

Contributions toward these are very welcome — see below.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some amazing feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request.

Please run `pnpm lint` before submitting.

---

## 📄 License

This project is intended to be licensed under the **MIT License**.

> ⚠️ A `LICENSE` file is not yet present in the repository. Add one (e.g. via GitHub's "Add license" flow) so this section is accurate.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org)
- [Sanity.io](https://www.sanity.io)
- [Clerk](https://clerk.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel AI SDK](https://sdk.vercel.ai)

---

> Built with ❤️ for the pixel art community.
