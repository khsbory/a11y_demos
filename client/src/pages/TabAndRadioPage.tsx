import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/PageTitle';

// Type definition for TabAndRadioPage props
type TabAndRadioPageProps = {
  title?: string;
};

// Product data for fruits and vegetables
const fruitsData = [
  { id: 1, name: 'Apple', description: 'Fresh red apples with crisp texture and sweet taste', price: '$2.99/lb' },
  { id: 2, name: 'Banana', description: 'Ripe yellow bananas, perfect for smoothies and snacks', price: '$1.49/lb' },
  { id: 3, name: 'Orange', description: 'Juicy citrus oranges packed with vitamin C', price: '$3.99/lb' },
  { id: 4, name: 'Strawberry', description: 'Sweet and fragrant strawberries, freshly picked', price: '$4.99/lb' },
  { id: 5, name: 'Grapes', description: 'Seedless green grapes with natural sweetness', price: '$3.49/lb' }
];

const vegetablesData = [
  { id: 1, name: 'Carrot', description: 'Organic carrots rich in beta-carotene and fiber', price: '$2.29/lb' },
  { id: 2, name: 'Broccoli', description: 'Fresh broccoli crowns with vibrant green color', price: '$2.99/lb' },
  { id: 3, name: 'Spinach', description: 'Baby spinach leaves perfect for salads and cooking', price: '$3.99/lb' },
  { id: 4, name: 'Tomato', description: 'Ripe red tomatoes with rich flavor and nutrients', price: '$3.49/lb' },
  { id: 5, name: 'Bell Pepper', description: 'Colorful bell peppers with sweet, crisp texture', price: '$4.99/lb' }
];

// Radio button options
const sortOptions = [
  { id: 'name', label: 'Sort by Name', value: 'name' },
  { id: 'price', label: 'Sort by Price', value: 'price' },
  { id: 'default', label: 'Default Order', value: 'default' }
];

const TabAndRadioPage: React.FC<TabAndRadioPageProps> = ({ title = "Tab & Radio Demo" }) => {
  const [activeTab, setActiveTab] = useState<'fruits' | 'vegetables'>('fruits');
  const [sortBy, setSortBy] = useState<string>('default');
  
  // References for tab buttons
  const fruitsTabRef = useRef<HTMLButtonElement>(null);
  const vegetablesTabRef = useRef<HTMLButtonElement>(null);

  // Update document title when component mounts
  useEffect(() => {
    console.log("TabAndRadioPage: Setting document title to:", title);
    document.title = title;
  }, [title]);

  // Handle keyboard navigation for tabs
  const handleTabKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        if (activeTab === 'fruits') {
          setActiveTab('vegetables');
          vegetablesTabRef.current?.focus();
        } else {
          setActiveTab('fruits');
          fruitsTabRef.current?.focus();
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (activeTab === 'vegetables') {
          setActiveTab('fruits');
          fruitsTabRef.current?.focus();
        } else {
          setActiveTab('vegetables');
          vegetablesTabRef.current?.focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        setActiveTab('fruits');
        fruitsTabRef.current?.focus();
        break;
      case 'End':
        event.preventDefault();
        setActiveTab('vegetables');
        vegetablesTabRef.current?.focus();
        break;
    }
  };

  // Sort function
  const sortItems = (items: typeof fruitsData, sortType: string) => {
    const sortedItems = [...items];
    switch (sortType) {
      case 'name':
        return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        return sortedItems.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[$\/lb]/g, ''));
          const priceB = parseFloat(b.price.replace(/[$\/lb]/g, ''));
          return priceA - priceB;
        });
      default:
        return sortedItems;
    }
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    const data = activeTab === 'fruits' ? fruitsData : vegetablesData;
    return sortItems(data, sortBy);
  };

  // Handle add to cart button click
  const handleAddToCart = (itemName: string) => {
    alert('Coming Soon');
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <PageTitle level={1} className="border-b pb-2">
            {title}
          </PageTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            This page demonstrates tab navigation and radio button functionality for accessibility testing. 
            Switch between fruit and vegetable categories using tabs, and use radio buttons to sort items 
            by different criteria. Perfect for testing keyboard navigation and screen reader compatibility.
          </p>
          
          {/* Tab Navigation */}
          <div className="border-t pt-6">
            <PageTitle level={3} className="mb-4">Category Tabs</PageTitle>
            <div role="tablist" className="flex border-b border-gray-200 mb-6">
              <Button
                ref={fruitsTabRef}
                role="tab"
                variant={activeTab === 'fruits' ? 'default' : 'ghost'}
                className={`px-6 py-3 rounded-t-lg border-b-2 ${
                  activeTab === 'fruits' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                aria-selected={activeTab === 'fruits'}
                aria-controls="fruits-panel"
                tabIndex={activeTab === 'fruits' ? 0 : -1}
                onClick={() => setActiveTab('fruits')}
                onKeyDown={handleTabKeyDown}
              >
                <span aria-hidden="true">🍎</span> Fruits
              </Button>
              <Button
                ref={vegetablesTabRef}
                role="tab"
                variant={activeTab === 'vegetables' ? 'default' : 'ghost'}
                className={`px-6 py-3 rounded-t-lg border-b-2 ${
                  activeTab === 'vegetables' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                aria-selected={activeTab === 'vegetables'}
                aria-controls="vegetables-panel"
                tabIndex={activeTab === 'vegetables' ? 0 : -1}
                onClick={() => setActiveTab('vegetables')}
                onKeyDown={handleTabKeyDown}
              >
                <span aria-hidden="true">🥕</span> Vegetables
              </Button>
            </div>

            {/* Radio Button Sorting Options */}
            <div className="mb-6">
              <PageTitle level={4} className="mb-3">Sort Options</PageTitle>
              <fieldset className="space-y-2">
                <legend className="sr-only">Choose sorting method</legend>
                {sortOptions.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sortOptions"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </fieldset>
            </div>

            {/* Tab Panels */}
            <div
              id={`${activeTab}-panel`}
              role="tabpanel"
              aria-labelledby={`${activeTab}-tab`}
              className="mt-4"
            >
              <PageTitle level={4} className="mb-4">
                {activeTab === 'fruits' ? (
                  <>
                    <span aria-hidden="true">🍎</span> Fresh Fruits
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">🥕</span> Fresh Vegetables
                  </>
                )}
              </PageTitle>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getCurrentData().map((item) => (
                  <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <h5 className="font-semibold text-lg text-gray-800">{item.name}</h5>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <p className="text-blue-600 font-semibold">{item.price}</p>
                      <Button 
                        size="sm" 
                        className="w-full mt-2"
                        aria-label={`Add ${item.name} to cart`}
                        onClick={() => handleAddToCart(item.name)}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabAndRadioPage;