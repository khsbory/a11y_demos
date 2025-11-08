import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const menuItems = [
    { title: 'VoiceOver Focus Movement Demo', href: '/' },
    { title: 'aria-modal true test', href: '/aria-modal-test' },
    { title: 'tab & radio', href: '/tab-radio' },
    { title: 'aria-focus-combine', href: '/aria-focus-combine' },
    { title: 'role alert demo', href: '/role-alert-demo' },
    { title: 'role switch & aria-pressed', href: '/role-switch-pressed' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Web Accessibility Demo
        </h1>

        <nav className="hidden md:flex space-x-6">
          {menuItems.map((item) => {
            const isCurrentPage = location === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`font-medium transition-colors hover:text-blue-800 ${
                  isCurrentPage ? 'text-blue-800 font-semibold' : 'text-blue-600'
                }`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {item.title}
              </Link>
            );
          })}
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
            {menuItems.map((item) => {
              const isCurrentPage = location === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`block font-medium w-full text-center hover:text-blue-800 ${
                    isCurrentPage ? 'text-blue-800 font-semibold' : 'text-blue-600'
                  }`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header; 