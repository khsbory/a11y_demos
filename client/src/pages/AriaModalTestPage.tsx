import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/PageTitle';

// Type definition for AriaModalTestPage props
type AriaModalTestPageProps = {
  title?: string;
};

const AriaModalTestPage: React.FC<AriaModalTestPageProps> = ({ 
  title = "Aria Modal True Test" 
}) => {
  // State for modal visibility and animations
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal display and animations
  const [isAnimating, setIsAnimating] = useState(false); // Prevents multiple animation triggers
  const [, setLocation] = useLocation();
  const maybeLaterButtonRef = useRef<HTMLButtonElement>(null);

  // Update document title when component mounts and open modal automatically
  useEffect(() => {
    console.log("AriaModalTestPage: Setting document title to:", title);
    document.title = title;
    
    // Open modal automatically when page loads with smooth animation (display-based)
    setTimeout(() => {
      setIsModalOpen(true); // Show modal with display: flex + animations
    }, 10);
  }, [title]);

  // Focus on Maybe Later button when modal opens
  useEffect(() => {
    if (isModalOpen && maybeLaterButtonRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        maybeLaterButtonRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  // Handle modal open with smooth animation (display-based)
  const handleModalOpen = () => {
    if (isAnimating) return; // Prevent multiple triggers during animation
    
    setIsAnimating(true);
    setIsModalOpen(true); // Show modal with display: flex + animations
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Handle modal close with fade out animation (display-based)
  const handleModalClose = () => {
    if (isAnimating) return; // Prevent multiple triggers during animation
    
    setIsAnimating(true);
    setIsModalOpen(false); // Hide modal with display: none + close animations
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Handle navigation back to home (separate function)
  const handleGoHome = () => {
    setLocation('/');
  };

  return (
    <>
      {/* Advertisement Modal using React Portal - Always in DOM */}
      {createPortal(
        <div 
          className={`fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4 ${
            isModalOpen ? 'animate-fadeIn' : 'animate-fadeOut'
          }`}
          style={{ display: isModalOpen ? 'flex' : 'none' }}
          onClick={handleModalClose}
        >
          <div 
            className={`bg-white rounded-lg shadow-lg w-full max-w-[600px] mx-auto transform transition-all duration-300 ease-out ${
              isModalOpen ? 'animate-slideIn' : 'animate-slideOut'
            }`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
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
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-6">
              <div className="text-center mb-4">
                <h2 id="modal-title" className="text-2xl font-bold text-center mb-2">
                  🎉 Special Offer - Limited Time Only! 🎉
                </h2>
                <p id="modal-description" className="text-center text-lg">
                  Don't miss out on this incredible opportunity
                </p>
              </div>
              
              <div className="py-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-blue-300">
                  <h3 className="text-xl font-semibold text-center mb-4 text-blue-800">
                    🚀 Premium Web Accessibility Course
                  </h3>
                  
                  <div className="space-y-4 text-gray-700">
                    <p className="text-center">
                      <strong>Learn ARIA patterns, screen reader optimization, and keyboard navigation!</strong>
                    </p>
                    
                    <div className="flex justify-center space-x-8 my-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600 line-through">$199</div>
                        <div className="text-sm text-gray-500">Regular Price</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600">$49</div>
                        <div className="text-sm text-green-600 font-semibold">75% OFF Today!</div>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        20+ hours of video content
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Hands-on ARIA implementation projects
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Screen reader testing techniques
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Lifetime access & updates
                      </li>
                    </ul>
                    
                    <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300 mt-4">
                      <p className="text-yellow-800 text-sm text-center font-semibold">
                        ⏰ Only 6 hours left at this price!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button 
                  ref={maybeLaterButtonRef}
                  onClick={handleModalClose} 
                  variant="outline" 
                  className="w-full sm:w-auto"
                >
                  Maybe Later
                </Button>
                <Button 
                  onClick={handleGoHome}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  Get Course Now! 🎯
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Main Page Content (shown when modal is closed) */}
      <div className="container mx-auto p-4 md:p-8">
        <PageTitle level={1} className="mb-6 text-center">
          {title}
        </PageTitle>
        
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold border-b pb-2">
              Test Overview
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              This page is designed to test the aria-modal="true" attribute functionality.
            </p>
            
            <div className="border-t pt-6">
              <PageTitle level={3} className="mb-4">
                Test Area
              </PageTitle>
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-gray-600 italic mb-4">
                  The modal advertisement should appear automatically when you visit this page. 
                  You can close it and reopen it using the button below, or navigate back to home.
                </p>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button
                    onClick={handleModalOpen}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    🎯 Show Advertisement Modal Again
                  </Button>
                  <Button
                    onClick={handleGoHome}
                    variant="outline"
                    className="border-gray-300"
                  >
                    🏠 Back to Home
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AriaModalTestPage;
