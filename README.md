<div align="center">
  <img src="https://img.shields.io/badge/SerpApi_India_Hackathon_2026-Grand_Prize_Contender-8b5cf6?style=for-the-badge" alt="Hackathon Badge"/>
  <br/>
  <h1>🛡️ OMNISIGHT</h1>
  <p><strong>Agentic Enterprise Market Intelligence Platform</strong></p>
</div>

OMNISIGHT is a B2B SaaS platform that transforms raw search data into an interactive, predictive, and agentic market research terminal. Built exclusively for the **SerpApi India Hackathon 2026**.

## 🚀 The Vision
Most market intelligence tools force users to manually scrape Google and read through endless lists of links. OMNISIGHT deploys an autonomous orchestrator that concurrently queries **5 distinct SerpApi engines**, synthesizes the raw JSON, and feeds it into an **LLM Agent** (Gemini/OpenAI) to generate a massive, predictive storytelling dashboard in real-time.

Whether you are a hedge fund tracking macro demand, a dropshipper seeking pricing arbitrage, or an SEO agency mapping consumer intent, OMNISIGHT is your command center.

---

## 🤖 Agentic AI Workflow

OMNISIGHT isn't just a dashboard—it's an active orchestration engine. When a user searches for a product or market, the platform triggers a complex web of API calls, structuring live web data and passing it to an integrated LLM to synthesize aggressive market strategies.

```mermaid
graph TD
    User([User Prompt: "Drone Camera"]) --> Orchestrator
    
    subgraph "SerpApi Data Aggregation Layer"
        Orchestrator --> |Engine 1| Trends[Google Trends API]
        Orchestrator --> |Engine 2| Shopping[Google Shopping API]
        Orchestrator --> |Engine 3| Organic[Google Organic API]
        Orchestrator --> |Engine 4| News[Google News API]
        Orchestrator --> |Engine 5| Video[YouTube API]
    end
    
    Trends --> |JSON Payload| Synthesizer(Data Synthesis Engine)
    Shopping --> |JSON Payload| Synthesizer
    Organic --> |JSON Payload| Synthesizer
    News --> |JSON Payload| Synthesizer
    Video --> |JSON Payload| Synthesizer
    
    subgraph "LLM Intelligence Layer (Gemini / OpenAI)"
        Synthesizer --> |Compresses pricing, news, & SEO data| LLM[LLM API Route /api/agent]
        LLM --> |Extracts Arbitrage & Gaps| Strategy[Agent Synthesis]
    end
    
    Synthesizer --> UI(Frontend Dashboard)
    Strategy --> UI
    
    UI --> |Live Radar & Area Charts| Client
    UI --> |Dynamic Infographic Whitepaper| Client
    UI --> |Real-Time Agent Chat Feed| Client
```

---

## 🧠 5-Engine SerpApi Orchestration
OMNISIGHT maximizes the power of SerpApi by executing `Promise.all()` concurrent scrapes across multiple global engines:
1. **Google Trends (`google_trends`):** Pulls 10-year historical data (2004-Present) to plot macro-demand and powers our custom Predictive AI forecast algorithm.
2. **Google Shopping (`google_shopping`):** Scrapes the top global retailers to calculate market floor/ceiling prices and identify wholesale arbitrage opportunities.
3. **Google Organic (`google`):** Extracts "People Also Ask" and "Related Searches" to dynamically generate an interactive `ReactFlow` mind-map of consumer intent.
4. **Google News (`google_news`):** Monitors global press releases for brand safety and populates the Live Chatbot Feed.
5. **YouTube (`youtube`):** Pulls the latest high-impact video reviews and dynamically embeds the actual iframes directly into the dashboard.

---

## 💻 Key Features
*   **Live LLM Chatbot Feed:** A sidebar AI agent that streams real-time news headlines (from SerpApi News), calculates pricing arbitrage alerts, and uses a connected LLM (Google Gemini / OpenAI) to write strategic recommendations.
*   **Dynamic Startup Blueprint:** A beautiful, whitepaper-style infographic that injects live SerpApi data directly into the text—customizing profit projections, market gaps, and SEO keywords specifically for the user's query.
*   **Predictive Radar Matrices:** Real-time generation of Market Threat Matrices combining Recharts with SerpApi volumes.
*   **SEO Threat Web:** A fully interactive `ReactFlow` node-graph mapping out consumer search intent. Click any node to reveal enterprise metrics.

## 🛠️ Tech Stack
*   **Framework:** Next.js 14 (App Router, API Routes)
*   **Data Aggregation:** SerpApi Node SDK
*   **Artificial Intelligence:** Google Gemini API / OpenAI API (Dynamic routing)
*   **Visualizations:** Recharts (Area, Bar, Radar, Pie), React Flow (Node Graphs)
*   **Styling:** Tailwind CSS (Dark Mode / Glassmorphism)

---

## ⚙️ Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shrikargs7-cloud/OmniSight.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env.local` file in the root directory:
   ```env
   # Required for market data aggregation
   SERPAPI_API_KEY=your_serpapi_api_key_here
   
   # Optional: Add one of these to unlock the Live Agent Synthesis
   GEMINI_API_KEY=your_gemini_api_key_here
   # OR
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
*Built with ❤️ for the SerpApi India Hackathon 2026*
