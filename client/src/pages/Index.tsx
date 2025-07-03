import { useEffect } from 'react';
import { useLocation } from 'wouter';

const Index = () => {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Redirect to splash screen on first load
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <span className="text-2xl font-bold text-white">SC</span>
        </div>
        <h1 className="text-2xl font-poppins font-bold text-gradient-primary mb-2">SmartCare</h1>
        <p className="text-muted-foreground">Memuat aplikasi...</p>
      </div>
    </div>
  );
};

export default Index;
