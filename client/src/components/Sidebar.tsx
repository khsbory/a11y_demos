import React from 'react';
import { Link, useLocation } from 'wouter';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const menuGroups = [
    {
        title: "Navigation & Flow",
        items: [
            { title: "VoiceOver Focus Movement", href: "/" },
            { title: "Step Indicator Demo", href: "/step-indicator" },
        ]
    },
    {
        title: "Content & Typography",
        items: [
            { title: "List Styles", href: "/list-styles" },
        ]
    },
    {
        title: "Focus & ARIA",
        items: [
            { title: "ARIA Modal True Test", href: "/aria-modal-test" },
            { title: "ARIA Focus Combine", href: "/aria-focus-combine" },
            { title: "Role Switch & Pressed", href: "/role-switch-pressed" },
        ]
    },
    {
        title: "Form Elements",
        items: [
            { title: "Dropdown Menu", href: "/dropdown-demo" },
        ]
    },
    {
        title: "UI Components",
        items: [
            { title: "Tab & Radio Demo", href: "/tab-radio" },
            { title: "Cart Button Demo", href: "/cart-button-demo" },
            { title: "Role Alert Demo", href: "/role-alert-demo" },
            { title: "Radio Group Test Demo", href: "/radio-group-test" },
            { title: "Card Navigation", href: "/card-navigation" },
        ]
    }
];

type SidebarProps = {
    className?: string;
    onLinkClick?: () => void;
};

export const SidebarContent: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => {
    const [location] = useLocation();

    return (
        <div className="py-4">
            <div className="px-4 mb-4">
                <h2 className="text-lg font-bold tracking-tight">Documentation</h2>
            </div>
            <Accordion type="single" collapsible className="w-full px-2">
                {menuGroups.map((group, index) => (
                    <AccordionItem value={group.title} key={group.title} className="border-b-0">
                        <AccordionTrigger className="px-2 py-2 text-sm font-semibold hover:no-underline hover:bg-slate-100 rounded-md">
                            {group.title}
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-2">
                            <div className="flex flex-col space-y-1">
                                {group.items.map((item) => {
                                    const isActive = location === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onLinkClick}
                                            className={cn(
                                                "block px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-slate-100",
                                                isActive ? "bg-slate-100 text-blue-700" : "text-slate-600"
                                            )}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    return (
        <div className={cn("pb-12 border-r bg-white", className)}>
            <ScrollArea className="h-full py-2">
                <SidebarContent />
            </ScrollArea>
        </div>
    );
};

export default Sidebar;
