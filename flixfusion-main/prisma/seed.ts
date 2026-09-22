/* eslint-disable @typescript-eslint/no-require-imports */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const { moviesData } = require('./data/movies')
const { tvSeriesData } = require('./data/series')


const prisma = new PrismaClient();

async function clearDatabase() {
    console.log('Clearing existing data...');
    await prisma.episode.deleteMany();
    await prisma.tvSeries.deleteMany();
    await prisma.movie.deleteMany();
}

async function seedMovies() {
    console.log('Seeding movies...');
    const movies = [];

    for (const movie of moviesData) {
        const createdMovie = await prisma.movie.create({
            data: {
                ...movie,
                isReference: true
            }
        });
        movies.push(createdMovie);
    }

    console.log(`Created ${movies.length} movies`);
    return movies;
}

async function seedTVSeries() {
    console.log('Seeding TV series and episodes...');
    let totalEpisodes = 0;
    const series = [];

    for (const seriesData of tvSeriesData) {
        const { episodes, ...seriesInfo } = seriesData;

        console.log(`Creating TV series: ${seriesInfo.title}`);

        const createdSeries = await prisma.tvSeries.create({
            data: {
                ...seriesInfo,
                isReference: true
            }
        });

        series.push(createdSeries);

        for (const episode of episodes) {
            await prisma.episode.create({
                data: {
                    ...episode,
                    tvSeriesId: createdSeries.id,
                    isReference: true
                }
            });
            totalEpisodes++;
        }

        console.log(`Created ${episodes.length} episodes for ${seriesInfo.title}`);
    }

    return { series, totalEpisodes };
}

async function main() {
    try {
        console.log('Starting database seed...');

        // Clear existing data
        await clearDatabase();

        // Seed movies
        const movies = await seedMovies();

        // Seed TV series and episodes
        const { series, totalEpisodes } = await seedTVSeries();

        // Optional: Generate additional random data
        // await generateRandomData(50);

        console.log('\nSeeding completed successfully!');
        console.log('Summary:');
        console.log(`- Movies created: ${movies.length}`);
        console.log(`- TV Series created: ${series.length}`);
        console.log(`- Total episodes created: ${totalEpisodes}`);

    } catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error('Fatal error during seeding:', error);
        process.exit(1);
    });