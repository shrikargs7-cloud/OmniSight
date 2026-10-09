import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query, serpData } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        error: "Missing GEMINI_API_KEY." 
      }, { status: 400 });
    }

    // Compress SerpApi data
    const context = `
      Query: ${query}
      Retail Pricing: ${JSON.stringify(serpData?.marketPricing?.slice(0, 4))}
      News Sentiment: ${JSON.stringify(serpData?.sentimentNews?.slice(0, 3).map((n:any)=>n.title))}
      SEO Questions (Consumer Intent): ${JSON.stringify(serpData?.seoData?.questions?.slice(0, 5))}
    `;

    const prompt = `You are OMNISIGHT AI, an elite enterprise market strategist.
    Based on the live web data provided, generate a comprehensive, highly aggressive, data-driven Startup Market Entry Blueprint for a company targeting "${query}".
    
    You MUST return ONLY a raw, valid JSON object (no markdown, no backticks, no codeblocks). The JSON must perfectly match this schema:
    {
      "executiveSummary": {
        "heroSubtitle": "A punchy 1-sentence value proposition.",
        "opportunity": "A 2-sentence paragraph explaining the financial/market opportunity based on the pricing or trends.",
        "problem": "A 2-sentence paragraph explaining the pain point or gap competitors are ignoring.",
        "solutions": ["Solution point 1", "Solution point 2", "Solution point 3"]
      },
      "marketAnalysis": {
        "goingWell": ["Positive point 1", "Positive point 2"],
        "needsAttention": ["Risk or negative point 1", "Risk or negative point 2"],
        "theWhy": ["Consumer behavior insight 1", "Consumer behavior insight 2"],
        "aiRecommendation": "A strong 2-sentence strategic recommendation."
      },
      "roadmap": {
        "now": ["0-3 month action 1", "0-3 month action 2"],
        "next": ["3-6 month action 1", "3-6 month action 2"],
        "later": ["6-12 month action 1", "6-12 month action 2"]
      }
    }

    DATA CONTEXT:
    ${context}
    
    RETURN ONLY JSON:`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const geminiData = await geminiRes.json();
    let text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean up markdown formatting if Gemini included it despite instructions
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedJson = JSON.parse(text);

    return NextResponse.json(parsedJson);

  } catch (error) {
    console.error("Blueprint Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate AI Blueprint." }, { status: 500 });
  }
}
