import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check, Copy, ClipboardCheck } from "lucide-react";
import { useDropdownKeyboardAccessibility } from "@/hooks/useDropdownKeyboardAccessibility";
import { cn } from "@/lib/utils";

interface DropdownDemoPageProps {
    title: string;
}

const fruits = [
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Elderberry",
    "Fig",
    "Grape"
];

const HOOK_CODE = `import { useEffect, useState, useCallback } from 'react';

/**
 * SSR Compatible Dropdown Keyboard Accessibility Hook
 * Provides keyboard navigation for role="listbox" and role="option".
 * Works safely in SSR environments like Next.js, Gatsby.
 */

interface UseDropdownKeyboardAccessibilityProps {
  isOpen: boolean;
  listboxId: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  selectedValue?: string;
  triggerElementRef?: React.RefObject<HTMLElement>;
}

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
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const safeGetElement = useCallback((id: string): HTMLElement | null => {
    if (isSSR() || !isMounted) return null;
    try {
      return document.getElementById(id);
    } catch {
      return null;
    }
  }, [isMounted]);

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

  const moveFocus = useCallback((index: number) => {
    if (isSSR() || !isMounted) return;
    const options = getOptions();
    const allOptions = getAllOptions();
    if (options.length === 0) return;

    const newIndex = Math.max(0, Math.min(index, options.length - 1));
    setCurrentFocusIndex(newIndex);

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
        // failed
      }
    }

    const timeoutId = setTimeout(() => {
      moveFocus(initialIndex);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isOpen, selectedValue, getOptions, moveFocus, isMounted]);

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
      return () => {};
    }
  }, [isOpen, handleKeyDown, isMounted]);

  return { 
    currentFocusIndex,
    isMounted,
    getOptions
  };
}`;

const DropdownDemoPage: React.FC<DropdownDemoPageProps> = ({ title }) => {
    useEffect(() => {
        document.title = title;
    }, [title]);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedFruit, setSelectedFruit] = useState<string>("");
    const [isCopied, setIsCopied] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const listboxId = "fruit-dropdown-listbox";

    const { isMounted } = useDropdownKeyboardAccessibility({
        isOpen,
        listboxId,
        onSelect: (value) => {
            setSelectedFruit(value);
            setIsOpen(false);
        },
        onClose: () => setIsOpen(false),
        selectedValue: selectedFruit,
        triggerElementRef: triggerRef as React.RefObject<HTMLElement> // Type assertion for compatibility
    });

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(HOOK_CODE);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node) &&
                listboxRef.current &&
                !listboxRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!isMounted) {
        return null; // Or a skeleton loader
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">
                    Demonstration of accessible Dropdown Menus using a custom hook.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Favorite Fruit</CardTitle>
                    <CardDescription>
                        Select your favorite fruit from the list.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 min-h-[400px]"> {/* Added min-height for dropdown space */}
                    <div className="relative w-64">
                        <label id="fruit-label" className="block text-sm font-medium mb-1">
                            Choose a fruit
                        </label>
                        <Button
                            ref={triggerRef}
                            id="fruit-dropdown-trigger"
                            onClick={toggleDropdown}
                            aria-haspopup="listbox"
                            aria-expanded={isOpen}
                            aria-controls={listboxId}
                            aria-labelledby="fruit-label fruit-dropdown-trigger"
                            variant="outline"
                            className="w-full justify-between"
                        >
                            {selectedFruit || "Select a fruit..."}
                            <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
                        </Button>

                        <ul
                            id={listboxId}
                            ref={listboxRef}
                            role="listbox"
                            aria-labelledby="fruit-label"
                            tabIndex={-1}
                            // Apply inert when closed to hide from accessibility tree and focus order
                            // @ts-ignore - inert is a valid attribute but React types might not include it yet in all versions
                            inert={isOpen ? undefined : ""}
                            className={cn(
                                "absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg",
                                "transition-all duration-200 ease-in-out origin-top",
                                isOpen
                                    ? "opacity-100 scale-100 translate-y-0 visible"
                                    : "opacity-0 scale-95 -translate-y-2 invisible" // Use invisible instead of display:none
                            )}
                        >
                            {fruits.map((fruit) => {
                                const isSelected = selectedFruit === fruit;
                                return (
                                    <li
                                        key={fruit}
                                        role="option"
                                        aria-selected={isSelected}
                                        data-value={fruit}
                                        tabIndex={-1} // Valid roled lists adjust tabindex via JS
                                        onClick={() => {
                                            setSelectedFruit(fruit);
                                            setIsOpen(false);
                                            triggerRef.current?.focus();
                                        }}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 text-sm cursor-pointer select-none outline-none",
                                            "hover:bg-slate-100 focus:bg-slate-100 focus:text-blue-700",
                                            isSelected && "bg-slate-50 text-blue-700 font-medium"
                                        )}
                                    >
                                        {fruit}
                                        {isSelected && <Check className="h-4 w-4" />}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle role="heading" aria-level={2}>Implementation Guide</CardTitle>
                    <CardDescription>
                        Copy this hook to easily implement accessible dropdowns in your project.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative rounded-md bg-slate-950 p-4">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-4 top-4 h-8 w-8 text-slate-400 hover:bg-slate-800 hover:text-white"
                            onClick={handleCopy}
                            aria-label="Copy code"
                        >
                            {isCopied ? (
                                <ClipboardCheck className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                        <pre className="overflow-x-auto">
                            <code className="text-sm font-mono text-slate-50 block leading-relaxed">
                                {HOOK_CODE}
                            </code>
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DropdownDemoPage;
