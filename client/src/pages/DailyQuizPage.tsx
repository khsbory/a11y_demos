import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Gift } from "lucide-react";
import PageTitle from '@/components/PageTitle';

const DailyQuizPage: React.FC = () => {
    useEffect(() => {
        document.title = "Daily Mission Card";
    }, []);

    const handleReplayClick = () => {
        alert("Coming Soon");
    };

    const days = [
        { day: 1, status: 'completed' },
        { day: 2, status: 'completed' },
        { day: 3, status: 'completed' },
        { day: 4, status: 'pending' },
        { day: 5, status: 'pending' },
        { day: 6, status: 'pending' },
        { day: 7, status: 'gift' },
    ];

    return (
        <div className="container mx-auto p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-md space-y-6">
                <PageTitle level={1}>Daily Quiz Mission</PageTitle>

                <Card className="rounded-3xl shadow-sm border-none bg-white">
                    <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Solve Daily Financial Quiz
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                Solve daily and earn points
                            </CardDescription>
                        </div>
                        <span className="text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded-md text-xs whitespace-nowrap ml-2">
                            3/7 Days
                        </span>
                    </CardHeader>

                    <CardContent>
                        <ol className="flex justify-between items-center w-full mb-2" aria-label="Quiz Progress">
                            {days.map((item) => (
                                <li key={item.day} className="flex flex-col items-center gap-2">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${item.status === 'completed'
                                            ? 'bg-blue-500 text-white shadow-blue-200'
                                            : 'bg-gray-100 text-gray-300'
                                            }`}
                                    >
                                        {item.status === 'completed' && <Check className="w-5 h-5" />}
                                        {item.status === 'pending' && <Star className="w-4 h-4 fill-current" />}
                                        {item.status === 'gift' && <Gift className="w-4 h-4" />}
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span
                                            className={`text-[10px] md:text-xs font-bold ${item.status === 'completed' ? 'text-blue-500' : 'text-gray-400'
                                                }`}
                                            aria-description={item.status === 'completed' ? "Completed" : undefined}
                                        >
                                            Day {item.day}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </CardContent>

                    <CardFooter>
                        <Button
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-6 rounded-xl transition-colors shadow-none"
                            onClick={handleReplayClick}
                        >
                            Replay Quiz
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default DailyQuizPage;
