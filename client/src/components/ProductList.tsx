import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

// ProductList 컴포넌트 props 타입 정의
interface ProductListProps {
  accessibilityLevel: 'none' | 'role-text' | 'aria-label';
  className?: string;
}

/**
 * 특정 접근성 레벨의 상품 목록을 표시하는 컴포넌트
 * 
 * 특징:
 * - React Query를 사용한 데이터 페칭
 * - 반응형 그리드 레이아웃
 * - 로딩/에러 상태 처리
 * - 접근성 레벨별 ProductCard 렌더링
 * 
 * @param accessibilityLevel - 접근성 레벨
 * @param className - 추가 CSS 클래스
 */
const ProductList: React.FC<ProductListProps> = ({ 
  accessibilityLevel, 
  className 
}) => {
  const { data: products, isLoading, error } = useProducts(accessibilityLevel);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Failed to load products
          </div>
          <div className="text-gray-600">
            Please try refreshing the page
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-gray-600 text-lg font-semibold mb-2">
            No products found
          </div>
          <div className="text-gray-500">
            No products available for this accessibility level
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 접근성 레벨 표시 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-1">
          Current Accessibility Level:
        </h4>
        <p className="text-lg font-semibold text-gray-900">
          {accessibilityLevel === 'none' && 'VoiceOver Unsupported'}
          {accessibilityLevel === 'role-text' && 'With Role Text'}
          {accessibilityLevel === 'aria-label' && 'With Aria Label'}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {accessibilityLevel === 'none' && 'Each element will be read separately by VoiceOver'}
          {accessibilityLevel === 'role-text' && 'Elements with role="text" will be read as one block'}
          {accessibilityLevel === 'aria-label' && 'All content will be read via aria-label'}
        </p>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            accessibilityLevel={accessibilityLevel}
          />
        ))}
      </div>

      {/* 상품 개수 표시 */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Showing {products.length} products
      </div>
    </div>
  );
};

export default ProductList; 