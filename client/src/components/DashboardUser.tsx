import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrentUser, setCurrentUser, getUserBalance } from '../utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const DashboardUser = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(getCurrentUser());
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/landing');
      return;
    }
    
    // Load balance
    const userBalance = getUserBalance(user.id);
    setBalance(userBalance);
  }, [user, navigate]);

  const handleLogout = () => {
    setCurrentUser(null);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun"
    });
    navigate('/landing');
  };

  const menuItems = [
    { id: 'order', icon: '📋', title: 'Pesan Layanan', desc: 'Pesan layanan SmartCare', path: '/user-order' },
    { id: 'history', icon: '📦', title: 'Riwayat Pesanan', desc: 'Lihat pesanan Anda', path: '/user-history' },
    { id: 'chat', icon: '💬', title: 'Live Chat', desc: 'Chat dengan admin/mitra', path: '/user-chat' },
    { id: 'mitra', icon: '🧑‍🔧', title: 'Pilih Mitra', desc: 'Lihat daftar mitra', path: '/user-mitras' },
    { id: 'settings', icon: '⚙️', title: 'Setting', desc: 'Pengaturan akun', path: '/user-settings' },
    { id: 'track', icon: '📍', title: 'Lacak Pesanan', desc: 'Status pesanan aktif', path: '/user-history' },
    { id: 'help', icon: '❓', title: 'Bantuan', desc: 'Pusat bantuan', path: '/user-chat' },
    { id: 'promo', icon: '🎁', title: 'Promo', desc: 'Penawaran menarik', path: '/user-history' }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">SC</span>
              </div>
              <div>
                <h1 className="text-xl font-poppins font-bold text-gradient-primary">SmartCare</h1>
                <p className="text-xs text-muted-foreground">Selamat datang, {user.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-primary text-white shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Saldo Anda</p>
                <p className="text-2xl font-bold">Rp {balance.toLocaleString('id-ID')}</p>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/user-topup')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                💳 TOP-UP
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Grid */}
        <div className="grid grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <Card 
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-all hover:scale-105"
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-xs font-medium text-foreground mb-1">{item.title}</h3>
                <p className="text-[10px] text-muted-foreground leading-tight">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Aksi Cepat</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="h-16 flex-col border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => navigate('/user-order')}
            >
              <span className="text-lg mb-1">💆</span>
              <span className="text-xs">Massage</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 flex-col border-secondary text-secondary hover:bg-secondary hover:text-white"
              onClick={() => navigate('/user-order')}
            >
              <span className="text-lg mb-1">💇</span>
              <span className="text-xs">Barber</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 flex-col border-accent text-accent hover:bg-accent hover:text-white"
              onClick={() => navigate('/user-order')}
            >
              <span className="text-lg mb-1">🧹</span>
              <span className="text-xs">Clean</span>
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-4 text-center">
            <h4 className="font-medium text-foreground mb-2">🎉 Promo Spesial!</h4>
            <p className="text-sm text-muted-foreground">
              Dapatkan diskon 20% untuk pengguna baru. Berlaku hingga akhir bulan!
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-6 border-t bg-muted/30">
        <div className="max-w-md mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>📧 id.smartprobyarvin@gmail.com</p>
          <p>📱 081299660660</p>
          <p className="mt-2 text-xs">by SmartCare</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardUser;