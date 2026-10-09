<div align="center">
  <img src="https://img.shields.io/badge/SerpApi_India_Hackathon_2026-Grand_Prize_Contender-8b5cf6?style=for-the-badge" alt="Hackathon Badge"/>
  <br/>
  <h1>🛡️ OMNISIGHT</h1>
  <p><strong>Agentic Enterprise Market Intelligence Platform</strong></p>
</div>

OMNISIGHT is a B2B SaaS platform that transforms raw search data into an interactive, predictive, and agentic market research terminal. Built exclusively for the **SerpApi India Hackathon 2026**.

## 🚀 The Vision
Most market intelligence tools force users to manually scrape Google. OMNISIGHT deploys an autonomous orchestrator that concurrently queries **5 distinct SerpApi engines**, synthesizes the raw JSON, and builds a massive storytelling dashboard in real-time.

Whether you are a hedge fund tracking macro demand, a dropshipper seeking pricing arbitrage, or an SEO agency mapping consumer intent, OMNISIGHT is your command center.

---

## 🧠 5-Engine SerpApi Orchestration
OMNISIGHT maximizes the power of SerpApi by executing `Promise.all()` concurrent scrapes across multiple engines:
1. **Google Trends (`google_trends`):** Pulls 10-year historical data (2004-Present) to plot macro-demand and powers our custom Predictive AI forecast algorithm.
2. **Google Shopping (`google_shopping`):** Scrapes the top global retailers to calculate market floor/ceiling prices and identify wholesale arbitrage opportunities.
3. **Google Organic (`google`):** Extracts "People Also Ask" and "Related Searches" to dynamically generate an interactive React Flow mind-map of consumer intent.
4. **Google News (`google_news`):** Monitors global press releases for brand safety and sentiment analysis.
5. **YouTube (`youtube`):** Pulls the latest high-impact video reviews and dynamically embeds them directly into the dashboard.

---

## 💻 Key Features
*   **Predictive Trend Analysis:** Custom frontend algorithms extrapolate the last 12 months of Google Trends data to project an 18-month "Future Trend" line.
*   **SEO Threat Web:** A fully interactive `ReactFlow` node-graph mapping out consumer search intent. Click any node to reveal mock enterprise metrics (Est. Volume, Keyword Difficulty, CPC).
*   **B2B Wholesale Hub:** Automatically converts consumer retail data into a simulated B2B procurement table with bulk discount projections.
*   **Agentic Chatbot Synthesis:** An integrated AI Sidebar that actively reads the SerpApi JSON payload and writes a natural-language executive summary of the market conditions.

## 🛠️ Tech Stack
*   **Framework:** Next.js 14 (App Router)
*   **Data Aggregation:** SerpApi Node SDK
*   **Visualizations:** Recharts (Area, Bar), React Flow (Node Graphs)
*   **Styling:** Tailwind CSS (Dark Mode / Glassmorphism)
*   **Icons:** Lucide React

---

## ⚙️ Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/omnisight.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env.local` file in the root directory:
   ```env
   SERPAPI_API_KEY=your_serpapi_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
*Built with ❤️ for the SerpApi India Hackathon 2026*
