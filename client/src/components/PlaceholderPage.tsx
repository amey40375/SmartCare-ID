import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrentUser } from '../utils/localStorage';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: string;
  backPath?: string;
}

const PlaceholderPage = ({ title, description, icon, backPath }: PlaceholderPageProps) => {
  const [, navigate] = useLocation();
  const user = getCurrentUser();

  const getDefaultBackPath = () => {
    if (!user) return '/landing';
    switch (user.role) {
      case 'admin': return '/dashboard-admin';
      case 'mitra': return '/dashboard-mitra';
      case 'user': return '/dashboard-user';
      default: return '/landing';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(backPath || getDefaultBackPath())}
              >
                ← Kembali
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">SC</span>
              </div>
              <span className="font-semibold text-foreground">SmartCare</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">{icon}</div>
            <h1 className="text-2xl font-poppins font-bold text-foreground mb-4">
              {title}
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {description}
            </p>
            
            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={() => navigate(backPath || getDefaultBackPath())}
              >
                Kembali ke Dashboard
              </Button>
              
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground mb-2">🚧 Status Pengembangan</h3>
                  <p className="text-sm text-muted-foreground">
                    Fitur ini sedang dalam tahap pengembangan dan akan segera tersedia dalam update mendatang.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Butuh bantuan atau ada pertanyaan?</p>
          <div className="mt-2 space-y-1">
            <p>📧 id.smartprobyarvin@gmail.com</p>
            <p>📱 081299660660</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-6 border-t bg-muted/30">
        <div className="max-w-md mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 SmartCare. All rights reserved.</p>
          <p className="text-xs mt-1">by SmartCare</p>
        </div>
      </footer>
    </div>
  );
};

export default PlaceholderPage;