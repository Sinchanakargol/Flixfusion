import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the series exists
        const tvSeries = await prisma.tvSeries.findUnique({
            where: { id: body.tvSeriesId }
        });

        if (!tvSeries) {
            return NextResponse.json(
                { error: "TV Series not found" },
                { status: 404 }
            );
        }

        const seasonNumber = parseInt(body.seasonNumber);
        const episodeNumber = parseInt(body.episodeNumber);

        // Check if episode already exists
        const existingEpisode = await prisma.episode.findFirst({
            where: {
                seriesId: body.tvSeriesId,
                seasonNumber,
                episodeNumber
            }
        });

        if (existingEpisode) {
            return NextResponse.json(
                { error: "Episode already exists for this season" },
                { status: 409 }
            );
        }

        // Create the new episode
        const newEpisode = await prisma.episode.create({
            data: {
                title: body.title,
                seasonNumber,
                episodeNumber,
                isReference: false,
                seriesId: body.tvSeriesId
            }
        });

        return NextResponse.json(newEpisode);
    } catch (error) {
        console.error("Failed to create episode:", error);
        return NextResponse.json(
            { error: "Failed to create episode" },
            { status: 500 }
        );
    }
}
