import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

// Type definition for children prop
type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 md:grid md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr]">
      {/* Header - First in DOM order for accessibility */}
      <div className="sticky top-0 z-50 md:col-start-2 md:row-start-1">
        <Header />
      </div>

      {/* Sidebar - Second in DOM order */}
      <Sidebar className="hidden md:block w-72 h-screen sticky top-0 md:col-start-1 md:row-start-1 md:row-span-2 border-r bg-white" />

      {/* Main Content - Third in DOM order */}
      <main className="flex-1 overflow-auto md:col-start-2 md:row-start-2">
        {children}
      </main>
    </div>
  );
};

export default Layout; 