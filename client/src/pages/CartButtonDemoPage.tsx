import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageTitle from '@/components/PageTitle';
import TabContainer from '@/components/TabContainer';
import ProductCardWithButton from '@/components/ProductCardWithButton';
import { useProducts } from '@/hooks/useProducts';

// Type definition for CartButtonDemoPage props
type CartButtonDemoPageProps = {
  title?: string;
};

/**
 * Cart button accessibility demo page
 *
 * Purpose:
 * - Test VoiceOver behavior with "Add to cart" buttons
 * - Compare aria-describedby vs title attribute approaches
 * - Evaluate which method provides better context for screen readers
 *
 * Tabs:
 * 1. With aria-describedby: Button uses aria-label + aria-describedby to reference product name
 * 2. With title attribute: Button uses title attribute with full product context
 */
const CartButtonDemoPage: React.FC<CartButtonDemoPageProps> = ({
  title = "Cart Button Accessibility Demo"
}) => {
  // Update document title when component mounts
  useEffect(() => {
    console.log("CartButtonDemoPage: Setting document title to:", title);
    document.title = title;
  }, [title]);

  // Fetch products data (using 'none' level as we don't need special ARIA attributes on the card itself)
  const { data: products, isLoading, error } = useProducts('none');

  // Render product list for a specific variant
  const renderProductList = (variant: 'aria-describedby' | 'title') => {
    if (isLoading) {
      return (
        <div className="text-center py-8 text-gray-500">
          Loading products...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-500">
          Error loading products: {error.message}
        </div>
      );
    }

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No products available
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCardWithButton
            key={product.id}
            product={product}
            variant={variant}
          />
        ))}
      </div>
    );
  };

  // Tab definitions
  const tabs = [
    {
      id: 'aria-describedby',
      label: 'With aria-describedby',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Implementation:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Button has <code className="bg-white px-1 rounded">aria-label="Add to cart"</code></li>
              <li>Button references product name via <code className="bg-white px-1 rounded">aria-describedby</code></li>
              <li>Product name has unique ID for reference</li>
            </ul>
          </div>
          {renderProductList('aria-describedby')}
        </div>
      )
    },
    {
      id: 'title',
      label: 'With title attribute',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Implementation:</h3>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>Button has <code className="bg-white px-1 rounded">title</code> attribute</li>
              <li>Title includes full context: "Add [Product Name] to cart"</li>
              <li>No additional ARIA attributes needed</li>
            </ul>
          </div>
          {renderProductList('title')}
        </div>
      )
    }
  ];

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
            After enabling VoiceOver in iPhone Settings &gt; Accessibility &gt; VoiceOver,
            test the "Add to cart" buttons in each tab to compare how VoiceOver announces
            them using different accessibility approaches.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Testing Guide:</h3>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Navigate to an "Add to cart" button using VoiceOver</li>
              <li>Listen to how VoiceOver announces the button and product context</li>
              <li>Compare the experience between the two tabs</li>
              <li>Note which method provides clearer product identification</li>
            </ol>
          </div>

          <div className="border-t pt-6">
            <PageTitle level={3} className="mb-4">Demo Area</PageTitle>
            <TabContainer
              tabs={tabs}
              defaultActiveTab="aria-describedby"
              onTabChange={(tabId) => console.log('Active tab changed to:', tabId)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartButtonDemoPage;
