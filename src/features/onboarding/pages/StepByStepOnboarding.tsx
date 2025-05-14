
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import CustomerManagement from '../components/CustomerManagement';
import InventoryManagement from '../components/InventoryManagement';
import CompanySettings from '../components/CompanySettings';
import UserManagement from '../components/UserManagement';
import { useToast } from '@/hooks/use-toast';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  {
    id: 'company',
    title: 'Company Information',
    description: 'Set up your company details',
    component: CompanySettings,
  },
  {
    id: 'users',
    title: 'User Management',
    description: 'Add users and set permissions',
    component: UserManagement,
  },
  {
    id: 'inventory',
    title: 'Inventory Setup',
    description: 'Add your products and categories',
    component: InventoryManagement,
  },
  {
    id: 'customers',
    title: 'Customer Management',
    description: 'Add your customers',
    component: CustomerManagement,
  },
];

const StepByStepOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // All steps completed
      toast({
        title: "Setup complete!",
        description: "Your business setup is complete. You can now start using the system.",
      });
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: `${steps[currentStep].title} have been saved successfully.`,
    });
    
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Business Setup</h1>
        
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm font-medium">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8">
          {steps.map((step, idx) => (
            <Button
              key={step.id}
              variant={idx === currentStep ? "default" : "outline"}
              onClick={() => setCurrentStep(idx)}
              className="flex items-center gap-2"
              disabled={!completedSteps.includes(idx) && idx > currentStep}
            >
              {completedSteps.includes(idx) ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
              )}
              {step.title}
            </Button>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent onSave={handleSave} />
          </CardContent>
          <CardFooter className="flex justify-between pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={16} className="mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleNext}
            >
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ChevronRight size={16} className="ml-2" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StepByStepOnboarding;
