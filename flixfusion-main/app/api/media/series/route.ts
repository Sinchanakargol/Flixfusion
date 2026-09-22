import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const existingSeries = await prisma.tvSeries.findFirst({
            where: {
                AND: [
                    { title: { equals: body.title, mode: 'insensitive' } },
                    { director: { equals: body.director, mode: 'insensitive' } }
                ]
            }
        });

        if (existingSeries) {
            return NextResponse.json(
                { error: "TV Series already exists" },
                { status: 409 }
            );
        }


        const tvSeries = await prisma.tvSeries.create({
            data: {
                title: body.title,
                director: body.director,
                isReference: false
            }
        });

        return NextResponse.json(tvSeries);
    } catch (error) {
        console.error("Failed to create TV series:", error);
        return NextResponse.json(
            { error: "Failed to create TV series" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const series = await prisma.tvSeries.findMany({
            orderBy: {
                title: 'asc',
            },
        });

        return NextResponse.json(series);
    } catch (error) {
        console.error("Failed to fetch TV series:", error);
        return NextResponse.json(
            { error: "Failed to fetch TV series" },
            { status: 500 }
        );
    }
}