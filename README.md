<div align="center">
  <img src="https://img.shields.io/badge/SerpApi_India_Hackathon_2026-Grand_Prize_Contender-8b5cf6?style=for-the-badge&logo=google" alt="Hackathon Badge"/>
  <img src="https://img.shields.io/badge/Powered_by-SerpApi-FFCC00?style=for-the-badge&logo=api" alt="SerpApi Badge"/>
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

## 🌩️ The Power of SerpApi: A 5-Engine Orchestration

At the heart of OmniSight is a master orchestrator that pushes **SerpApi** to its absolute concurrent limits. By leveraging `Promise.all`, OmniSight executes a parallel data-harvesting sequence across 5 unique search engines simultaneously. 

Without SerpApi, gathering this scale of real-time data would take hours of complex, fragile scraping. With SerpApi, OmniSight acquires a 360-degree view of any global market in under 2 seconds.

### 1. Google Trends API (`engine: "google_trends"`)
*   **The Goal:** Macro-Market Viability & Forecasting.
*   **How OmniSight Uses It:** We pass `date: "all"` to SerpApi to pull historical trend data spanning back to 2004. OmniSight maps this massive timeline into a fluid `Recharts` visualization, allowing the LLM to analyze the slope of the trend to determine if a market is a fad (e.g., fidget spinners) or a stable, growing industry.

### 2. Google Shopping API (`engine: "google_shopping"`)
*   **The Goal:** Retail Ceilings & Arbitrage Calculation.
*   **How OmniSight Uses It:** We scrape the top 40 live product listings. By mathematically analyzing the retail prices, OmniSight establishes a "Retail Ceiling" and calculates an estimated B2B wholesale "Floor" margin. This instantly tells a dropshipper or hardware startup exactly how much profit buffer they have.

### 3. Google Organic Search API (`engine: "google"`)
*   **The Goal:** SEO Gap Analysis & Consumer Intent Mapping.
*   **How OmniSight Uses It:** We specifically extract the **"Related Searches"** and **"People Also Ask" (PAA)** arrays from the SerpApi JSON payload. OmniSight then dynamically renders these arrays into an interactive `ReactFlow` node-graph. This visual "Threat Web" reveals the exact long-tail questions consumers are asking, allowing marketers to bypass saturated generic keywords and lower their Customer Acquisition Cost (CAC) by targeting niche intent.

### 4. Google News API (`engine: "google_news"`)
*   **The Goal:** Real-Time Brand Safety & PR Sentiment.
*   **How OmniSight Uses It:** Markets shift overnight. OmniSight pulls the latest news headlines and feeds them directly into the "Live Agent Chat" sidebar. If a negative news cycle hits a product category, the agent immediately flags the PR threat to the user in real-time.

### 5. YouTube Search API (`engine: "youtube"`)
*   **The Goal:** Media Monitoring & Influencer Landscape.
*   **How OmniSight Uses It:** We scrape the top-performing organic video results for the target query. OmniSight extracts the video IDs and channel data, natively embedding the actual high-performing YouTube iframes directly into the Media Monitor dashboard for instant qualitative review.

---

## 🤖 The Agentic AI Workflow

OmniSight isn't just a dashboard that spits out raw charts—it's an active orchestration engine that *thinks for itself*.

```mermaid
graph TD
    User([User Prompt: "Electric Scooters"]) --> Orchestrator
    
    subgraph "SerpApi Data Aggregation Layer"
        Orchestrator --> |Promise.all| Trends[Google Trends API]
        Orchestrator --> |Promise.all| Shopping[Google Shopping API]
        Orchestrator --> |Promise.all| Organic[Google Organic Search API]
        Orchestrator --> |Promise.all| News[Google News API]
        Orchestrator --> |Promise.all| Video[YouTube Search API]
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
    UI --> |Dynamic AI Blueprint Tabs| Client
    UI --> |Real-Time AI Chat Feed| Client
```

---

## 💻 Core Platform Features

### 1. Autonomous Startup Blueprint
A beautiful, dynamic report that categorizes AI-generated market data into a sleek Tabbed UI. **Every single word in this section is generated on the fly by Gemini 1.5 Flash based on the live SerpApi data:**
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

*   **E-Commerce & Dropshippers:** Instantly calculate the arbitrage gap between AliExpress wholesale floors and Google Shopping retail ceilings.
*   **Hedge Funds & VC:** Analyze macro-demand stability (via 10-year Google Trends data) before deploying capital into emerging hardware sectors.
*   **SEO & Marketing Agencies:** Bypass generic head-keywords and instantly discover long-tail consumer intent clusters (via People Also Ask) to drastically lower Customer Acquisition Cost (CAC).

---

## 🛠️ Technical Architecture

*   **Framework:** Next.js 14 (App Router, Serverless API Routes)
*   **Data Aggregation:** SerpApi Node SDK (Concurrent `Promise.all` fetching across 5 endpoints)
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
   # Required for market data aggregation across all 5 engines
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
*Architected and developed specifically for the **SerpApi India Hackathon 2026**.*
