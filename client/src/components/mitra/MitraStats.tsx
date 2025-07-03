import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getOrders, getCurrentUser, getMitraBalance } from '@/utils/localStorage';
import type { Order } from '@/utils/localStorage';

const MitraStats = () => {
  const [, navigate] = useLocation();
  const [currentUser] = useState(getCurrentUser());
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalHours: 0,
    totalEarnings: 0,
    totalCommissions: 0,
    netEarnings: 0,
    averageRating: 0,
    currentBalance: 0,
    thisMonthJobs: 0,
    thisMonthEarnings: 0
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'mitra') {
      navigate('/landing');
      return;
    }
    calculateStats();
  }, [currentUser, navigate]);

  const calculateStats = () => {
    const allOrders = getOrders();
    const mitraOrders = allOrders.filter(order => 
      order.mitraId === currentUser!.id && order.status === 'completed'
    );
    
    const currentBalance = getMitraBalance(currentUser!.id);
    
    // Calculate totals
    const totalJobs = mitraOrders.length;
    const totalHours = mitraOrders.reduce((sum, order) => sum + (order.duration || 0), 0);
    const totalEarnings = mitraOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalCommissions = mitraOrders.reduce((sum, order) => sum + (order.commission || 0), 0);
    const netEarnings = totalEarnings - totalCommissions;
    
    // This month stats
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthOrders = mitraOrders.filter(order => {
      const orderDate = new Date(order.completedAt!);
      return orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear;
    });
    
    const thisMonthJobs = thisMonthOrders.length;
    const thisMonthEarnings = thisMonthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    setStats({
      totalJobs,
      totalHours,
      totalEarnings,
      totalCommissions,
      netEarnings,
      averageRating: 4.8, // Mock rating
      currentBalance,
      thisMonthJobs,
      thisMonthEarnings
    });
  };

  const getServiceStats = () => {
    const allOrders = getOrders();
    const mitraOrders = allOrders.filter(order => 
      order.mitraId === currentUser!.id && order.status === 'completed'
    );
    
    const serviceStats = {
      SmartMassage: mitraOrders.filter(o => o.service === 'SmartMassage').length,
      SmartBarber: mitraOrders.filter(o => o.service === 'SmartBarber').length,
      SmartClean: mitraOrders.filter(o => o.service === 'SmartClean').length
    };
    
    return serviceStats;
  };

  if (!currentUser) return null;

  const serviceStats = getServiceStats();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Statistik</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-mitra')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Current Balance */}
          <Card className="bg-gradient-primary/10">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">💰 Saldo Saat Ini</h3>
              <p className="text-3xl font-bold text-primary">
                Rp {stats.currentBalance.toLocaleString('id-ID')}
              </p>
            </CardContent>
          </Card>

          {/* Overall Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">📊 Statistik Keseluruhan</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.totalJobs}</div>
                  <div className="text-xs text-muted-foreground">Total Pekerjaan</div>
                </div>
                <div className="text-center p-3 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{stats.totalHours}</div>
                  <div className="text-xs text-muted-foreground">Total Jam</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Pendapatan:</span>
                  <span className="text-sm font-medium">
                    Rp {stats.totalEarnings.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-destructive">Total Komisi:</span>
                  <span className="text-sm font-medium text-destructive">
                    Rp {stats.totalCommissions.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium">Pendapatan Bersih:</span>
                  <span className="text-sm font-bold text-success">
                    Rp {stats.netEarnings.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* This Month Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">📅 Bulan Ini</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{stats.thisMonthJobs}</div>
                  <div className="text-xs text-muted-foreground">Pekerjaan</div>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <div className="text-lg font-bold text-warning">
                    {stats.thisMonthEarnings.toLocaleString('id-ID')}
                  </div>
                  <div className="text-xs text-muted-foreground">Pendapatan</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Statistics */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">🛠️ Per Layanan</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">💆 SmartMassage</span>
                  <span className="text-sm font-medium">{serviceStats.SmartMassage} pekerjaan</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">💇 SmartBarber</span>
                  <span className="text-sm font-medium">{serviceStats.SmartBarber} pekerjaan</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">🧹 SmartClean</span>
                  <span className="text-sm font-medium">{serviceStats.SmartClean} pekerjaan</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">⭐ Performa</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Rating Rata-rata</span>
                <span className="text-sm font-medium">⭐ {stats.averageRating}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Rata-rata per Pekerjaan</span>
                <span className="text-sm font-medium">
                  {stats.totalJobs > 0 ? Math.round(stats.totalEarnings / stats.totalJobs).toLocaleString('id-ID') : 0} Rp
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Rata-rata per Jam</span>
                <span className="text-sm font-medium">
                  {stats.totalHours > 0 ? Math.round(stats.totalEarnings / stats.totalHours).toLocaleString('id-ID') : 0} Rp
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/mitra-history')}
            >
              📋 Lihat Riwayat Detail
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/mitra-topup')}
            >
              💳 Top-Up Saldo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MitraStats;