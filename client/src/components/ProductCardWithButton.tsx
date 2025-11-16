import React from 'react';
import { type Product } from '@shared/schema';
import { cn } from '@/lib/utils';

// ProductCardWithButton props type definition
interface ProductCardWithButtonProps {
  product: Product;
  variant: 'aria-describedby' | 'title';
  className?: string;
}

/**
 * Cart button accessibility test component
 *
 * Features:
 * - Product information wrapped in <a> tag
 * - "Add to cart" button below product card
 * - Two variants for VoiceOver testing:
 *   1. aria-describedby: Links button to product name via ID reference
 *   2. title: Uses title attribute with product name
 *
 * @param product - Product data
 * @param variant - Accessibility approach ('aria-describedby' | 'title')
 * @param className - Additional CSS classes
 */
const ProductCardWithButton: React.FC<ProductCardWithButtonProps> = ({
  product,
  variant,
  className
}) => {
  // Format price into dollar and cents components
  const formatPrice = (price: number) => {
    const priceStr = price.toFixed(2);
    const [dollars, cents] = priceStr.split('.');
    return { dollars, cents };
  };

  const { dollars: saleDollars, cents: saleCents } = formatPrice(product.pricing.salePrice);
  const { dollars: regularDollars, cents: regularCents } = formatPrice(product.pricing.regularPrice);

  // Generate unique ID for aria-describedby
  const productNameId = `product-name-${product.id}`;

  // Handle add to cart action
  const handleAddToCart = () => {
    console.log('Added to cart:', product.productName);
  };

  // Generate button props based on variant
  const getButtonProps = () => {
    const baseProps = {
      onClick: handleAddToCart,
      className: "w-full mt-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    };

    if (variant === 'aria-describedby') {
      return {
        ...baseProps,
        'aria-label': 'Add to cart',
        'aria-describedby': productNameId
      };
    } else {
      return {
        ...baseProps,
        title: `Add ${product.productName} to cart`
      };
    }
  };

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {/* Product link */}
      <a
        href={product.productUrl}
        className="block p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative"
      >
        {/* Discount badge (top right) */}
        {product.pricing.discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.pricing.discountPercentage}% OFF
          </div>
        )}

        {/* Product name */}
        <div
          id={variant === 'aria-describedby' ? productNameId : undefined}
          className="text-lg font-bold text-gray-900 mb-1 line-clamp-2"
        >
          {product.productName}
        </div>

        {/* Category */}
        <div className="text-sm text-gray-500 mb-2">
          {product.category}
        </div>

        {/* Price section */}
        <div className="mb-1">
          {/* Sale price */}
          <div className="text-xl font-semibold text-blue-600">
            <span className="text-sm text-gray-500">$</span>
            <span className="text-2xl font-bold">{saleDollars}</span>
            <span className="text-sm text-gray-500">.{saleCents}</span>
          </div>

          {/* Regular price (if discount exists) */}
          {product.pricing.discountPercentage > 0 && (
            <div className="text-sm text-gray-400 line-through">
              ${product.pricing.regularPrice.toFixed(2)}
            </div>
          )}
        </div>

        {/* Stock status */}
        <div className={cn(
          "text-sm font-medium mb-1",
          product.stock.available ? "text-green-600" : "text-red-600"
        )}>
          {product.stock.available ? "✓ In Stock" : "✗ Out of Stock"}
          {product.stock.available && (
            <span className="text-gray-500 ml-1">({product.stock.quantity})</span>
          )}
        </div>

        {/* Purchase count */}
        <div className="text-sm text-gray-600 mb-1">
          <span className="font-medium">{product.stats.purchaseCount.toLocaleString()}</span>
          <span className="text-gray-500"> purchases</span>
        </div>

        {/* Review */}
        <div className="text-sm text-gray-600">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{product.stats.rating}</span>
          <span className="text-gray-500">({product.stats.reviewCount.toLocaleString()} reviews)</span>
        </div>
      </a>

      {/* Add to cart button */}
      <div className="px-4 pb-4">
        <button {...getButtonProps()}>
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCardWithButton;
