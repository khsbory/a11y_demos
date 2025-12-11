import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import PageTitle from "@/components/PageTitle";

const CARDS = [
    {
        id: 1,
        title: "Personal Card",
        description: "Primary payment method",
        balance: "$2,450.00",
        number: "**** **** **** 4242",
        color: "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
    },
    {
        id: 2,
        title: "Corporate Card",
        description: "Business expenses",
        balance: "$12,800.00",
        number: "**** **** **** 8899",
        color: "bg-gradient-to-br from-slate-700 to-slate-900 text-white"
    },
    {
        id: 3,
        title: "Affiliate Card",
        description: "Points and rewards",
        balance: "$540.00",
        number: "**** **** **** 1234",
        color: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
    }
];

const CardNavigationPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liveRegion, setLiveRegion] = useState<"off" | "polite">("off");

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setLiveRegion("polite");
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < CARDS.length - 1) {
            setLiveRegion("polite");
            setCurrentIndex(prev => prev + 1);
        }
    };

    const currentCard = CARDS[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === CARDS.length - 1;

    return (
        <div className="container mx-auto max-w-2xl">
            <PageTitle>Card Navigation</PageTitle>

            <div className="space-y-6">
                <div className="prose dark:prose-invert">
                    <p className="text-slate-600">
                        This demo illustrates a common UX pattern where navigation controls are disabled
                        at the boundaries of a list to prevent invalid actions.
                    </p>
                </div>

                <div
                    className="relative min-h-[300px] flex items-center justify-center py-8"
                    aria-live={liveRegion}
                >
                    <Card key={currentCard.id} className={`w-full max-w-md shadow-lg transition-all duration-300 ${currentCard.color} border-none`}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl mb-1 text-white/90">{currentCard.title}</CardTitle>
                                    <CardDescription className="text-white/70">{currentCard.description}</CardDescription>
                                </div>
                                <CreditCard className="w-8 h-8 opacity-80" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 mt-4">
                            <div className="text-3xl font-bold tracking-tight">
                                {currentCard.balance}
                            </div>
                            <div className="text-lg font-mono opacity-80 tracking-wider">
                                {currentCard.number}
                            </div>
                        </CardContent>
                        <CardFooter className="text-sm opacity-60">
                            Valid thru 12/28
                        </CardFooter>
                    </Card>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isFirst}
                        className="w-32"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    <div className="font-medium text-slate-600">
                        {currentIndex + 1} / {CARDS.length}
                    </div>

                    <Button
                        variant="default" // "Next" is primary action usually, unless it's just nav. Default is fine.
                        onClick={handleNext}
                        disabled={isLast}
                        className="w-32"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                    <p className="font-semibold mb-1">State Logic:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            Current Index: <strong>{currentIndex}</strong>
                        </li>
                        <li>
                            Prev Button: <strong>{isFirst ? 'Disabled (First Item)' : 'Enabled'}</strong>
                        </li>
                        <li>
                            Next Button: <strong>{isLast ? 'Disabled (Last Item)' : 'Enabled'}</strong>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CardNavigationPage;
