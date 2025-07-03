import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrentUser, setCurrentUser, getMitraBalance, getBlockedAccounts } from '../utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const DashboardMitra = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(getCurrentUser());
  const [balance, setBalance] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'mitra') {
      navigate('/landing');
      return;
    }
    
    // Load balance
    const mitraBalance = getMitraBalance(user.id);
    setBalance(mitraBalance);

    // Check if blocked
    const blockedAccounts = getBlockedAccounts();
    setIsBlocked(blockedAccounts.includes(user.id));
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
    { id: 'incoming', icon: '📥', title: 'Pesanan Masuk', desc: 'Pesanan baru', path: '/mitra-incoming' },
    { id: 'working', icon: '🛠️', title: 'Sedang Dikerjakan', desc: 'Pesanan aktif', path: '/mitra-active' },
    { id: 'history', icon: '📦', title: 'Riwayat Pekerjaan', desc: 'Pekerjaan selesai', path: '/mitra-history' },
    { id: 'chat', icon: '💬', title: 'Live Chat', desc: 'Chat dengan user', path: '/mitra-chat' },
    { id: 'topup', icon: '💳', title: 'Top-Up Saldo', desc: 'Isi saldo akun', path: '/mitra-topup' },
    { id: 'stats', icon: '📊', title: 'Statistik', desc: 'Laporan kinerja', path: '/mitra-stats' },
    { id: 'invoice', icon: '🧾', title: 'Invoice', desc: 'Tagihan & pembayaran', path: '/mitra-invoice' },
    { id: 'profile', icon: '👤', title: 'Profil', desc: 'Data pribadi', path: '/mitra-profile' },
    { id: 'guide', icon: '📚', title: 'Panduan', desc: 'Panduan mitra', path: '/mitra-guide' },
    { id: 'blocked', icon: '🚫', title: 'Akun Terkunci', desc: 'Status blokir', path: '/mitra-blocked' },
    { id: 'reviews', icon: '🎓', title: 'Ulasan', desc: 'Rating & ulasan', path: '/mitra-reviews' },
    { id: 'settings', icon: '⚙️', title: 'Pengaturan', desc: 'Setelan akun', path: '/mitra-settings' }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Blocked Account Popup */}
      {isBlocked && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-lg font-semibold text-destructive mb-2">Akun Terkunci</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Akun Anda sementara dikunci. Silakan hubungi admin untuk informasi lebih lanjut.
              </p>
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/mitra-chat')}
                >
                  💬 Chat Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setIsBlocked(false)}
                >
                  Tutup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">🧑‍🔧</span>
              </div>
              <div>
                <h1 className="text-xl font-poppins font-bold text-gradient-primary">SmartCare</h1>
                <p className="text-xs text-muted-foreground">Mitra: {user.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Balance & Top-up */}
        <div className="flex gap-3 mb-6">
          <Card className="flex-1 bg-gradient-secondary text-white shadow-glow">
            <CardContent className="p-4">
              <p className="text-white/80 text-xs">Saldo Mitra</p>
              <p className="text-xl font-bold">Rp {balance.toLocaleString('id-ID')}</p>
            </CardContent>
          </Card>
          
          <Button 
            className="px-6 bg-gradient-primary hover:opacity-90"
            onClick={() => navigate('/mitra-topup')}
          >
            💳 TOP-UP
          </Button>
        </div>

        {/* Menu Grid 4x3 */}
        <div className="grid grid-cols-4 gap-3">
          {menuItems.map((item) => (
            <Card 
              key={item.id}
              className={`cursor-pointer hover:shadow-md transition-all hover:scale-105 ${
                item.id === 'blocked' && isBlocked ? 'bg-destructive/10 border-destructive' : ''
              }`}
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-3 text-center">
                <div className="text-xl mb-1">{item.icon}</div>
                <h3 className="text-[10px] font-medium text-foreground mb-1 leading-tight">{item.title}</h3>
                <p className="text-[8px] text-muted-foreground leading-tight">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Cards */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Status Hari Ini</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-3 text-center">
                <div className="text-xl text-primary">📥</div>
                <p className="text-lg font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground">Pesanan Baru</p>
              </CardContent>
            </Card>
            
            <Card className="bg-warning/10 border-warning/20">
              <CardContent className="p-3 text-center">
                <div className="text-xl text-warning">🛠️</div>
                <p className="text-lg font-bold text-warning">0</p>
                <p className="text-xs text-muted-foreground">Sedang Proses</p>
              </CardContent>
            </Card>
            
            <Card className="bg-success/10 border-success/20">
              <CardContent className="p-3 text-center">
                <div className="text-xl text-success">✅</div>
                <p className="text-lg font-bold text-success">0</p>
                <p className="text-xs text-muted-foreground">Selesai</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-medium text-foreground mb-2">📋 Catatan Penting</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Saldo minimal Rp10.000 untuk menerima pesanan</li>
              <li>• Potongan 25% dari tarif setelah pekerjaan selesai</li>
              <li>• Hubungi admin jika ada kendala</li>
            </ul>
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

export default DashboardMitra;