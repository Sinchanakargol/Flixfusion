import { NextRequest, NextResponse } from "next/server";
import { getSearchResults } from '@/lib/redis';
import { SEARCH_CONSTANTS } from "@/lib/constant";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("query") || "";
        const type = searchParams.get("type") || "all";

        if (query.length < SEARCH_CONSTANTS.MIN_SEARCH_LENGTH) {
            return NextResponse.json({ movies: [], tvSeries: [], episodes: [] });
        }

        const results = await getSearchResults(query, type);

        const response = NextResponse.json(results);
        response.headers.set(
            'Cache-Control', 
            `max-age=${SEARCH_CONSTANTS.CACHE_TIME}, s-maxage=${SEARCH_CONSTANTS.CACHE_TIME}, stale-while-revalidate=${SEARCH_CONSTANTS.CACHE_TIME * 2}`
        );

        return response;
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: "Failed to perform search" },
            { status: 500 }
        );
    }
}