# SHOP CONNECT - Retail Management System

A full-stack ready retail management dashboard featuring POS, Inventory, Finance, and AI Analytics.

## Deployment on Vercel

This application is optimized for deployment on Vercel as a Vite React application.

### 1. Prerequisite
Ensure you have the code pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Import Project
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** > **Project**.
3. Import your repository.

### 3. Configure Project
Vercel should automatically detect the framework as **Vite**.
*   **Build Command:** `npm run build`
*   **Output Directory:** `dist`
*   **Install Command:** `npm install`

### 4. Environment Variables
**Crucial Step:** Before clicking Deploy (or in Settings after deployment), add your API key:
1.  Expand the **Environment Variables** section.
2.  Key: `API_KEY`
3.  Value: `your_google_gemini_api_key`
4.  Click **Add**.

### 5. Deploy
Click **Deploy**. Vercel will build the application and provide you with a live URL.

## Database (Optional Backend)

A SQL schema is provided in `database-sql.md`.
To fully enable backend features (persisting data):
1.  Provision a PostgreSQL database (e.g., via Vercel Storage or Supabase).
2.  Run the scripts in `database-sql.md` to create the tables.
3.  You would need to implement a backend API (Node.js/Next.js) to connect this frontend to the database. Currently, the app runs in **Demo Mode** with local state.

## Local Development

1.  `npm install`
2.  Create a `.env` file and add `API_KEY=your_key_here`.
3.  `npm run dev`
