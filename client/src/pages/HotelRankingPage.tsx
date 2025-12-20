import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageTitle from '@/components/PageTitle';
import HotelCard, { Hotel } from '@/components/HotelCard';

type SortOption = 'recommend' | 'price_asc' | 'rating_desc';

const MOCK_HOTELS: Hotel[] = [
    {
        id: 1,
        name: "Grand Hyatt Seoul",
        location: "Yongsan-gu, Seoul",
        price: 350,
        rating: 4.6,
        reviews: 2450,
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=300&fit=crop",
        tags: ["Luxury", "Spa", "View"]
    },
    {
        id: 2,
        name: "Signiel Seoul",
        location: "Songpa-gu, Seoul",
        price: 550,
        rating: 4.9,
        reviews: 3100,
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop",
        tags: ["Ultra Luxury", "Landmark", "Shopping"]
    },
    {
        id: 3,
        name: "Lotte Hotel Seoul",
        location: "Jung-gu, Seoul",
        price: 280,
        rating: 4.5,
        reviews: 1800,
        imageUrl: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=500&h=300&fit=crop",
        tags: ["City Center", "Business"]
    },
    {
        id: 4,
        name: "Shilla Stay Gwanghwamun",
        location: "Jongno-gu, Seoul",
        price: 120,
        rating: 4.2,
        reviews: 950,
        imageUrl: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=500&h=300&fit=crop",
        tags: ["Business", "Value"]
    },
    {
        id: 5,
        name: "Four Seasons Hotel",
        location: "Jongno-gu, Seoul",
        price: 600,
        rating: 4.8,
        reviews: 1200,
        imageUrl: "https://images.unsplash.com/photo-1571896349842-68c8949120cf?w=500&h=300&fit=crop",
        tags: ["Luxury", "Family Friendly"]
    },
    {
        id: 6,
        name: "Ryse, Autograph Collection",
        location: "Mapo-gu, Seoul",
        price: 210,
        rating: 4.7,
        reviews: 1500,
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop",
        tags: ["Trendy", "Design", "Nightlife"]
    },
    {
        id: 7,
        name: "Ibis Ambassador Myeongdong",
        location: "Jung-gu, Seoul",
        price: 95,
        rating: 4.0,
        reviews: 3200,
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=300&fit=crop",
        tags: ["Budget", "Shopping", "Convenient"]
    },
    {
        id: 8,
        name: "Vista Walkerhill Seoul",
        location: "Gwangjin-gu, Seoul",
        price: 320,
        rating: 4.4,
        reviews: 1100,
        imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&h=300&fit=crop",
        tags: ["River View", "Resort", "Casino"]
    },
    {
        id: 9,
        name: "InterContinental Seoul COEX",
        location: "Gangnam-gu, Seoul",
        price: 290,
        rating: 4.3,
        reviews: 1400,
        imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=500&h=300&fit=crop",
        tags: ["Convention", "Shopping", "Gangnam"]
    },
    {
        id: 10,
        name: "Fairmont Ambassador Seoul",
        location: "Yeongdeungpo-gu, Seoul",
        price: 380,
        rating: 4.5,
        reviews: 500,
        imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&h=300&fit=crop",
        tags: ["New", "Luxury", "Han River"]
    }
];

const HotelRankingPage = () => {
    const [sortOption, setSortOption] = useState<SortOption>('recommend');

    const getSortedHotels = () => {
        const hotels = [...MOCK_HOTELS];

        switch (sortOption) {
            case 'price_asc':
                return hotels.sort((a, b) => a.price - b.price);
            case 'rating_desc':
                return hotels.sort((a, b) => b.rating - a.rating);
            case 'recommend':
            default:
                return hotels; // Default order
        }
    };

    const sortedHotels = getSortedHotels();

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <Card className="shadow-lg min-h-screen">
                <CardHeader>
                    <PageTitle level={1} className="border-b pb-2">
                        Hotel Ranking List
                    </PageTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h2 className="text-lg font-semibold text-blue-800 mb-2">Accessibility Note</h2>
                        <p className="text-blue-700 leading-relaxed">
                            This demo tests the use of <code>aria-current="true"</code> on the active sort button.
                            When you change the sort order, the list updates immediately.
                            The <code>aria-current</code> state conveys to screen readers which sorting logic is currently active.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
                            {sortedHotels.length} Properties Found
                        </h2>

                        {/* Sorting Controls */}
                        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setSortOption('recommend')}
                                aria-current={sortOption === 'recommend' ? 'true' : undefined}
                                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-all
                  ${sortOption === 'recommend'
                                        ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}
                `}
                            >
                                Recommended
                            </button>
                            <button
                                type="button"
                                onClick={() => setSortOption('price_asc')}
                                aria-current={sortOption === 'price_asc' ? 'true' : undefined}
                                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-all
                  ${sortOption === 'price_asc'
                                        ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}
                `}
                            >
                                Lowest Price
                            </button>
                            <button
                                type="button"
                                onClick={() => setSortOption('rating_desc')}
                                aria-current={sortOption === 'rating_desc' ? 'true' : undefined}
                                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-all
                  ${sortOption === 'rating_desc'
                                        ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}
                `}
                            >
                                Highest Rating
                            </button>
                        </div>
                    </div>

                    {/* Hotel List */}
                    <div className="space-y-4">
                        {sortedHotels.map((hotel) => (
                            <HotelCard key={hotel.id} hotel={hotel} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HotelRankingPage;
