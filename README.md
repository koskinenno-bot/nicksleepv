# Nick Sleep Valuation Model

An investment analysis tool inspired by Nick Sleep's Nomad Investment Partnership letters. It features a reverse-DCF valuation calculator and a "Scale Economics Shared" moat analyzer using Google's Gemini AI.

## How to Deploy (Free)

The easiest way to share this with friends is to deploy it using **Vercel** or **Netlify**.

1. **Push to GitHub**:
   - Create a repository on GitHub.
   - Push all these files to it.

2. **Deploy**:
   - Go to [Vercel.com](https://vercel.com) (signup is free).
   - Click **"Add New Project"**.
   - Import your GitHub repository.
   - Click **"Deploy"**.

Vercel will detect that it is a Vite project and build it automatically. You will get a link like `https://your-project.vercel.app` to share.

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## API Key

This app requires a Google Gemini API Key. 
- The app handles this via the UI. 
- When you (or a friend) opens the link, it will ask for an API Key.
- The key is stored in the browser's Local Storage, so it never touches a server.
- Get a free key here: [Google AI Studio](https://aistudio.google.com/app/apikey)
