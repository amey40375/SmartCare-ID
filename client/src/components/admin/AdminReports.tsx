import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getUsers, getOrders, getCurrentUser } from '@/utils/localStorage';

const AdminReports = () => {
  const [, navigate] = useLocation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMitras: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalUserBalance: 0,
    totalMitraBalance: 0
  });
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/landing');
      return;
    }
    generateReport();
  }, [currentUser, navigate]);

  const generateReport = () => {
    // Get all data
    const users = getUsers();
    const orders = getOrders();
    const userBalances = JSON.parse(localStorage.getItem('saldo_users') || '{}');
    const mitraBalances = JSON.parse(localStorage.getItem('saldo_mitras') || '{}');

    // Calculate stats
    const totalUsers = users.filter(u => u.role === 'user').length;
    const totalMitras = users.filter(u => u.role === 'mitra').length;
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    
    const totalRevenue = orders
      .filter(o => o.status === 'completed' && o.totalAmount)
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const totalUserBalance = Object.keys(userBalances).reduce((sum: number, key: string) => {
      const balance = userBalances[key];
      return sum + (typeof balance === 'number' ? balance : 0);
    }, 0);
    const totalMitraBalance = Object.keys(mitraBalances).reduce((sum: number, key: string) => {
      const balance = mitraBalances[key];
      return sum + (typeof balance === 'number' ? balance : 0);
    }, 0);

    setStats({
      totalUsers,
      totalMitras,
      totalOrders,
      completedOrders,
      totalRevenue,
      pendingOrders,
      totalUserBalance,
      totalMitraBalance
    });
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Laporan Sistem</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-admin')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Users & Mitras */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">👥 Pengguna</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
                  <div className="text-xs text-muted-foreground">Total User</div>
                </div>
                <div className="text-center p-3 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{stats.totalMitras}</div>
                  <div className="text-xs text-muted-foreground">Total Mitra</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">📦 Pesanan</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <div className="text-xl font-bold text-accent">{stats.totalOrders}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <div className="text-xl font-bold text-warning">{stats.pendingOrders}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="text-xl font-bold text-success">{stats.completedOrders}</div>
                  <div className="text-xs text-muted-foreground">Selesai</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">💰 Keuangan</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-primary/10 rounded-lg">
                  <span className="text-sm font-medium">Total Revenue</span>
                  <span className="font-bold text-primary">
                    Rp {stats.totalRevenue.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Saldo User</span>
                  <span className="font-bold">
                    Rp {stats.totalUserBalance.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Saldo Mitra</span>
                  <span className="font-bold">
                    Rp {stats.totalMitraBalance.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">⚙️ Sistem</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Versi Aplikasi</span>
                <span className="text-sm font-medium">SmartCare v1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Database</span>
                <span className="text-sm font-medium">localStorage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Status</span>
                <span className="text-sm font-medium text-success">🟢 Aktif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last Updated</span>
                <span className="text-sm font-medium">{new Date().toLocaleString('id-ID')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={generateReport}
            >
              🔄 Refresh Laporan
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                const data = {
                  timestamp: new Date().toISOString(),
                  stats,
                  users: getUsers(),
                  orders: getOrders()
                };
                console.log('Report Data:', data);
              }}
            >
              📊 Export Data (Console)
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;