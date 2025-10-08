# BTC Dashboard - Real-Time Bitcoin Stats

A React + Vite project to show **real-time Bitcoin statistics** along with a live TradingView chart.  
Supports **dark/light theme**, price change highlighting, and live chart integration.

---

## ⚡ Prerequisites

- Vite requires **Node.js version 20.19+ or 22.12+** installed on your machine.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/sukritiverma786/tradingview-app.git
cd tradingview-app


2. Install dependencies
npm install


3. Run development server
npm run dev


Application will start on default port 5173.

Open http://localhost:5173
 in your browser.

Live BTC stats and TradingView chart will be visible.



🧩 Dependencies
Production

react (^19.1.1)

react-dom (^19.1.1)

lucide-react (^0.545.0)

Development

vite (^7.1.7)

@vitejs/plugin-react (^5.0.4)

tailwindcss (^4.1.14)

postcss (^8.5.6)

autoprefixer (^10.4.21)

eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh

@types/react, @types/react-dom

gh-pages (^6.3.0) – for deployment



🔧 Scripts
Command	Description
npm run dev	Start development server with live reload
npm run build	Build production-ready code (dist/)
npm run preview	Preview production build locally
npm run predeploy	Build before deploying
npm run deploy	Deploy project to GitHub Pages



🌐 GitHub Pages Deployment

Ensure vite.config.js has the correct base path:

base: '/tradingview-app/'


Build and deploy:

npm run predeploy
npm run deploy


Live site URL:
https://sukritiverma786.github.io/tradingview-app/

⚠ Allow 1–2 minutes for changes to go live after deployment.



🛠 Features

Real-time BTC stats via WebSocket

Price change highlighting (green/up, red/down arrows)

Live TradingView chart integration

Dark/light theme toggle

Responsive UI with Tailwind CSS

Easy deployment to GitHub Pages

📌 Notes

Always run npm install after cloning the repo.

Use npm run dev for local development.

Ensure vite.config.js base path is correct for GitHub Pages deployment.

Use npm run build then npm run deploy for production.



