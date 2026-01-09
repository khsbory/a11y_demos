
import React, { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { Play, Pause, Star, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const ToggleButtonDemoPage = () => {
    // Section 1: Text Change State
    const [isPlayingText, setIsPlayingText] = useState(false);
    const [isFavoriteText, setIsFavoriteText] = useState(false);

    // Section 2: Aria-Pressed State
    const [isPlayingState, setIsPlayingState] = useState(false);
    const [isFavoriteState, setIsFavoriteState] = useState(false);

    return (
        <div className="container mx-auto p-6 pt-24 space-y-8">
            <PageTitle>Toggle Button Demo</PageTitle>

            <div className="space-y-6">
                <p className="text-lg text-slate-900 font-medium">
                    This demo compares two methods of implementing toggle buttons:
                    changing the accessible name (text) vs. using the <code>aria-pressed</code> state.
                </p>

                {/* Section 1: Text Change Implementation */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">1. Text Change Implementation (Dynamic Label)</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Behavior</CardTitle>
                            <CardDescription className="text-slate-900 font-medium">
                                The accessible name of the button changes based on its state.
                                Screen readers will announce the new action available (e.g., "Pause" when playing).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-wrap gap-8 items-start">
                                {/* Play/Pause Toggle */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-base font-semibold text-slate-900">Media Control</span>
                                    <Button
                                        onClick={() => setIsPlayingText(!isPlayingText)}
                                        variant={isPlayingText ? "secondary" : "default"}
                                        className="w-40 h-10"
                                    >
                                        {isPlayingText ? (
                                            <>
                                                <Pause className="mr-2 h-4 w-4" /> Pause
                                            </>
                                        ) : (
                                            <>
                                                <Play className="mr-2 h-4 w-4" /> Play
                                            </>
                                        )}
                                    </Button>
                                    <span className="text-base font-normal text-transparent select-none">State Placeholder</span>
                                </div>

                                {/* Favorite Toggle */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-base font-semibold text-slate-900">Favorite</span>
                                    <Button
                                        onClick={() => setIsFavoriteText(!isFavoriteText)}
                                        variant="outline"
                                        className="w-60 h-10"
                                    >
                                        {isFavoriteText ? (
                                            <>
                                                <Heart className="mr-2 h-4 w-4 fill-red-500 text-red-500" /> Remove from Favorites
                                            </>
                                        ) : (
                                            <>
                                                <Heart className="mr-2 h-4 w-4" /> Add to Favorites
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Separator className="my-8" />

                {/* Section 2: Aria-Pressed Implementation */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">2. State Change Implementation (aria-pressed)</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Behavior</CardTitle>
                            <CardDescription className="text-slate-900 font-medium">
                                The accessible name remains constant, but the <code>aria-pressed</code> attribute toggles.
                                Screen readers will announce "Toggle button, pressed/not pressed".
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-wrap gap-8 items-start">
                                {/* Play/Pause Toggle */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-base font-semibold text-slate-900">Media Control</span>
                                    <Button
                                        aria-pressed={isPlayingState}
                                        onClick={() => setIsPlayingState(!isPlayingState)}
                                        variant={isPlayingState ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-40 h-10 border",
                                            isPlayingState && "bg-slate-200 border-slate-300"
                                        )}
                                        title="Play/Pause"
                                        aria-label="Play/Pause"
                                    >
                                        {isPlayingState ? (
                                            <Pause className="h-5 w-5" />
                                        ) : (
                                            <Play className="h-5 w-5" />
                                        )}
                                    </Button>
                                    <span className={cn(
                                        "text-base font-bold",
                                        isPlayingState ? "text-blue-700" : "text-slate-900"
                                    )}>
                                        State: {isPlayingState ? 'Playing' : 'Paused'}
                                    </span>
                                </div>

                                {/* Favorite Toggle */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-base font-semibold text-slate-900">Favorite</span>
                                    <Button
                                        aria-pressed={isFavoriteState}
                                        onClick={() => setIsFavoriteState(!isFavoriteState)}
                                        variant="outline"
                                        className={cn(
                                            "gap-2 w-60 h-10 transition-colors",
                                            isFavoriteState && "bg-yellow-50 border-yellow-400 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-900"
                                        )}
                                        aria-label="Favorite"
                                    >
                                        {isFavoriteState ? (
                                            <Star className="h-4 w-4 fill-current" />
                                        ) : (
                                            <Star className="h-4 w-4" />
                                        )}
                                        Favorite
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
};

export default ToggleButtonDemoPage;
