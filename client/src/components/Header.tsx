import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { SidebarContent } from './Sidebar';
import { Menu } from "lucide-react";

const Header: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm md:hidden">
      <div className="container flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-gray-800">
          Accessibility Demo
        </h1>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80vw] sm:w-[350px] p-0">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription className="sr-only">Main Navigation Menu</SheetDescription>
            </SheetHeader>
            <SidebarContent onLinkClick={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header; 