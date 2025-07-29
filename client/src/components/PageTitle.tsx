import React from 'react';
import { cn } from '@/lib/utils';

// 헤딩 레벨 타입 정의
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// PageTitle 컴포넌트 props 타입 정의
interface PageTitleProps {
  children: React.ReactNode;
  level?: HeadingLevel;
  className?: string;
}

/**
 * 웹 접근성을 고려한 페이지 제목 컴포넌트
 * level prop에 따라 적절한 헤딩 태그(h1-h6)를 렌더링합니다.
 * 
 * @param children - 제목 텍스트
 * @param level - 헤딩 레벨 (1-6, 기본값: 1)
 * @param className - 추가 CSS 클래스
 */
const PageTitle: React.FC<PageTitleProps> = ({ 
  children, 
  level = 1, 
  className 
}) => {
  // 헤딩 레벨에 따른 기본 스타일 클래스
  const getDefaultStyles = (level: HeadingLevel) => {
    switch (level) {
      case 1:
        return 'text-3xl font-bold leading-tight';
      case 2:
        return 'text-2xl font-semibold leading-tight';
      case 3:
        return 'text-xl font-semibold leading-tight';
      case 4:
        return 'text-lg font-medium leading-tight';
      case 5:
        return 'text-base font-medium leading-tight';
      case 6:
        return 'text-sm font-medium leading-tight';
      default:
        return 'text-3xl font-bold leading-tight';
    }
  };

  // 헤딩 레벨에 따른 태그 렌더링
  const renderHeading = () => {
    const baseStyles = getDefaultStyles(level);
    const combinedClassName = cn(baseStyles, className);

    switch (level) {
      case 1:
        return <h1 className={combinedClassName}>{children}</h1>;
      case 2:
        return <h2 className={combinedClassName}>{children}</h2>;
      case 3:
        return <h3 className={combinedClassName}>{children}</h3>;
      case 4:
        return <h4 className={combinedClassName}>{children}</h4>;
      case 5:
        return <h5 className={combinedClassName}>{children}</h5>;
      case 6:
        return <h6 className={combinedClassName}>{children}</h6>;
      default:
        return <h1 className={combinedClassName}>{children}</h1>;
    }
  };

  return renderHeading();
};

export default PageTitle; 