# PixelVerse

<!--<img alt="PixelVerse Logo" src="https://place-hold.it/800x200/181820/39D353/bold&fontsize=40&text=PixelVerse">-->
<img alt="PixelVerse Logo" src="https://raw.githubusercontent.com/florixak/PixelVerse/refs/heads/main/public/pixelverse-favicon.png">

**PixelVerse** is a modern community platform for pixel artists to share creations, connect with fellow artists, and explore the vibrant world of pixel art.

---

## 🎨 Features

- **Showcase Pixel Art**: Upload and display your pixel art creations with proper rendering.
- **Community Interaction**: Comment, upvote, and discuss artworks.
- **Topic Organization**: Browse art by topics or tags.
- **User Profiles**: Personalized profiles with activity history and stats.
- **Responsive Design**: Seamless experience across desktop and mobile.
- **Achievement System**: Earn badges based on participation and artistic contributions.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Sanity.io (Headless CMS)
- **Authentication**: [Clerk](https://clerk.dev)
- **Image Handling**: Next.js Image optimization
- **Styling**: Tailwind CSS, Shadcn UI components
- **Deployment**: Vercel

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm or yarn
- [Sanity.io](https://www.sanity.io/) account
- [Clerk](https://clerk.dev) account for authentication

---

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/florixak/PixelVerse.git
   cd pixelverse
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**

   Create a `.env.local` file with the required environment variables:

   ```env
   # Example:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_TOKEN=your_sanity_token
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see your app running.

---

## 📐 Project Structure

```
/components       → Reusable UI components
/pages            → Route definitions
/sanity           → Sanity schemas and queries
/styles           → Tailwind and global styles
/utils            → Utility functions
```

---

## 🔄 Data Flow

- **Authentication**: Managed via Clerk
- **Data Storage**: Posts, comments, and user info stored in Sanity.io
- **Content Fetching**: GROQ queries retrieve content from Sanity
- **Rendering**: Done via Next.js and React components
- **User Interactions**: Processed through server actions

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.

---

## 📸 Screenshots

_Coming soon!_

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org)
- [Sanity.io](https://www.sanity.io)
- [Clerk](https://clerk.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)

> Built with ❤️ for the pixel art community.
