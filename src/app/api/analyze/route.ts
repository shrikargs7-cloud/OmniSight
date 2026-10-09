import { NextResponse } from "next/server";
import { searchGoogleShopping, searchNews, searchYouTube, searchGoogleTrends, searchGoogleOrganic } from "@/lib/serpapi";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) return NextResponse.json({ error: "Market query required" }, { status: 400 });

    console.log("Orchestrating SaaS OSINT Report for:", query);

    // Fetching 5 distinct engines concurrently!
    const [shoppingData, newsData, trendsData, youtubeData, organicData] = await Promise.all([
      searchGoogleShopping(query),
      searchNews(query),
      searchGoogleTrends(query),
      searchYouTube(query),
      searchGoogleOrganic(query)
    ]);

    // Extract & Sanitize Data
    const shoppingResults = shoppingData?.shopping_results || [];
    const newsResults = newsData?.news_results || [];
    const trendsResults = trendsData?.interest_over_time?.timeline_data || [];
    const videoResults = youtubeData?.video_results || [];
    
    // SEO Data extraction
    const relatedQuestions = organicData?.related_questions || [];
    const relatedSearches = organicData?.related_searches || [];
    const organicRankings = organicData?.organic_results?.slice(0, 5) || [];

    // Package the ultimate SaaS report
    const responseData = {
      query,
      marketPricing: shoppingResults.slice(0, 15),
      sentimentNews: newsResults.slice(0, 8),
      historicalTrends: trendsResults,
      influencerSentiment: videoResults.slice(0, 6),
      seoData: {
        questions: relatedQuestions,
        searches: relatedSearches,
        rankings: organicRankings
      }
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
