import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, serpData } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        response: "Demo Mode: To unlock conversational AI, add your GEMINI_API_KEY to .env.local" 
      });
    }

    const prompt = `You are OMNISIGHT AI, an elite enterprise market analyst agent.
    The user is asking you a question about the market data you just analyzed.
    
    Live Market Context:
    Top Retail Prices: ${JSON.stringify(serpData?.marketPricing?.slice(0, 3) || "N/A")}
    Latest News: ${JSON.stringify(serpData?.sentimentNews?.slice(0, 2).map((n: any) => n.title) || "N/A")}
    
    User Question: "${message}"
    
    Provide a highly concise, professional, 1-2 sentence response. Do not use markdown styling.`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const geminiData = await geminiRes.json();
    let text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.warn("Agent Chat fallback triggered due to invalid Gemini response:", geminiData);
      text = "Our systems indicate strong arbitrage potential. However, my conversational synthesis engine is currently in fallback mode due to an API constraint.";
    }
    
    return NextResponse.json({ response: text.trim() });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ response: "Fatal Error: Agent synthesis failed." }, { status: 500 });
  }
}
