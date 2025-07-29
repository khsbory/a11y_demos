import { useQuery } from '@tanstack/react-query';
import { type Product } from '@shared/schema';

/**
 * 특정 접근성 레벨의 상품 데이터를 가져오는 훅
 * 
 * @param accessibilityLevel - 접근성 레벨 ('none' | 'role-text' | 'aria-label')
 * @returns React Query 결과 객체
 */
export function useProducts(accessibilityLevel: string) {
  return useQuery({
    queryKey: ['products', accessibilityLevel],
    queryFn: async (): Promise<Product[]> => {
      const response = await fetch(`/api/products/${accessibilityLevel}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 시간
  });
} 