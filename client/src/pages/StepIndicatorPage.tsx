import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageTitle from '@/components/PageTitle';

// Type definition for StepIndicatorPage props
type StepIndicatorPageProps = {
  title?: string;
};

// Step type definition
type Step = {
  id: number;
  label: string;
};

// Define shopping process steps
const steps: Step[] = [
  { id: 1, label: 'Cart Review' },
  { id: 2, label: 'Order/Shipping Information' },
  { id: 3, label: 'Discount/Points Application' },
  { id: 4, label: 'Payment Method Selection' },
  { id: 5, label: 'Order Complete' }
];

const StepIndicatorPage: React.FC<StepIndicatorPageProps> = ({
  title = "Step Indicator Demo"
}) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [currentStep, setCurrentStep] = useState(1);

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <PageTitle level={1} className="border-b pb-2">
            {title}
          </PageTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Simple ul/li list with aria-current */}
          <ul role="list" className="space-y-4">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <li
                  key={step.id}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    isCompleted
                      ? 'bg-green-100 text-green-900'
                      : isCurrent
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {/* Step number */}
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold">
                    {step.id}
                  </span>

                  {/* Step label */}
                  <span className="font-medium">{step.label}</span>
                </li>
              );
            })}
          </ul>

          {/* Simple navigation buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepIndicatorPage;
