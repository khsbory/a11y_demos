import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/PageTitle';

type RadioGroupTestPageProps = {
    title?: string;
};

const RadioGroupTestPage: React.FC<RadioGroupTestPageProps> = ({ title = "Radio Group Test Demo" }) => {
    React.useEffect(() => {
        document.title = title;
    }, [title]);

    const [selectedMonth, setSelectedMonth] = useState<string>('');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleConfirm = () => {
        if (selectedMonth) {
            alert(`${selectedMonth} selected.`);
        } else {
            alert('Please select a month.');
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <PageTitle level={1}>Radio Group Test Demo</PageTitle>
                </CardHeader>
                <CardContent>
                    {/* Requested Structure: UL > LI > DL > DT > DD */}
                    <ul className="list-none p-0 m-0">
                        <li>
                            <dl className="space-y-4">
                                <dt className="text-lg font-semibold mb-2">Period Selection</dt>
                                <dd>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {months.map((month, index) => (
                                            <label key={month} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="radio"
                                                    name="period"
                                                    value={month}
                                                    checked={selectedMonth === month}
                                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="text-gray-700">{month}</span>
                                            </label>
                                        ))}
                                    </div>
                                </dd>
                            </dl>
                        </li>
                    </ul>

                    <div className="mt-8">
                        <Button onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RadioGroupTestPage;
