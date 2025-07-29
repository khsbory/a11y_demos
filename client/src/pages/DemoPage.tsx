import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Type definition for DemoPage props
type DemoPageProps = {
  title?: string;
};

const DemoPage: React.FC<DemoPageProps> = ({ title = "VoiceOver Focus Movement Demo" }) => {
  // Update document title when component mounts
  useEffect(() => {
    console.log("DemoPage: Setting document title to:", title);
    document.title = title;
  }, [title]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold border-b pb-2">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            This area will contain demo content that reproduces the phenomenon where iOS VoiceOver 
            separates focus when there are multiple styled child elements (e.g., &lt;strong&gt;, &lt;span&gt;) 
            inside an &lt;a&gt; tag, causing each element to be read separately.
          </p>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Demo Area</h3>
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-600 italic">
                (Demo UI implementation will be placed here)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPage; 