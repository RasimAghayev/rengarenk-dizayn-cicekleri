
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate login - replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      // Redirect would happen here
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `Logging in with ${provider}...`,
    });
    // Implement actual social login logic here
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline" 
            type="button" 
            className="flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin('Google')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
              <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970244 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
              <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
              <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
            </svg>
            <span>Google</span>
          </Button>
          
          <Button 
            variant="outline" 
            type="button" 
            className="flex items-center justify-center gap-2" 
            onClick={() => handleSocialLogin('Facebook')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#1877F2" d="M24,12.073c0,-6.627 -5.373,-12 -12,-12c-6.627,0 -12,5.373 -12,12c0,5.99 4.388,10.954 10.125,11.854l0,-8.385l-3.047,0l0,-3.469l3.047,0l0,-2.642c0,-3.007 1.792,-4.669 4.533,-4.669c1.312,0 2.686,0.235 2.686,0.235l0,2.953l-1.514,0c-1.491,0 -1.956,0.925 -1.956,1.874l0,2.25l3.328,0l-0.532,3.469l-2.796,0l0,8.385c5.737,-0.9 10.125,-5.864 10.125,-11.854Z"/>
              <path fill="#FFFFFF" d="M16.671,15.542l0.532,-3.469l-3.328,0l0,-2.25c0,-0.949 0.465,-1.874 1.956,-1.874l1.514,0l0,-2.953c0,0 -1.374,-0.235 -2.686,-0.235c-2.741,0 -4.533,1.662 -4.533,4.669l0,2.642l-3.047,0l0,3.469l3.047,0l0,8.385c0.611,0.096 1.24,0.145 1.875,0.145c0.635,0 1.264,-0.05 1.875,-0.145l0,-8.385l2.796,0Z"/>
            </svg>
            <span>Facebook</span>
          </Button>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => window.history.back()} className="w-full mr-2">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
