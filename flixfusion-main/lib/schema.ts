import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  director: z.string().min(1, "Director is required"),
  releaseYear: z.coerce
    .number()
    .min(1888, "First movie was made in 1888")
    .max(new Date().getFullYear() + 5, "Release year cannot be too far in the future"),
});

export const tvSeriesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  director: z.string().min(1, "Director is required"),
});

export const episodeSchema = z.object({
  tvSeriesId: z.string().min(1, "TV Series is required"),
  title: z.string().min(1, "Episode title is required"),
  seasonNumber: z.coerce
    .number()
    .min(1, "Season number must be at least 1")
    .max(100, "Season number seems too high"),
  episodeNumber: z.coerce
    .number()
    .min(1, "Episode number must be at least 1")
    .max(100, "Episode number seems too high"),
});

export type MovieFormData = z.infer<typeof movieSchema>;
export type TvSeriesFormData = z.infer<typeof tvSeriesSchema>;
export type EpisodeFormData = z.infer<typeof episodeSchema>;