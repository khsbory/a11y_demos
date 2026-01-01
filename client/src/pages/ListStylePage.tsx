import React from 'react';
import PageTitle from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ListStylePage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-4xl entrance-animation">
            <div className="mb-8">
                <PageTitle level={1}>Basic Text & List Styles</PageTitle>
                <p className="mt-4 text-muted-foreground">
                    Examples of standard HTML list elements and custom styled lists.
                </p>
            </div>

            <div className="grid gap-8">
                {/* Default List Style Section */}
                <section>
                    <div className="mb-4">
                        <PageTitle level={2}>Default List Style</PageTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                            Standard unordered list using browser default styles (<code>list-style-type: disc</code>).
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Favorite Fruits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Apple</li>
                                <li>Banana</li>
                                <li>Cherry</li>
                                <li>Date</li>
                                <li>Elderberry</li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* Custom List Style Section */}
                <section>
                    <div className="mb-4">
                        <PageTitle level={2}>Custom List Style</PageTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                            Custom styled list with removed default bullets and custom markers.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Favorite Vegetables</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                                        1
                                    </span>
                                    <span>Asparagus</span>
                                </li>
                                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                                        2
                                    </span>
                                    <span>Broccoli</span>
                                </li>
                                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                                        3
                                    </span>
                                    <span>Carrot</span>
                                </li>
                                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                                        4
                                    </span>
                                    <span>Daikon</span>
                                </li>
                                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                                        5
                                    </span>
                                    <span>Eggplant</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
};

export default ListStylePage;
