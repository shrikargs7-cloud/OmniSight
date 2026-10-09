<div align="center">
  <img src="https://img.shields.io/badge/SerpApi_India_Hackathon_2026-Grand_Prize_Contender-8b5cf6?style=for-the-badge&logo=google" alt="Hackathon Badge"/>
  <img src="https://img.shields.io/badge/Powered_by-Google_Gemini-4285F4?style=for-the-badge&logo=google" alt="Gemini Badge"/>
  <img src="https://img.shields.io/badge/Next.js_14-App_Router-000000?style=for-the-badge&logo=next.js" alt="Next.js Badge"/>
  <br/><br/>
  <h1>🛡️ OMNISIGHT</h1>
  <p><strong>The First Autonomous, Agentic Enterprise Market Intelligence Platform</strong></p>
  <p><i>Transforming raw search data into predictive startup blueprints in milliseconds.</i></p>
</div>

---

## 🚀 Executive Vision

The era of manual market research is dead. Modern dropshippers, SaaS founders, and hedge funds spend weeks scraping Google, analyzing trends, and calculating wholesale margins. 

**OMNISIGHT** completely automates this. Built exclusively for the **SerpApi India Hackathon 2026**, OMNISIGHT is a B2B SaaS command center that deploys an autonomous orchestrator to concurrently query **5 distinct SerpApi engines**, synthesizes the raw JSON, and feeds it into an **LLM Agent** (Google Gemini) to generate a massive, predictive storytelling dashboard in real-time.

---

## 🤖 The Agentic AI Workflow

OMNISIGHT isn't just a dashboard—it's an active orchestration engine. It acts as an autonomous market analyst that thinks for itself.

```mermaid
graph TD
    User([User Prompt: "Electric Scooters"]) --> Orchestrator
    
    subgraph "SerpApi Data Aggregation Layer"
        Orchestrator --> |Promise.all| Trends[Google Trends API]
        Orchestrator --> |Promise.all| Shopping[Google Shopping API]
        Orchestrator --> |Promise.all| Organic[Google Organic API]
        Orchestrator --> |Promise.all| News[Google News API]
        Orchestrator --> |Promise.all| Video[YouTube API]
    end
    
    Trends --> |Raw JSON| Synthesizer(Next.js Synthesis Engine)
    Shopping --> |Raw JSON| Synthesizer
    Organic --> |Raw JSON| Synthesizer
    News --> |Raw JSON| Synthesizer
    Video --> |Raw JSON| Synthesizer
    
    subgraph "Generative Intelligence Layer (Google Gemini)"
        Synthesizer --> |Compresses Context: Prices, News, SEO| LLM[LLM API Route /api/blueprint]
        LLM --> |Enforces strict JSON schema generation| Strategy[Autonomous Strategy Generation]
    end
    
    Synthesizer --> UI(Frontend Dashboards)
    Strategy --> UI
    
    UI --> |Live Market Radar & Threat Web| Client
    UI --> |Dynamic Blueprint Tabs| Client
    UI --> |Real-Time AI Chat Feed| Client
```

---

## 🧠 5-Engine SerpApi Orchestration

OMNISIGHT pushes SerpApi to its absolute limit by executing parallel fetches across multiple global search engines to build a 360-degree view of any market:

1. **Google Trends (`google_trends`):** 
   - *Purpose:* Pulls 10-year historical data (2004-Present).
   - *Execution:* Feeds into our custom Predictive AI forecast algorithm to extrapolate an 18-month "Future Trend" trajectory.
2. **Google Shopping (`google_shopping`):** 
   - *Purpose:* Analyzes the retail landscape.
   - *Execution:* Scrapes top global retailers to calculate the market ceiling, establishing a wholesale arbitrage "floor" for instant B2B margin calculations.
3. **Google Organic (`google`):** 
   - *Purpose:* Uncovers consumer intent and SEO gaps.
   - *Execution:* Extracts "People Also Ask" and "Related Searches" to dynamically generate an interactive `ReactFlow` node-graph mind-map.
4. **Google News (`google_news`):** 
   - *Purpose:* Monitors brand safety and global press.
   - *Execution:* Populates the Live Chatbot Feed with real-time PR updates.
5. **YouTube (`youtube`):** 
   - *Purpose:* Media monitoring and sentiment.
   - *Execution:* Pulls the latest high-impact video reviews and dynamically embeds the actual iframes directly into the dashboard.

---

## 💻 Core Platform Features

### 1. Autonomous Startup Blueprint
A beautiful, dynamic report that categorizes AI-generated market data into a sleek Tabbed UI:
- **Executive Summary:** Identifies the core financial opportunity and the exact pain point competitors are ignoring.
- **Market Gap Analysis:** Breaks down what is going well, what needs attention, and uncovers the "Why?" behind consumer behavior based on live SEO questions.
- **Visual Roadmap:** A 3-phase (Now, Next, Later) execution plan injected with calculated profit projections.

### 2. The Interactive SEO Threat Web
A fully interactive `ReactFlow` node-graph mapping out consumer search intent. Click any node in the web to instantly reveal simulated enterprise metrics (Est. Volume, Keyword Difficulty, CPC). 

### 3. Live LLM Chatbot Feed
A sidebar AI agent that streams real-time news headlines (from SerpApi News), calculates pricing arbitrage alerts, and uses a connected LLM to synthesize market movements into a live terminal feed.

### 4. Predictive Radar Matrices
Real-time generation of Market Threat Matrices combining `Recharts` visualizations with live SerpApi search volumes.

---

## 🏢 Business Use Cases

*   **E-Commerce & Dropshippers:** Instantly calculate the arbitrage gap between AliExpress wholesale floors and Walmart/Amazon retail ceilings.
*   **Hedge Funds & VC:** Analyze macro-demand stability (via 10-year Trends data) before deploying capital into emerging hardware sectors.
*   **SEO & Marketing Agencies:** Bypass generic head-keywords and instantly discover long-tail consumer intent clusters to lower Customer Acquisition Cost (CAC).

---

## 🛠️ Technical Architecture

*   **Framework:** Next.js 14 (App Router, Serverless API Routes)
*   **Data Aggregation:** SerpApi Node SDK (Concurrent `Promise.all` fetching)
*   **Artificial Intelligence:** Google Gemini API (Strict JSON schema enforcement)
*   **Visualizations:** Recharts (Area, Bar, Radar, Pie), React Flow (Node Graphs)
*   **Styling & UI:** Tailwind CSS (Dark Mode / Glassmorphism), Lucide React Icons
*   **State Management:** React Hooks (`useState`, `useEffect`)

---

## ⚙️ Local Installation & Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shrikargs7-cloud/OmniSight.git
   cd OmniSight
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:** 
   Create a `.env.local` file in the root directory:
   ```env
   # Required for market data aggregation
   SERPAPI_API_KEY=your_serpapi_api_key_here
   
   # Required to unlock the Live Agent Synthesis & Dynamic Blueprints
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Access the terminal:** Open [http://localhost:3000](http://localhost:3000)

---
*Architected and developed for the **SerpApi India Hackathon 2026**.*
