import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const existingMovie = await prisma.movie.findFirst({
            where: {
                AND: [
                    { title: { equals: body.title, mode: 'insensitive' } },
                    { director: { equals: body.director, mode: 'insensitive' } },
                    { releaseYear: body.releaseYear }
                ]
            }
        });

        if (existingMovie) {
            return NextResponse.json(
                { error: "Movie already exists" },
                { status: 409 }
            );
        }

        const movie = await prisma.movie.create({
            data: {
                title: body.title,
                director: body.director,
                releaseYear: parseInt(body.releaseYear),
            }
        });

        return NextResponse.json(movie);
    } catch (error) {
        console.error("Failed to create movie:", error);
        return NextResponse.json(
            { error: "Failed to create movie" },
            { status: 500 }
        );
    }
}