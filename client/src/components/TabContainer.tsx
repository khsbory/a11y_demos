import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTabAccessibility } from '@/hooks/useTabAccessibility';

// 탭 아이템 인터페이스
interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  disabled?: boolean;
}

// TabContainer 컴포넌트 props 타입 정의
interface TabContainerProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  disabledTabClassName?: string;
  panelClassName?: string;
  onTabChange?: (tabId: string) => void;
}

/**
 * 웹 접근성을 고려한 유연한 탭 컨테이너 컴포넌트
 * 
 * 특징:
 * - 2개 이상의 탭을 유연하게 지원
 * - 키보드 접근성 (Arrow keys, Home, End)
 * - 스크린 리더 지원 (ARIA 속성)
 * - 비활성화된 탭 지원
 * - 커스터마이징 가능한 스타일링
 * 
 * @param tabs - 탭 아이템 배열
 * @param defaultActiveTab - 기본 활성 탭 ID
 * @param className - 컨테이너 클래스
 * @param tabListClassName - 탭 리스트 클래스
 * @param tabClassName - 개별 탭 클래스
 * @param activeTabClassName - 활성 탭 클래스
 * @param disabledTabClassName - 비활성 탭 클래스
 * @param panelClassName - 패널 클래스
 * @param onTabChange - 탭 변경 콜백
 */
const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  defaultActiveTab,
  className,
  tabListClassName,
  tabClassName,
  activeTabClassName,
  disabledTabClassName,
  panelClassName,
  onTabChange
}) => {
  // 활성 탭 상태 관리
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || '');

  // 비활성화된 탭 ID 목록
  const disabledTabIds = tabs.filter(tab => tab.disabled).map(tab => tab.id);

  // 탭 접근성 훅 사용
  const { getTabProps, getTabListProps, getTabPanelProps } = useTabAccessibility({
    tabIds: tabs.map(tab => tab.id),
    activeTab,
    onTabChange: (tabId: string) => {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    },
    disabledTabs: disabledTabIds
  });

  // 탭 변경 핸들러
  const handleTabClick = (tabId: string) => {
    if (!disabledTabIds.includes(tabId)) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 탭 리스트 */}
      <div
        {...getTabListProps()}
        className={cn(
          'flex border-b border-gray-200 mb-4',
          tabListClassName
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            {...getTabProps(tab.id)}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              tabClassName,
              {
                'text-blue-600 border-b-2 border-blue-600 bg-blue-50': activeTab === tab.id && !tab.disabled,
                'text-gray-500 hover:text-gray-700': activeTab !== tab.id && !tab.disabled,
                'text-gray-400 cursor-not-allowed': tab.disabled,
                [activeTabClassName || '']: activeTab === tab.id && !tab.disabled,
                [disabledTabClassName || '']: tab.disabled
              }
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 패널 */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          {...getTabPanelProps(tab.id)}
          className={cn(
            'focus:outline-none',
            panelClassName,
            {
              'block': activeTab === tab.id,
              'hidden': activeTab !== tab.id
            }
          )}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default TabContainer; 