import { useEffect, useState, useCallback } from 'react';

/**
 * SSR 호환 드롭다운 키보드 접근성 훅
 * role="listbox"와 role="option"이 적용된 요소에서 키보드 내비게이션을 제공합니다.
 * Next.js, Gatsby 등 SSR 환경에서도 안전하게 동작합니다.
 */

interface UseDropdownKeyboardAccessibilityProps {
    /** 드롭다운 열림 상태 */
    isOpen: boolean;
    /** 리스트박스 요소의 ID */
    listboxId: string;
    /** 옵션 선택 콜백 함수 */
    onSelect: (value: string) => void;
    /** 드롭다운 닫기 콜백 함수 */
    onClose: () => void;
    /** 현재 선택된 값 (선택사항) */
    selectedValue?: string;
    /** 초점 복원을 위한 트리거 요소 ref (선택사항) */
    triggerElementRef?: React.RefObject<HTMLElement>;
}

// SSR 환경 감지 헬퍼 함수
const isSSR = () => typeof window === 'undefined';

export function useDropdownKeyboardAccessibility({
    isOpen,
    listboxId,
    onSelect,
    onClose,
    selectedValue,
    triggerElementRef
}: UseDropdownKeyboardAccessibilityProps) {
    const [currentFocusIndex, setCurrentFocusIndex] = useState<number>(0);
    const [isMounted, setIsMounted] = useState(false);

    // 클라이언트 마운트 상태 추적
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // DOM 요소 접근을 위한 안전한 헬퍼 함수들
    const safeGetElement = useCallback((id: string): HTMLElement | null => {
        if (isSSR() || !isMounted) return null;
        try {
            return document.getElementById(id);
        } catch {
            return null;
        }
    }, [isMounted]);

    // 옵션 요소들 가져오기 (disabled가 아닌 것만) - SSR 안전
    const getOptions = useCallback(() => {
        if (isSSR() || !isMounted) return [];

        const listbox = safeGetElement(listboxId);
        if (!listbox) return [];

        try {
            return Array.from(listbox.querySelectorAll('[role="option"]:not([aria-disabled="true"])')) as HTMLElement[];
        } catch {
            return [];
        }
    }, [listboxId, isMounted, safeGetElement]);

    // 모든 옵션 가져오기 (disabled 포함) - SSR 안전
    const getAllOptions = useCallback(() => {
        if (isSSR() || !isMounted) return [];

        const listbox = safeGetElement(listboxId);
        if (!listbox) return [];

        try {
            return Array.from(listbox.querySelectorAll('[role="option"]')) as HTMLElement[];
        } catch {
            return [];
        }
    }, [listboxId, isMounted, safeGetElement]);

    // 안전한 포커스 이동 함수
    const moveFocus = useCallback((index: number) => {
        if (isSSR() || !isMounted) return;

        const options = getOptions();
        const allOptions = getAllOptions();
        if (options.length === 0) return;

        // 인덱스 범위 조정 (순환)
        const newIndex = Math.max(0, Math.min(index, options.length - 1));
        setCurrentFocusIndex(newIndex);

        // DOM 조작 안전 실행
        try {
            allOptions.forEach((option) => {
                if (!option) return;

                const isDisabled = option.getAttribute('aria-disabled') === 'true';
                if (isDisabled) {
                    option.tabIndex = -1;
                } else {
                    const optionIndex = options.indexOf(option);
                    option.tabIndex = optionIndex === newIndex ? 0 : -1;
                }
            });

            const targetOption = options[newIndex];
            if (targetOption && typeof targetOption.focus === 'function') {
                targetOption.focus();
            }
        } catch (error) {
            console.warn('Focus management failed:', error);
        }
    }, [getOptions, getAllOptions, isMounted]);

    // 키보드 이벤트 핸들러
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (isSSR() || !isMounted || !isOpen) return;

        const options = getOptions();
        if (options.length === 0) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                moveFocus((currentFocusIndex + 1) % options.length);
                break;
            case 'ArrowUp':
                event.preventDefault();
                moveFocus(currentFocusIndex === 0 ? options.length - 1 : currentFocusIndex - 1);
                break;
            case 'Home':
                event.preventDefault();
                moveFocus(0);
                break;
            case 'End':
                event.preventDefault();
                moveFocus(options.length - 1);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                try {
                    const selectedOption = options[currentFocusIndex];
                    if (selectedOption && selectedOption.getAttribute('aria-disabled') !== 'true') {
                        const value = selectedOption.getAttribute('data-value') || '';
                        if (value) {
                            onSelect(value);
                            setTimeout(() => {
                                if (triggerElementRef?.current) {
                                    triggerElementRef.current.focus();
                                }
                            }, 50);
                        }
                    }
                } catch (error) {
                    console.warn('Option selection failed:', error);
                }
                break;
            case 'Escape':
                event.preventDefault();
                onClose();
                setTimeout(() => {
                    try {
                        if (triggerElementRef?.current) {
                            triggerElementRef.current.focus();
                        }
                    } catch (error) {
                        console.warn('Focus restoration failed:', error);
                    }
                }, 50);
                break;
            case 'Tab':
                onClose();
                break;
        }
    }, [isOpen, currentFocusIndex, getOptions, moveFocus, onSelect, onClose, triggerElementRef, isMounted]);

    // 드롭다운 열릴 때 초기 포커스 설정
    useEffect(() => {
        if (isSSR() || !isMounted || !isOpen) return;

        const options = getOptions();
        if (options.length === 0) return;

        let initialIndex = 0;
        if (selectedValue) {
            try {
                const selectedIndex = options.findIndex(option =>
                    option.getAttribute('data-value') === selectedValue ||
                    option.getAttribute('value') === selectedValue
                );
                if (selectedIndex !== -1) {
                    initialIndex = selectedIndex;
                }
            } catch {
                // 검색 실패 시 기본 인덱스 사용
            }
        }

        const timeoutId = setTimeout(() => {
            moveFocus(initialIndex);
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [isOpen, selectedValue, getOptions, moveFocus, isMounted]);

    // 키보드 이벤트 리스너 등록
    useEffect(() => {
        if (isSSR() || !isMounted || !isOpen) return;

        try {
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                if (!isSSR()) {
                    document.removeEventListener('keydown', handleKeyDown);
                }
            };
        } catch (error) {
            console.warn('Event listener setup failed:', error);
            return () => { };
        }
    }, [isOpen, handleKeyDown, isMounted]);

    return {
        currentFocusIndex,
        isMounted,
        getOptions
    };
}
