import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">SC</span>
              </div>
              <h1 className="text-2xl font-poppins font-bold text-gradient-primary">
                SmartCare
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-poppins font-bold text-foreground mb-3">
            Selamat Datang di SmartCare
          </h2>
          <p className="text-muted-foreground text-lg">
            Platform layanan profesional terpercaya untuk kebutuhan harian Anda
          </p>
        </div>

        {/* Promo Banner */}
        <Card className="bg-gradient-primary p-6 mb-8 shadow-glow animate-slide-up">
          <div className="text-center text-white">
            <h3 className="text-xl font-poppins font-semibold mb-2">🎉 Promo Spesial!</h3>
            <p className="text-white/90 mb-3">
              Dapatkan diskon 20% untuk pengguna baru
            </p>
            <p className="text-sm text-white/80">
              *Berlaku untuk semua layanan SmartCare
            </p>
          </div>
        </Card>

        {/* Services Preview */}
        <div className="mb-8">
          <h3 className="text-xl font-poppins font-semibold text-foreground mb-4 text-center">
            Layanan Kami
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center hover:shadow-md transition-all">
              <div className="text-3xl mb-2">💆</div>
              <p className="text-sm font-medium text-foreground">SmartMassage</p>
              <p className="text-xs text-muted-foreground">Pijat Urut</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-md transition-all">
              <div className="text-3xl mb-2">💇</div>
              <p className="text-sm font-medium text-foreground">SmartBarber</p>
              <p className="text-xs text-muted-foreground">Potong Rambut</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-md transition-all">
              <div className="text-3xl mb-2">🧹</div>
              <p className="text-sm font-medium text-foreground">SmartClean</p>
              <p className="text-xs text-muted-foreground">Bersih Rumah</p>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 animate-slide-up">
          <Link to="/login" className="block">
            <Button className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-all shadow-md">
              🔐 Masuk ke Akun
            </Button>
          </Link>
          
          <div className="grid grid-cols-2 gap-4">
            <Link to="/register-user" className="block">
              <Button variant="outline" className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-white transition-all">
                👤 Daftar User
              </Button>
            </Link>
            
            <Link to="/register-mitra" className="block">
              <Button variant="outline" className="w-full h-12 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all">
                🧑‍🔧 Daftar Mitra
              </Button>
            </Link>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p className="mb-2">Butuh bantuan?</p>
          <div className="space-y-1">
            <p>📧 id.smartprobyarvin@gmail.com</p>
            <p>📱 081299660660</p>
            <p>📍 Kab. Bandung - Jawa Barat</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-6 border-t bg-muted/30">
        <div className="max-w-md mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 SmartCare. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            by SmartCare
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;