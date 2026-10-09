# 🛡️ OmniSight: Official Hackathon Project Report

**Submission for:** SerpApi India Hackathon 2026  
**Project Name:** OmniSight - Autonomous Enterprise Intelligence  
**Track/Focus:** AI Agents, Market Intelligence, Data Aggregation  

---

## 1. Executive Summary
Modern market research is a fragmented, tedious process. Entrepreneurs, e-commerce dropshippers, and marketing agencies spend countless hours switching between trend analysis tools, keyword planners, retail pricing engines, and news aggregators to validate a single business hypothesis. 

**OmniSight** is an agentic AI command center designed to eliminate this friction entirely. By leveraging the immense concurrent power of **SerpApi** and the generative intelligence of **Google Gemini**, OmniSight transforms a simple keyword input into a comprehensive, multi-phase Startup Blueprint and visual Threat Web in a matter of seconds.

## 2. The Problem Statement
- **Data Fragmentation:** Crucial market signals (Historical trends, retail ceilings, SEO gaps, brand safety) are scattered across the web.
- **Analysis Paralysis:** Raw data is useless without strategic interpretation. 
- **High Barrier to Entry:** Elite enterprise intelligence tools (like Bloomberg Terminals or Enterprise SEO suites) cost tens of thousands of dollars annually, gating indie founders and small agencies out of predictive data.

## 3. The OmniSight Solution
OmniSight is a Next.js 14 Web Application that acts as a single pane of glass for market entry strategy.
Instead of providing the user with raw data tables, OmniSight interprets the data using LLMs and visualizes it using interactive node-graphs (`ReactFlow`) and predictive radar charts (`Recharts`).

**Key Differentiators:**
1. **Agentic Autonomy:** The user does not need to analyze the data. The AI acts as a dedicated Market Strategist, writing out a 12-month execution phase plan based entirely on the live SerpApi metrics.
2. **Beautiful, Dark-Mode SaaS UI:** OmniSight steps away from the "hackathon toy" aesthetic and utilizes a premium, professional interface designed for high-value enterprise users.
3. **Massive Concurrency:** We don't just query Google once. We hit 5 distinct Google ecosystems simultaneously to paint a holistic picture of the market.

## 4. Technical Architecture & Integrations

### Frontend Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (Dark theme with glowing neon accents)
- **Visualizations:** `Recharts` for Market Threat Radars, `ReactFlow` for Interactive SEO consumer intent mapping.
- **Icons:** Lucide React

### Backend Orchestration (SerpApi)
The core engine runs on a custom Node.js `/api/analyze` route. When a user submits a query, OmniSight uses `Promise.all` to concurrently trigger five distinct SerpApi engines:
1. **`google_trends`**: Fetches 10-year historical macro-viability data.
2. **`google_shopping`**: Scrapes high/low pricing arrays to establish retail ceilings and wholesale arbitrage floors.
3. **`google` (Organic)**: Extracts "Related Searches" and "People Also Ask" arrays to discover long-tail gaps.
4. **`google_news`**: Pulls recent headlines for brand safety and sentiment analysis.
5. **`youtube`**: Scrapes video IDs to natively embed high-performing media reviews into the dashboard.

### Generative AI Pipeline (Google Gemini)
Once the SerpApi payload is successfully aggregated, the raw JSON is compressed and passed to a secondary serverless endpoint (`/api/blueprint`). 
- **Prompt Engineering:** We built a hyper-specific mega-prompt instructing Gemini 1.5 Flash to adopt the persona of an elite market strategist.
- **Strict Schema Enforcement:** Instead of returning messy Markdown, the LLM is strictly constrained to output a deeply nested JSON object.
- **Dynamic UI Mapping:** The frontend safely parses this JSON and maps it directly into the UI components—meaning the "Executive Summary", "Market Gap Analysis", and "Roadmap" tabs are written by the AI on the fly. 
- *Fallback Mechanism:* OmniSight implements a robust `try/catch` fallback. If an API key is invalid or rate-limited during judging, the system gracefully catches the error and serves a simulated intelligence payload so the UI never crashes.

## 5. Business Viability & Market Opportunity

**Target Audience:**
- **Dropshippers & E-commerce:** Identifying arbitrage gaps between Alibaba/wholesale floors and Google Shopping ceilings.
- **SaaS Founders:** Validating software niches based on highly-specific "People Also Ask" technical queries.
- **Marketing Agencies:** Pitching clients with instantly generated, data-backed 12-month SEO roadmaps.

**Monetization Strategy:**
- **Freemium Tier:** 3 free searches/month to demonstrate the platform's power.
- **Pro Tier ($99/mo):** Unlimited searches, PDF export capabilities, and deeper historical trend lookbacks.
- **Enterprise Tier:** Custom API access for hedge funds requiring programmatic threat web generation.

## 6. Future Roadmap
1. **Automated Execution:** Post-analysis, OmniSight will feature a "Deploy" button that automatically provisions a Shopify MVP store or a Next.js landing page customized to target the exact SEO gap identified by the AI.
2. **Global Supplier Matching:** Integrating the Alibaba/1688 API to dynamically link the user to wholesale manufacturers for the searched product.
3. **Social Sentiment Layer:** Expanding the SerpApi integration to scrape TikTok and X (Twitter) for viral velocity tracking.

---
*Developed with ❤️ for the SerpApi Hackathon.*
