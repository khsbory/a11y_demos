import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export interface Hotel {
    id: number;
    name: string;
    location: string;
    price: number;
    rating: number;
    reviews: number;
    imageUrl: string;
    tags?: string[];
}

interface HotelCardProps {
    hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row h-full">
                {/* Image Section */}
                <div className="sm:w-1/3 md:w-1/4 h-48 sm:h-auto relative bg-gray-200">
                    <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content Section */}
                <CardContent className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {hotel.name}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <span className="mr-1">📍</span>
                                    {hotel.location}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end mb-1">
                                    <span className="text-yellow-500 text-lg mr-1">★</span>
                                    <span className="font-bold text-gray-900">{hotel.rating}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {hotel.reviews.toLocaleString()} reviews
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 sm:mt-0">
                        <div className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                            Free Cancellation
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-500 block mb-1">Per night</span>
                            <span className="text-2xl font-bold text-blue-600">
                                ${hotel.price.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
};

export default HotelCard;
