import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: string[] = ['VoiceOver Focus Movement Demo'];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Web Accessibility Demo
        </h1>

        <nav className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-blue-600 font-medium transition-colors"
              aria-current="page"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              ></path>
            </svg>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col items-center p-4 space-y-4">
            {menuItems.map((item) => (
              <a
                key={item}
                href="#"
                className="block text-blue-600 font-medium w-full text-center"
                aria-current="page"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header; 