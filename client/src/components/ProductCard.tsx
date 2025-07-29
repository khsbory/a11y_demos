import React from 'react';
import { type Product } from '@shared/schema';
import { cn } from '@/lib/utils';

// ProductCard 컴포넌트 props 타입 정의
interface ProductCardProps {
  product: Product;
  accessibilityLevel: 'none' | 'role-text' | 'aria-label';
  className?: string;
}

/**
 * 접근성 레벨별로 다른 마크업을 렌더링하는 상품 카드 컴포넌트
 * 
 * 특징:
 * - 접근성 레벨에 따라 다른 ARIA 속성 적용
 * - 각 div별 개별 스타일링
 * - 가격 분리 스타일링 (달러 기호, 숫자, 소수점)
 * - VoiceOver 포커스 분리 현상 테스트용
 * - 투두 데이터의 모든 정보 표시 (할인율, 재고, 구매수, 카테고리, 정가/할인가 비교)
 * 
 * @param product - 상품 데이터
 * @param accessibilityLevel - 접근성 레벨
 * @param className - 추가 CSS 클래스
 */
const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  accessibilityLevel, 
  className 
}) => {
  // 가격을 달러 기호, 숫자, 소수점으로 분리
  const formatPrice = (price: number) => {
    const priceStr = price.toFixed(2);
    const [dollars, cents] = priceStr.split('.');
    return { dollars, cents };
  };

  const { dollars: saleDollars, cents: saleCents } = formatPrice(product.pricing.salePrice);
  const { dollars: regularDollars, cents: regularCents } = formatPrice(product.pricing.regularPrice);

  // 접근성 레벨별 aria-label 생성 (업데이트된 정보 포함)
  const generateAriaLabel = () => {
    // 가격 정보 구성 (정가와 할인가 모두 포함)
    const priceInfo = product.pricing.discountPercentage > 0 
      ? `$${product.pricing.regularPrice.toFixed(2)} was $${product.pricing.salePrice.toFixed(2)}`
      : `$${product.pricing.salePrice.toFixed(2)}`;
    
    return `${product.productName}, ${product.category}, ${priceInfo}, ${product.pricing.discountPercentage}% off, ${product.stats.rating} stars, ${product.stats.reviewCount} reviews, ${product.stats.purchaseCount} purchases, ${product.stock.available ? 'in stock' : 'out of stock'}`;
  };

  // 접근성 레벨별 공통 div 속성
  const getDivProps = (isTitle = false, isPrice = false, isReview = false, isCategory = false, isStock = false, isPurchase = false) => {
    const baseProps: any = {};
    
    if (accessibilityLevel === 'role-text') {
      baseProps.role = 'text';
    } else if (accessibilityLevel === 'aria-label') {
      baseProps['aria-hidden'] = 'true';
    }
    
    return baseProps;
  };

  // 접근성 레벨별 a 태그 속성
  const getLinkProps = () => {
    const baseProps: any = {
      href: product.productUrl,
      className: cn(
        'block p-4 border rounded-lg hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative',
        className
      )
    };

    if (accessibilityLevel === 'aria-label') {
      baseProps['aria-label'] = generateAriaLabel();
    }

    return baseProps;
  };

  return (
    <a {...getLinkProps()}>
      {/* 할인율 배지 (우상단) */}
      {product.pricing.discountPercentage > 0 && (
        <div 
          {...getDivProps()}
          className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
        >
          {product.pricing.discountPercentage}% OFF
        </div>
      )}
      
      {/* 제목 div */}
      <div 
        {...getDivProps(true)}
        className="text-lg font-bold text-gray-900 mb-1 line-clamp-2"
      >
        {product.productName}
      </div>
      
      {/* 카테고리 div */}
      <div 
        {...getDivProps(false, false, false, true)}
        className="text-sm text-gray-500 mb-2"
      >
        {product.category}
      </div>
      
      {/* 가격 div (정가/할인가 비교) */}
      <div 
        {...getDivProps(false, true)}
        className="mb-1"
      >
        {/* 할인가 */}
        <div 
          className="text-xl font-semibold text-blue-600"
          {...(accessibilityLevel === 'none' || accessibilityLevel === 'role-text') && {
            role: 'insertion'
          }}
        >
          <span className="text-sm text-gray-500">$</span>
          <span className="text-2xl font-bold">{saleDollars}</span>
          <span className="text-sm text-gray-500">.{saleCents}</span>
        </div>
        
        {/* 정가 (할인이 있는 경우) */}
        {product.pricing.discountPercentage > 0 && (
          <div 
            className="text-sm text-gray-400 line-through"
            {...(accessibilityLevel === 'none' || accessibilityLevel === 'role-text') && {
              role: 'deletion'
            }}
          >
            ${product.pricing.regularPrice.toFixed(2)}
          </div>
        )}
      </div>
      
      {/* 재고 상태 div */}
      <div 
        {...getDivProps(false, false, false, false, true)}
        className={cn(
          "text-sm font-medium mb-1",
          product.stock.available ? "text-green-600" : "text-red-600"
        )}
      >
        {product.stock.available ? "✓ In Stock" : "✗ Out of Stock"}
        {product.stock.available && (
          <span className="text-gray-500 ml-1">({product.stock.quantity})</span>
        )}
      </div>
      
      {/* 구매수 div */}
      <div 
        {...getDivProps(false, false, false, false, false, true)}
        className="text-sm text-gray-600 mb-1"
      >
        <span className="font-medium">{product.stats.purchaseCount.toLocaleString()}</span>
        <span className="text-gray-500"> purchases</span>
      </div>
      
      {/* 리뷰 div */}
      <div 
        {...getDivProps(false, false, true)}
        className="text-sm text-gray-600"
      >
        <span className="text-yellow-500">★</span>
        <span className="font-medium">{product.stats.rating}</span>
        <span className="text-gray-500">({product.stats.reviewCount.toLocaleString()} reviews)</span>
      </div>
    </a>
  );
};

export default ProductCard; 