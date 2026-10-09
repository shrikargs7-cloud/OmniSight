import { getJson } from "serpapi";

const API_KEY = process.env.SERPAPI_API_KEY;

export async function searchGoogleShopping(query: string) {
  if (!API_KEY) throw new Error("SERPAPI_API_KEY is missing");
  try {
    return await getJson({ engine: "google_shopping", q: query, api_key: API_KEY, hl: "en", gl: "us" });
  } catch (error) {
    return null;
  }
}

export async function searchNews(query: string) {
  if (!API_KEY) return null;
  try {
    return await getJson({ engine: "google_news", q: query, api_key: API_KEY, gl: "us" });
  } catch (error) {
    return null;
  }
}

export async function searchYouTube(query: string) {
  if (!API_KEY) return null;
  try {
    return await getJson({ engine: "youtube", search_query: query, api_key: API_KEY });
  } catch (error) {
    return null;
  }
}

export async function searchGoogleTrends(query: string) {
  if (!API_KEY) return null;
  try {
    return await getJson({ 
      engine: "google_trends", 
      q: query, 
      data_type: "TIMESERIES", 
      date: "all",
      api_key: API_KEY 
    });
  } catch (error) {
    return null;
  }
}

// NEW ENGINE: Google Organic for SEO Threat Intelligence
export async function searchGoogleOrganic(query: string) {
  if (!API_KEY) return null;
  try {
    return await getJson({ 
      engine: "google", 
      q: query, 
      api_key: API_KEY 
    });
  } catch (error) {
    return null;
  }
}
