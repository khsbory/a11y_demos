import { useRef, useCallback } from 'react';

// 탭 접근성 옵션 인터페이스
interface UseTabAccessibilityOptions {
  tabIds: string[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  disabledTabs?: string[];
}

/**
 * 탭 컴포넌트의 키보드 접근성을 위한 훅
 * 
 * 지원하는 키보드 기능:
 * - Arrow Left/Right: 탭 간 이동
 * - Home: 첫 번째 탭으로 이동
 * - End: 마지막 탭으로 이동
 * - role="tablist"와 role="tab", aria-selected 마크업이 되어 있으면
 *   스크린 리더가 탭 구조를 올바르게 인식합니다.
 * - disabledTabs 옵션으로 비활성화된 탭을 건너뛰는 기능을 지원합니다.
 */
export function useTabAccessibility({
  tabIds,
  activeTab,
  onTabChange,
  disabledTabs = []
}: UseTabAccessibilityOptions) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback((e: React.KeyboardEvent, tabId: string) => {
    const currentIndex = tabIds.indexOf(tabId);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabIds.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex === 0 ? tabIds.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabIds.length - 1;
        break;
      default:
        return;
    }

    // 비활성화된 탭을 건너뛰기
    let attempts = 0;
    while (disabledTabs.includes(tabIds[newIndex]) && attempts < tabIds.length) {
      if (e.key === 'ArrowRight' || e.key === 'Home') {
        newIndex = (newIndex + 1) % tabIds.length;
      } else {
        newIndex = newIndex === 0 ? tabIds.length - 1 : newIndex - 1;
      }
      attempts++;
    }

    // 비활성화된 탭이 아닌 경우에만 변경
    if (!disabledTabs.includes(tabIds[newIndex])) {
      const newTabId = tabIds[newIndex];
      onTabChange(newTabId);
      setTimeout(() => tabRefs.current[newTabId]?.focus(), 0);
    }
  }, [tabIds, onTabChange, disabledTabs]);

  // 탭 버튼에 적용할 props 반환
  const getTabProps = useCallback((tabId: string) => ({
    ref: (el: HTMLButtonElement | null) => { tabRefs.current[tabId] = el; },
    role: 'tab' as const,
    id: `tab-${tabId}`,
    'aria-selected': activeTab === tabId,
    'aria-controls': `panel-${tabId}`,
    tabIndex: disabledTabs.includes(tabId) ? -1 : (activeTab === tabId ? 0 : -1),
    onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, tabId)
  }), [activeTab, handleKeyDown, disabledTabs]);

  // 탭 리스트에 적용할 props 반환
  const getTabListProps = useCallback(() => ({
    role: 'tablist' as const
  }), []);

  // 탭 패널에 적용할 props 반환
  const getTabPanelProps = useCallback((tabId: string) => ({
    role: 'tabpanel' as const,
    id: `panel-${tabId}`,
    'aria-labelledby': `tab-${tabId}`
  }), []);

  return { getTabProps, getTabListProps, getTabPanelProps };
} 