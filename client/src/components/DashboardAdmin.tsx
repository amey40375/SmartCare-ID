import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrentUser, setCurrentUser, getMitraApplications, getTopUpRequests, getOrders } from '../utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const DashboardAdmin = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(getCurrentUser());
  const [pendingApplications, setPendingApplications] = useState(0);
  const [pendingTopUps, setPendingTopUps] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/landing');
      return;
    }
    
    // Load statistics
    const applications = getMitraApplications();
    const pending = applications.filter(app => app.status === 'pending');
    setPendingApplications(pending.length);

    const topups = getTopUpRequests();
    const pendingTopups = topups.filter(req => req.status === 'pending');
    setPendingTopUps(pendingTopups.length);

    const orders = getOrders();
    setTotalOrders(orders.length);
  }, [user, navigate]);

  const handleLogout = () => {
    setCurrentUser(null);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun admin"
    });
    navigate('/landing');
  };

  const menuItems = [
    { 
      id: 'verify', 
      icon: '✅', 
      title: 'Verifikasi Mitra', 
      desc: 'Verifikasi pendaftar', 
      path: '/admin-verify',
      badge: pendingApplications > 0 ? pendingApplications : null
    },
    { id: 'users', icon: '👥', title: 'Data Mitra & User', desc: 'Kelola akun pengguna', path: '/admin-users' },
    { 
      id: 'topup', 
      icon: '💸', 
      title: 'Konfirmasi Top-Up', 
      desc: 'Proses permintaan saldo', 
      path: '/admin-topup',
      badge: pendingTopUps > 0 ? pendingTopUps : null
    },
    { id: 'transfer', icon: '🔁', title: 'Kirim Saldo', desc: 'Transfer saldo manual', path: '/admin-transfer' },
    { id: 'orders', icon: '📦', title: 'Riwayat Pesanan', desc: 'Semua transaksi', path: '/admin-orders' },
    { id: 'block', icon: '⛔', title: 'Blokir / Buka Mitra', desc: 'Kelola status akun', path: '/admin-block' },
    { id: 'reports', icon: '🧾', title: 'Laporan', desc: 'Laporan sistem', path: '/admin-reports' },
    { id: 'settings', icon: '⚙️', title: 'Pengaturan', desc: 'Setelan sistem', path: '/admin-settings' }
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
                <span className="text-lg font-bold text-white">👨‍💼</span>
              </div>
              <div>
                <h1 className="text-xl font-poppins font-bold text-gradient-primary">SmartCare Admin</h1>
                <p className="text-xs text-muted-foreground">Dashboard Administrator</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-3 text-center">
              <div className="text-xl text-primary">👥</div>
              <p className="text-lg font-bold text-primary">0</p>
              <p className="text-xs text-muted-foreground">Total User</p>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="p-3 text-center">
              <div className="text-xl text-secondary">🧑‍🔧</div>
              <p className="text-lg font-bold text-secondary">0</p>
              <p className="text-xs text-muted-foreground">Mitra Aktif</p>
            </CardContent>
          </Card>
          
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-3 text-center">
              <div className="text-xl text-accent">📦</div>
              <p className="text-lg font-bold text-accent">{totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Order</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Grid 4x2 */}
        <div className="grid grid-cols-4 gap-3">
          {menuItems.map((item) => (
            <Card 
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-all hover:scale-105 relative"
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-3 text-center">
                <div className="text-xl mb-1">{item.icon}</div>
                <h3 className="text-[10px] font-medium text-foreground mb-1 leading-tight">{item.title}</h3>
                <p className="text-[8px] text-muted-foreground leading-tight">{item.desc}</p>
                
                {/* Badge for pending items */}
                {item.badge && (
                  <div className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Actions */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Tindakan Diperlukan</h3>
          
          {pendingApplications > 0 && (
            <Card className="bg-warning/10 border-warning/20 cursor-pointer" onClick={() => navigate('/admin-verify')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-warning">✅ Verifikasi Mitra</h4>
                    <p className="text-sm text-muted-foreground">
                      {pendingApplications} pendaftar menunggu verifikasi
                    </p>
                  </div>
                  <div className="text-2xl text-warning">→</div>
                </div>
              </CardContent>
            </Card>
          )}

          {pendingTopUps > 0 && (
            <Card className="bg-primary/10 border-primary/20 cursor-pointer" onClick={() => navigate('/admin-topup')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-primary">💸 Konfirmasi Top-Up</h4>
                    <p className="text-sm text-muted-foreground">
                      {pendingTopUps} permintaan top-up menunggu
                    </p>
                  </div>
                  <div className="text-2xl text-primary">→</div>
                </div>
              </CardContent>
            </Card>
          )}

          {pendingApplications === 0 && pendingTopUps === 0 && (
            <Card className="bg-success/10 border-success/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-success mb-2">✅</div>
                <h4 className="font-medium text-success">Semua Tugas Selesai</h4>
                <p className="text-sm text-muted-foreground">
                  Tidak ada tindakan yang diperlukan saat ini
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Aksi Cepat</h3>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => navigate('/admin-transfer')}
            >
              <span className="text-lg mr-3">🔁</span>
              <div className="text-left">
                <div className="font-medium">Kirim Saldo</div>
                <div className="text-xs text-muted-foreground">Transfer manual ke user/mitra</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 border-secondary text-secondary hover:bg-secondary hover:text-white"
              onClick={() => navigate('/admin-reports')}
            >
              <span className="text-lg mr-3">🧾</span>
              <div className="text-left">
                <div className="font-medium">Lihat Laporan</div>
                <div className="text-xs text-muted-foreground">Analisis sistem dan keuangan</div>
              </div>
            </Button>
          </div>
        </div>

        {/* System Info */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-medium text-foreground mb-2">ℹ️ Informasi Sistem</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• SmartCare v1.0</p>
              <p>• Database: localStorage</p>
              <p>• Status: Aktif</p>
            </div>
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

export default DashboardAdmin;