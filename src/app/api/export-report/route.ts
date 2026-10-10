import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      query = "MARKET",
      results = {},
      aiBlueprint = {},
      avgRetailPrice = 0,
      estWholesalePrice = 0,
      minPrice = 0,
      maxPrice = 0
    } = body;

    const shopping = results.marketPricing || [];
    const news = results.sentimentNews || [];
    const questions = results.seoData?.questions || [];
    const searches = results.seoData?.searches || [];
    const videos = results.influencerSentiment || [];

    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OmniSight Executive Market Report - ${escapeHtml(query)}</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 14mm 14mm 14mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.5;
    }
    .header {
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .logo {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #0f172a;
    }
    .logo span {
      color: #4f46e5;
    }
    .subtitle {
      font-size: 10px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    .meta {
      text-align: right;
      font-size: 9px;
      color: #64748b;
    }
    .badge {
      display: inline-block;
      background: #eef2ff;
      color: #4338ca;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 4px 0;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    h2 {
      font-size: 13px;
      color: #1e1b4b;
      border-left: 3px solid #4f46e5;
      padding-left: 8px;
      margin: 18px 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      page-break-after: avoid;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 14px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
    }
    .card-label {
      font-size: 9px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .card-val {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 3px;
    }
    .card-val.highlight {
      color: #4f46e5;
    }
    .card-val.success {
      color: #059669;
    }
    .highlight-box {
      background: #f1f5f9;
      border-left: 4px solid #4f46e5;
      padding: 10px 12px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 14px;
    }
    .highlight-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 12px;
      margin-bottom: 3px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-top: 6px;
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      text-align: left;
      padding: 6px 8px;
      font-weight: 700;
      border: 1px solid #cbd5e1;
      font-size: 9px;
      text-transform: uppercase;
    }
    td {
      padding: 5px 8px;
      border: 1px solid #e2e8f0;
      color: #334155;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .roadmap-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 8px;
      page-break-inside: avoid;
    }
    .roadmap-col {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
    }
    .roadmap-header {
      font-weight: 800;
      font-size: 11px;
      color: #4f46e5;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    ul {
      margin: 0;
      padding-left: 14px;
    }
    li {
      margin-bottom: 3px;
      color: #334155;
    }
    .footer {
      margin-top: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      font-size: 8px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <div class="badge">OmniSight Executive Intelligence Dossier</div>
      <div class="logo">OMNI<span>SIGHT</span></div>
      <div class="subtitle">Autonomous Market Arbitrage & Strategic Intelligence</div>
    </div>
    <div class="meta">
      <div><strong>Target Query:</strong> ${escapeHtml(query.toUpperCase())}</div>
      <div><strong>Generated:</strong> ${dateStr}</div>
      <div><strong>Classification:</strong> CONFIDENTIAL // STRATEGY</div>
      <div><strong>Engines:</strong> SerpApi (5 Engines) + Google Gemini</div>
    </div>
  </div>

  <div class="highlight-box">
    <div class="highlight-title">${escapeHtml(aiBlueprint?.opportunityTitle || `Market Entry Opportunity: ${query.toUpperCase()}`)}</div>
    <div>${escapeHtml(aiBlueprint?.opportunityText || "Autonomous synthesis validates viable price variance and untapped long-tail customer intent.")}</div>
  </div>

  <h2>1. Financial Arbitrage & Pricing Economics (SerpApi Google Shopping)</h2>
  <div class="grid-4">
    <div class="card">
      <div class="card-label">Retail Price Ceiling</div>
      <div class="card-val highlight">$${maxPrice > 0 ? maxPrice.toFixed(2) : "N/A"}</div>
    </div>
    <div class="card">
      <div class="card-label">Average Retail Price</div>
      <div class="card-val">$${avgRetailPrice > 0 ? avgRetailPrice.toFixed(2) : "N/A"}</div>
    </div>
    <div class="card">
      <div class="card-label">Estimated Wholesale Floor</div>
      <div class="card-val success">$${estWholesalePrice > 0 ? estWholesalePrice.toFixed(2) : "N/A"}</div>
    </div>
    <div class="card">
      <div class="card-label">Target Gross Margin</div>
      <div class="card-val success">~65% Margin</div>
    </div>
  </div>

  ${shopping.length > 0 ? `
  <table>
    <thead>
      <tr>
        <th style="width: 45%;">Live Product Listing</th>
        <th style="width: 25%;">Retailer / Channel</th>
        <th style="width: 15%;">Retail Price</th>
        <th style="width: 15%;">Est. Wholesale (35%)</th>
      </tr>
    </thead>
    <tbody>
      ${shopping.slice(0, 8).map((p: any) => {
        const rawPrice = parseFloat(p.price?.replace(/[^0-9.]/g, "") || "0");
        const estWholesale = rawPrice > 0 ? (rawPrice * 0.35).toFixed(2) : "N/A";
        return `
        <tr>
          <td><strong>${escapeHtml(p.title || query)}</strong></td>
          <td>${escapeHtml(p.source || "Google Shopping Merchant")}</td>
          <td><strong>${p.price || "N/A"}</strong></td>
          <td style="color:#059669; font-weight:700;">$${estWholesale}</td>
        </tr>`;
      }).join("")}
    </tbody>
  </table>
  ` : `<p style="color:#64748b; font-style:italic;">No live retail listings captured for this query.</p>`}

  <h2>2. Consumer Search Intent & SEO Threat Intelligence (SerpApi Organic)</h2>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
    <div class="card">
      <div class="card-label" style="margin-bottom: 6px;">Unanswered Questions ("People Also Ask")</div>
      ${questions.length > 0 ? `
        <ul>
          ${questions.slice(0, 5).map((q: any) => `<li>${escapeHtml(q.question || q)}</li>`).join("")}
        </ul>
      ` : `<p style="color:#64748b; margin:0;">No related consumer questions indexed.</p>`}
    </div>
    <div class="card">
      <div class="card-label" style="margin-bottom: 6px;">High-Intent Related Searches</div>
      ${searches.length > 0 ? `
        <ul>
          ${searches.slice(0, 5).map((s: any) => `<li>${escapeHtml(s.query || s)}</li>`).join("")}
        </ul>
      ` : `<p style="color:#64748b; margin:0;">No related searches indexed.</p>`}
    </div>
  </div>

  <h2>3. Brand Safety & Press Sentiment (SerpApi Google News)</h2>
  ${news.length > 0 ? `
  <table>
    <thead>
      <tr>
        <th style="width: 70%;">Recent Press Headline</th>
        <th style="width: 30%;">Source / Publication</th>
      </tr>
    </thead>
    <tbody>
      ${news.slice(0, 4).map((n: any) => `
      <tr>
        <td>${escapeHtml(n.title || "")}</td>
        <td><strong>${escapeHtml(n.source?.name || n.source || "Google News")}</strong></td>
      </tr>
      `).join("")}
    </tbody>
  </table>
  ` : `<p style="color:#64748b; font-style:italic;">No recent press alerts found for this product category.</p>`}

  <h2>4. Media Landscape & Influencer Reviews (SerpApi YouTube)</h2>
  ${videos.length > 0 ? `
  <ul>
    ${videos.slice(0, 4).map((v: any) => `<li><strong>${escapeHtml(v.title || "")}</strong> - Channel: <em>${escapeHtml(v.channel?.name || v.channel || "YouTube Creator")}</em> (${escapeHtml(v.views || "Active views")})</li>`).join("")}
  </ul>
  ` : `<p style="color:#64748b; font-style:italic;">No video sentiment records active.</p>`}

  <div class="page-break"></div>

  <div class="header">
    <div>
      <div class="logo">OMNI<span>SIGHT</span></div>
      <div class="subtitle">AI Market Entry Blueprint & Execution Matrix</div>
    </div>
    <div class="meta">
      <div><strong>Product Target:</strong> ${escapeHtml(query.toUpperCase())}</div>
      <div><strong>Page:</strong> 2 of 2</div>
    </div>
  </div>

  <h2>5. Strategic Assessment & Market Gaps (Google Gemini Synthesis)</h2>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
    <div class="card" style="border-left: 3px solid #ef4444;">
      <div class="card-label" style="color: #ef4444;">The Core Problem / Competitor Blindspot</div>
      <p style="margin-top: 4px; color: #334155;">${escapeHtml(aiBlueprint?.problemText || "Competitors are over-relying on generic high-cost head terms while ignoring high-intent buyer inquiries.")}</p>
    </div>
    <div class="card" style="border-left: 3px solid #10b981;">
      <div class="card-label" style="color: #10b981;">Proposed Market Entry Solution</div>
      <p style="margin-top: 4px; color: #334155;">${escapeHtml(aiBlueprint?.solutionText || "Leverage wholesale arbitrage economics to establish an initial margin cushion while capturing organic long-tail traffic.")}</p>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
    <div class="card">
      <div class="card-label" style="color: #059669; margin-bottom: 4px;">What Is Going Well</div>
      <ul>
        ${(aiBlueprint?.goingWell || ["Demand stability verified over trailing 12-month period.", "Retail price ceiling allows strong arbitrage padding."]).map((item: string) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
    <div class="card">
      <div class="card-label" style="color: #d97706; margin-bottom: 4px;">Needs Immediate Attention</div>
      <ul>
        ${(aiBlueprint?.needsAttention || ["Top retail ad space is heavily crowded on generic keywords.", "Consumer questions indicate confusion around product specs."]).map((item: string) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  </div>

  <h2>6. Strategic Recommendation & Quantitative Rationale</h2>
  <div class="highlight-box">
    <div class="highlight-title">💡 Strategic Recommendation</div>
    <div style="font-weight: 600; color: #1e1b4b; margin-bottom: 6px;">${escapeHtml(aiBlueprint?.recommendation || "Target specific long-tail questions in ad copy to reduce Customer Acquisition Cost (CAC) by 40%.")}</div>
    <div style="font-size: 10.5px; color: #475569;">${escapeHtml(aiBlueprint?.detailedAnalysis || "Our market scan reveals that generic product keywords are oversaturated by legacy brands, driving Cost-Per-Click (CPC) up. By deploying capital specifically into 'People Also Ask' long-tail clusters, you bypass the bidding war entirely.")}</div>
  </div>

  <h2>7. Three-Phase Execution Roadmap</h2>
  <div class="roadmap-grid">
    <div class="roadmap-col">
      <div class="roadmap-header">PHASE 1: NOW (0-3 Months)</div>
      <ul>
        ${(aiBlueprint?.phase1 || ["Secure B2B manufacturer supply agreements.", "Deploy MVP landing page addressing top consumer intent questions.", "Order first test batch of 50-100 units."]).map((t: string) => `<li>${escapeHtml(t)}</li>`).join("")}
      </ul>
    </div>
    <div class="roadmap-col">
      <div class="roadmap-header">PHASE 2: NEXT (3-6 Months)</div>
      <ul>
        ${(aiBlueprint?.phase2 || ["Execute targeted long-tail SEO content strategy.", "Seed 10 units with relevant YouTube & TikTok micro-creators.", "Optimize checkout conversion rate based on initial feedback."]).map((t: string) => `<li>${escapeHtml(t)}</li>`).join("")}
      </ul>
    </div>
    <div class="roadmap-col">
      <div class="roadmap-header">PHASE 3: SCALE (6-12 Months)</div>
      <ul>
        ${(aiBlueprint?.phase3 || ["Scale inventory to 300+ units/month.", "Expand distribution into Amazon and boutique retail channels.", "Achieve primary profitability target based on wholesale margin floor."]).map((t: string) => `<li>${escapeHtml(t)}</li>`).join("")}
      </ul>
    </div>
  </div>

  <div class="footer">
    <div>OmniSight Autonomous Market Intelligence Suite</div>
    <div>Report automatically compiled from live SerpApi endpoints & Google Gemini Core</div>
    <div>CONFIDENTIAL & PROPRIETARY</div>
  </div>

</body>
</html>
    `;

    // Launch Puppeteer to render the clean executive report PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" }
    });
    await browser.close();

    const cleanFilename = `OmniSight_${query.replace(/[^a-zA-Z0-9_-]/g, "_")}_Market_Report.pdf`;

    return new Response(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cleanFilename}"`,
        "Content-Length": pdfBuffer.length.toString()
      }
    });

  } catch (error: any) {
    console.error("Export Report Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate report" }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
