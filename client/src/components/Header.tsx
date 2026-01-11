import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { SidebarContent } from './Sidebar';
import { Menu } from "lucide-react";

const Header: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-gray-800">
          Accessibility Demo
        </h1>

        <div className="text-sm text-gray-600 mr-4 hidden md:block">
          Hyongsop Kim <a href="mailto:khsruru@gmail.com" className="hover:underline hover:text-gray-900">khsruru@gmail.com</a>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open Menu" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80vw] sm:w-[350px] p-0">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription className="sr-only">Main Navigation Menu</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto">
                <SidebarContent onLinkClick={() => setIsSheetOpen(false)} />
              </div>
              <div className="p-4 border-t text-sm text-gray-600 bg-gray-50">
                Hyongsop Kim<br />
                <a href="mailto:khsruru@gmail.com" className="hover:underline hover:text-gray-900">khsruru@gmail.com</a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header; 