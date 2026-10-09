import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query, serpData } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        chatSummary: "⚠️ AI Engine Offline: Please add GEMINI_API_KEY or OPENAI_API_KEY to your .env.local file to unlock dynamic agent insights.",
        blueprint: null
      });
    }

    // Compress SerpApi data to fit context window nicely
    const context = `
      Query: ${query}
      Top Retail Prices: ${JSON.stringify(serpData.marketPricing?.slice(0, 3).map((p: any) => ({ source: p.source, price: p.price })))}
      Latest News: ${JSON.stringify(serpData.sentimentNews?.slice(0, 2).map((n: any) => n.title))}
      Unanswered SEO Questions: ${JSON.stringify(serpData.seoData?.questions?.slice(0, 3).map((q: any) => q.question))}
    `;

    const prompt = `You are OMNISIGHT AI, an elite enterprise market analyst agent. 
    Analyze the following live SerpApi data and construct a completely bespoke, data-driven Startup Blueprint and a quick Chat Summary.
    
    DATA CONTEXT:
    ${context}
    
    You MUST return ONLY a valid JSON object matching this exact schema:
    {
      "chatSummary": "A concise, aggressive, 3-sentence market entry recommendation for the sidebar feed.",
      "blueprint": {
        "opportunityTitle": "Catchy 3-5 word title for the market opportunity",
        "opportunityText": "A 2-sentence breakdown of why this is a massive opportunity based on the pricing/SEO data.",
        "problemText": "A 2-sentence explanation of the current market inefficiencies or saturated areas.",
        "solutionText": "A 2-sentence explanation of how a data-driven approach solves this.",
        "goingWell": ["Positive insight 1", "Positive insight 2"],
        "needsAttention": ["Negative/Threat insight 1", "Negative/Threat insight 2"],
        "theWhy": ["Consumer behavior reason 1", "Consumer behavior reason 2"],
        "recommendation": "A 2-sentence highly specific AI recommendation (e.g., target specific keywords, exploit a specific price gap).",
        "phase1": ["Month 0-3 action 1", "Month 0-3 action 2"],
        "phase2": ["Month 3-6 action 1", "Month 3-6 action 2"],
        "phase3": ["Month 6-12 action 1", "Month 6-12 action 2"]
      }
    }`;

    // Prefer Gemini, fallback to OpenAI
    if (process.env.GEMINI_API_KEY) {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const geminiData = await geminiRes.json();
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Empty Gemini response");
      return NextResponse.json(JSON.parse(text));
    } else {
      const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: "json_object" },
          messages: [{ role: 'system', content: prompt }]
        })
      });
      const oaiData = await oaiRes.json();
      const text = oaiData.choices?.[0]?.message?.content;
      if (!text) throw new Error("Empty OpenAI response");
      return NextResponse.json(JSON.parse(text));
    }
  } catch (error) {
    console.error("Agent Error:", error);
    return NextResponse.json({ 
      chatSummary: "Fatal Error: Agent orchestration failed.",
      blueprint: null
    }, { status: 500 });
  }
}
