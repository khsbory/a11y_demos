import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/PageTitle';

// Type definition for AriaModalTestPage props
type AriaModalTestPageProps = {
  title?: string;
};

const AriaModalTestPage: React.FC<AriaModalTestPageProps> = ({ 
  title = "Aria Modal True Test" 
}) => {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setLocation] = useLocation();

  // Update document title when component mounts and open modal automatically
  useEffect(() => {
    console.log("AriaModalTestPage: Setting document title to:", title);
    document.title = title;
    // Open modal automatically when page loads
    setIsModalOpen(true);
  }, [title]);

  // Handle modal close and navigate back to home
  const handleModalClose = () => {
    setIsModalOpen(false);
    setLocation('/');
  };

  return (
    <>
      {/* Advertisement Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]" aria-modal="true">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2">
              🎉 Special Offer - Limited Time Only! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Don't miss out on this incredible opportunity
            </DialogDescription>
          </DialogHeader>
          
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

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleModalClose} 
              variant="outline" 
              className="w-full sm:w-auto"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={handleModalClose}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              Get Course Now! 🎯
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <p className="text-gray-600 italic">
                  The modal advertisement should appear automatically when you visit this page. 
                  Closing the modal will redirect you back to the main page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AriaModalTestPage;
