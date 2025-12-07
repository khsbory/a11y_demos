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
                    <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">HTML Structure Description</h3>
                        <p className="text-gray-700 leading-relaxed">
                            This radio group is implemented using the following DOM hierarchy:
                        </p>
                        <code className="block mt-2 p-2 bg-white border border-gray-200 rounded text-sm text-blue-600 font-mono">
                            &lt;ul&gt; &gt; &lt;li&gt; &gt; &lt;dl&gt; &gt; &lt;dt&gt; &gt; &lt;dd&gt;
                        </code>
                        <p className="mt-2 text-sm text-gray-600">
                            The <code>DT</code> element contains the group label (Year), and multiple <code>DD</code> elements contain the radio inputs and labels (Months).
                        </p>
                    </div>

                    {/* Requested Structure: UL > LI > DL > DT > DD */}
                    {/* Requested Structure: UL > LI > DL > DT > DD (Multiple) */}
                    <ul className="list-none p-0 m-0">
                        <li>
                            <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <dt className="col-span-full text-lg font-semibold mb-2 flex items-baseline space-x-2">
                                    <span className="text-gray-900">2025</span>
                                    <span className="sr-only">Please select a month.</span>
                                </dt>
                                {months.map((month, index) => {
                                    const id = `monthView2025${String(index + 1).padStart(2, '0')}`;
                                    return (
                                        <dd key={month} className="m-0">
                                            <input
                                                type="radio"
                                                id={id}
                                                name="monthCard"
                                                value={month}
                                                checked={selectedMonth === month}
                                                onChange={(e) => setSelectedMonth(e.target.value)}
                                                className="peer sr-only"
                                            />
                                            <label
                                                htmlFor={id}
                                                className="flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-focus:ring-2 peer-focus:ring-blue-500 transition-all"
                                            >
                                                <span className="font-medium text-gray-700 peer-checked:text-blue-700">{month}</span>
                                            </label>
                                        </dd>
                                    );
                                })}
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
