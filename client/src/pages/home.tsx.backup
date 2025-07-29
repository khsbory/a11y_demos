import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      {/* Main Content */}
      <div 
        className={`text-center space-y-6 max-w-md w-full transition-all duration-800 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {/* Main Hello World Text */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight">
            Hello World
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
          Welcome to your new web application
        </p>
        
        {/* Status Indicator */}
        <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-custom"></div>
          <span className="text-sm text-gray-600 font-medium">Ready for development</span>
        </div>
        
        {/* Future Enhancement Placeholder */}
        <div className="pt-6 space-y-3 opacity-50">
          <div className="text-sm text-gray-500">
            Ready for future enhancements
          </div>
          
          {/* Placeholder buttons for future functionality */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled
            >
              Get Started
            </Button>
            <Button 
              variant="outline"
              className="px-6 py-2 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 transition-all duration-200 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">
          Built with modern web technologies
        </p>
      </footer>
    </div>
  );
}
