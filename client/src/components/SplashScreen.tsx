import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

const SplashScreen = () => {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    // Initialize localStorage data
    const initApp = async () => {
      const { initializeDefaultData } = await import('../utils/localStorage');
      initializeDefaultData();
    };
    initApp();

    // Loading animation
    const interval = setInterval(() => {
      setLoading(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/landing'), 200);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/10 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Main Content */}
      <div className="relative z-10 text-center animate-fade-in">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6">
            <div className="text-4xl font-bold text-gradient-primary">SC</div>
          </div>
          <h1 className="text-5xl font-poppins font-bold text-white mb-2">
            SmartCare
          </h1>
          <p className="text-xl text-white/80 font-medium">
            Layanan Profesional Terpercaya
          </p>
        </div>

        {/* Loading Animation */}
        <div className="w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-100"
              style={{ width: `${loading}%` }}
            />
          </div>
          <p className="text-white/70 text-sm font-medium">
            Memuat aplikasi... {Math.round(loading)}%
          </p>
        </div>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/60 text-sm font-medium">
          by SmartCare
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;