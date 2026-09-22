/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movieSchema, tvSeriesSchema, episodeSchema } from '@/lib/schema';
import type { MovieFormData, TvSeriesFormData, EpisodeFormData } from '@/lib/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MediaForm = () => {
    const [activeTab, setActiveTab] = useState('movies');
    const [tvSeriesList, setTvSeriesList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const movieForm = useForm<MovieFormData>({
        resolver: zodResolver(movieSchema),
        defaultValues: {
            title: '',
            director: '',
            releaseYear: new Date().getFullYear(),
        },
    });

    const tvSeriesForm = useForm<TvSeriesFormData>({
        resolver: zodResolver(tvSeriesSchema),
        defaultValues: {
            title: '',
            director: '',
        },
    });

    const episodeForm = useForm<EpisodeFormData>({
        resolver: zodResolver(episodeSchema),
        defaultValues: {
            tvSeriesId: '',
            title: '',
            seasonNumber: 1,
            episodeNumber: 1,
        },
    });

    // Load Series list
    useEffect(() => {
        const loadTvSeries = async () => {
            try {
                const response = await fetch('/api/media/series');
                if (response.ok) {
                    const data = await response.json();
                    setTvSeriesList(data);
                }
            } catch (error) {
                console.error('Failed to load TV Series:', error);
                toast({
                    title: "Error",
                    description: "Failed to load TV Series list",
                    variant: "destructive",
                });
            }
        };

        loadTvSeries();
    }, [toast]);

    const onMovieSubmit = async (data: MovieFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/media/movie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.status === 409) {
                movieForm.setError('title', {
                    message: 'This movie already exists in the database'
                });
                return;
            }

            if (!response.ok) throw new Error('Failed to create movie');

            toast({
                title: "Success",
                description: "Movie added successfully",
            });

            movieForm.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add movie",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onTvSeriesSubmit = async (data: TvSeriesFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/media/series', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.status === 409) {
                tvSeriesForm.setError('title', {
                    message: 'This TV series already exists in the database'
                });
                return;
            }

            if (!response.ok) throw new Error('Failed to create TV series');

            toast({
                title: "Success",
                description: "TV Series added successfully",
            });

            tvSeriesForm.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add TV series",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onEpisodeSubmit = async (data: EpisodeFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/media/episodes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.status === 409) {
                episodeForm.setError('episodeNumber', {
                    message: 'This episode already exists for this season'
                });
                return;
            }

            if (!response.ok) throw new Error('Failed to create episode');

            toast({
                title: "Success",
                description: "Episode added successfully",
            });

            episodeForm.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add episode",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add Media Content</CardTitle>
                <CardDescription>Add new movies, TV series, or episodes to the database</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="movies">Movies</TabsTrigger>
                        <TabsTrigger value="tvseries">TV Series</TabsTrigger>
                        <TabsTrigger value="episodes">Episodes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="movies">
                        <Form {...movieForm}>
                            <form onSubmit={movieForm.handleSubmit(onMovieSubmit)} className="space-y-4">
                                <FormField
                                    control={movieForm.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Movie title" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={movieForm.control}
                                    name="director"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Director</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Director name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={movieForm.control}
                                    name="releaseYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Release Year</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="Release year" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding Movie...
                                        </>
                                    ) : (
                                        'Add Movie'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="tvseries">
                        <Form {...tvSeriesForm}>
                            <form onSubmit={tvSeriesForm.handleSubmit(onTvSeriesSubmit)} className="space-y-4">
                                <FormField
                                    control={tvSeriesForm.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="TV Series title" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={tvSeriesForm.control}
                                    name="director"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Director</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Director name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding TV Series...
                                        </>
                                    ) : (
                                        'Add TV Series'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="episodes">
                        <Form {...episodeForm}>
                            <form onSubmit={episodeForm.handleSubmit(onEpisodeSubmit)} className="space-y-4">
                                <FormField
                                    control={episodeForm.control}
                                    name="tvSeriesId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>TV Series</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select TV Series" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {tvSeriesList.length > 0 ? (
                                                            tvSeriesList.map((series: { id: string; title: string }) => (
                                                                <SelectItem key={series.id} value={series.id}>
                                                                    {series.title}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem disabled value={''}>No TV Series found</SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={episodeForm.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Episode Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Episode title" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={episodeForm.control}
                                    name="seasonNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Season Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="Season number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={episodeForm.control}
                                    name="episodeNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Episode Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="Episode number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding Episode...
                                        </>
                                    ) : (
                                        'Add Episode'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default MediaForm;
