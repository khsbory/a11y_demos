import React, { useEffect, useState, useMemo, useRef, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/PageTitle';
import TabContainer from '@/components/TabContainer';

// Type definition for RoleAlertDemoPage props
type RoleAlertDemoPageProps = {
  title?: string;
};

// Message type
type Message = {
  id: number;
  text: string;
  isAgent: boolean;
};

// Separate component for tab content with aria-label
type WithAriaLabelContentProps = {
  messages: Message[];
  buttonRef: React.RefObject<HTMLButtonElement>;
  onAddMessage: () => void;
};

const WithAriaLabelContent = memo<WithAriaLabelContentProps>(({ messages, buttonRef, onAddMessage }) => (
  <div className="relative pb-20">
    <div className="space-y-3 p-4 min-h-[300px]">
      {messages.length === 0 && (
        <p className="text-gray-400 text-center py-8">No messages yet. Click the button below to add messages.</p>
      )}
      {messages.map((message) => (
        <div
          key={message.id}
          role="alert"
          className={`p-4 rounded-lg ${
            message.isAgent
              ? 'bg-blue-100 text-blue-900 ml-auto max-w-[80%]'
              : 'bg-gray-100 text-gray-900 mr-auto max-w-[80%]'
          }`}
        >
          <div
            role="heading"
            aria-level={2}
            aria-label={`Message ${message.id} - ${message.isAgent ? 'Agent Message' : 'Customer Message'}`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
      <div className="container mx-auto">
        <Button 
          ref={buttonRef}
          onClick={onAddMessage}
          className="w-full md:w-auto"
        >
          Add Test Message
        </Button>
      </div>
    </div>
  </div>
));

WithAriaLabelContent.displayName = 'WithAriaLabelContent';

// Separate component for tab content without aria-label
type WithoutAriaLabelContentProps = {
  messages: Message[];
  buttonRef: React.RefObject<HTMLButtonElement>;
  onAddMessage: () => void;
};

const WithoutAriaLabelContent = memo<WithoutAriaLabelContentProps>(({ messages, buttonRef, onAddMessage }) => (
  <div className="relative pb-20">
    <div className="space-y-3 p-4 min-h-[300px]">
      {messages.length === 0 && (
        <p className="text-gray-400 text-center py-8">No messages yet. Click the button below to add messages.</p>
      )}
      {messages.map((message) => (
        <div
          key={message.id}
          role="alert"
          className={`p-4 rounded-lg ${
            message.isAgent
              ? 'bg-blue-100 text-blue-900 ml-auto max-w-[80%]'
              : 'bg-gray-100 text-gray-900 mr-auto max-w-[80%]'
          }`}
        >
          <div
            role="heading"
            aria-level={2}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
      <div className="container mx-auto">
        <Button 
          ref={buttonRef}
          onClick={onAddMessage}
          className="w-full md:w-auto"
        >
          Add Test Message
        </Button>
      </div>
    </div>
  </div>
));

WithoutAriaLabelContent.displayName = 'WithoutAriaLabelContent';

const RoleAlertDemoPage: React.FC<RoleAlertDemoPageProps> = ({ title = "Role Alert Demo" }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update document title when component mounts
  useEffect(() => {
    console.log("RoleAlertDemoPage: Setting document title to:", title);
    document.title = title;
  }, [title]);

  // Add test message handler (useCallback으로 메모이제이션)
  const addTestMessage = useCallback(() => {
    const newCount = messageCount + 1;
    const isAgent = Math.random() > 0.5; // Random agent or customer
    const newMessage: Message = {
      id: newCount,
      text: `test ${newCount}`,
      isAgent: isAgent
    };
    setMessages([...messages, newMessage]);
    setMessageCount(newCount);
    
    // Restore focus to button after state update
    setTimeout(() => {
      buttonRef.current?.focus();
    }, 0);
  }, [messages, messageCount]);

  // 탭 데이터 정의 (useMemo로 메모이제이션하여 불필요한 리렌더링 방지)
  const tabs = useMemo(() => [
    {
      id: 'with-aria-label',
      label: 'Role Alert with aria-label',
      content: <WithAriaLabelContent messages={messages} buttonRef={buttonRef} onAddMessage={addTestMessage} />
    },
    {
      id: 'no-aria-label',
      label: 'Role Alert with no aria-label',
      content: <WithoutAriaLabelContent messages={messages} buttonRef={buttonRef} onAddMessage={addTestMessage} />
    }
  ], [messages, addTestMessage]); // messages와 addTestMessage가 변경될 때만 재생성

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
            This demo shows the difference between role="alert" with and without aria-label for screen reader accessibility.
          </p>
          
          <div className="border-t pt-6">
            <div className="sticky top-0 bg-white z-10 pb-2">
              <TabContainer 
                tabs={tabs}
                defaultActiveTab="with-aria-label"
                onTabChange={(tabId) => console.log('Active tab changed to:', tabId)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleAlertDemoPage;

