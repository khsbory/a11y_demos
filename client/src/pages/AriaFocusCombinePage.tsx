import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageTitle from '@/components/PageTitle';

// Type definition for AriaFocusCombinePage props
type AriaFocusCombinePageProps = {
  title?: string;
};

// Sample transaction data
const transactions = [
  { id: 1, date: '2025-01-15', type: 'deposit', amount: 1500.00, balance: 1500.00 },
  { id: 2, date: '2025-01-18', type: 'withdrawal', amount: 250.00, balance: 1250.00 },
  { id: 3, date: '2025-01-22', type: 'deposit', amount: 750.00, balance: 2000.00 },
  { id: 4, date: '2025-01-25', type: 'withdrawal', amount: 100.00, balance: 1900.00 },
  { id: 5, date: '2025-02-01', type: 'deposit', amount: 500.00, balance: 2400.00 },
  { id: 6, date: '2025-02-05', type: 'withdrawal', amount: 300.00, balance: 2100.00 },
  { id: 7, date: '2025-02-10', type: 'deposit', amount: 1200.00, balance: 3300.00 },
  { id: 8, date: '2025-02-15', type: 'withdrawal', amount: 450.00, balance: 2850.00 },
  { id: 9, date: '2025-02-20', type: 'deposit', amount: 800.00, balance: 3650.00 },
  { id: 10, date: '2025-02-25', type: 'withdrawal', amount: 200.00, balance: 3450.00 }
];

const AriaFocusCombinePage: React.FC<AriaFocusCombinePageProps> = ({ title = "Aria Focus Combine Demo" }) => {
  // Update document title when component mounts
  React.useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <PageTitle level={1} className="border-b pb-2">
            {title}
          </PageTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transaction History Grid */}
          <div className="border-t pt-6">
            <PageTitle level={2} className="mb-4">Transaction History</PageTitle>
            
            {/* Transaction Grid */}
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="grid grid-cols-4 gap-4 p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center text-sm text-gray-600">
                    {transaction.date}
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </span>
                  </div>
                  <div className={`flex items-center justify-end font-medium text-sm ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                  <div className="flex items-center justify-end font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded">
                    ${transaction.balance.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AriaFocusCombinePage;
