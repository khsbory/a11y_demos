import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageTitle from '@/components/PageTitle';
import TabContainer from '@/components/TabContainer';
import ProductList from '@/components/ProductList';

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

  // 탭 데이터 정의
  const tabs = [
    {
      id: 'no-accessibility',
      label: 'Default (iOS Fragmentation)',
      content: <ProductList accessibilityLevel="none" />
    },
    {
      id: 'with-role-text',
      label: 'With Role Text',
      content: <ProductList accessibilityLevel="role-text" />
    },
    {
      id: 'with-aria-label',
      label: 'With Aria Label',
      content: <ProductList accessibilityLevel="aria-label" />
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <PageTitle level={1} className="border-b pb-2">
            {title}
          </PageTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            This demo illustrates a fragmentation behavior specific to <strong>iOS VoiceOver</strong> (tested on iOS 26.2).
            Note that this behavior does not occur with VoiceOver on macOS Safari.
            Please navigate through each tab to observe how focus moves between multiple styled elements.
          </p>

          <div className="border-t pt-6">
            <PageTitle level={3} className="mb-4">Demo Area</PageTitle>
            <TabContainer
              tabs={tabs}
              defaultActiveTab="no-accessibility"
              onTabChange={(tabId) => console.log('Active tab changed to:', tabId)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPage; 