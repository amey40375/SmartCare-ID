import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getOrders, getCurrentUser } from '@/utils/localStorage';
import type { Order } from '@/utils/localStorage';

const MitraHistory = () => {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'mitra') {
      navigate('/landing');
      return;
    }
    loadOrders();
  }, [currentUser, navigate]);

  const loadOrders = () => {
    const allOrders = getOrders();
    const mitraOrders = allOrders.filter(order => 
      order.mitraId === currentUser!.id && order.status === 'completed'
    );
    // Sort by completion date (newest first)
    mitraOrders.sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    setOrders(mitraOrders);
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'SmartMassage': return '💆';
      case 'SmartBarber': return '💇';
      case 'SmartClean': return '🧹';
      default: return '📦';
    }
  };

  const getTotalStats = () => {
    const totalJobs = orders.length;
    const totalEarnings = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalCommissions = orders.reduce((sum, order) => sum + (order.commission || 0), 0);
    const totalHours = orders.reduce((sum, order) => sum + (order.duration || 0), 0);

    return {
      totalJobs,
      totalEarnings,
      totalCommissions,
      totalHours,
      netEarnings: totalEarnings - totalCommissions
    };
  };

  if (!currentUser) return null;

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Riwayat Pekerjaan</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-mitra')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-primary/10">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-primary">{stats.totalJobs}</div>
                <div className="text-xs text-muted-foreground">Total Pekerjaan</div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/10">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-secondary">{stats.totalHours}</div>
                <div className="text-xs text-muted-foreground">Total Jam</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Card className="bg-success/10">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-success">
                  Rp {stats.totalEarnings.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-muted-foreground">Total Pendapatan</div>
              </CardContent>
            </Card>
            <Card className="bg-destructive/10">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-destructive">
                  Rp {stats.totalCommissions.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-muted-foreground">Total Komisi (25%)</div>
              </CardContent>
            </Card>
          </div>

          {/* History */}
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold mb-2">Belum Ada Riwayat</h3>
                <p className="text-muted-foreground">
                  Selesaikan pekerjaan pertama untuk melihat riwayat
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/mitra-incoming')}
                >
                  📥 Lihat Pesanan Masuk
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">📋 Riwayat Pekerjaan</h3>
              
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getServiceIcon(order.service)}</span>
                          <div>
                            <h3 className="font-semibold text-foreground">{order.service}</h3>
                            <p className="text-xs text-muted-foreground">#{order.id.slice(-8)}</p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-success/10 text-success rounded">
                          ✅ Selesai
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">👤 User: {order.userId}</p>
                        <p className="text-sm text-muted-foreground">💰 Rate: Rp {order.rate.toLocaleString('id-ID')}/jam</p>
                        <p className="text-sm text-muted-foreground">⏱️ Durasi: {order.duration} jam</p>
                        <p className="text-sm text-muted-foreground">📍 {order.address}</p>
                      </div>

                      <div className="bg-muted p-3 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm">Total Pendapatan:</span>
                            <span className="text-sm font-medium">
                              Rp {order.totalAmount?.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-destructive">Komisi (25%):</span>
                            <span className="text-sm font-medium text-destructive">
                              -Rp {order.commission?.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="text-sm font-medium">Bersih:</span>
                            <span className="text-sm font-bold text-success">
                              Rp {((order.totalAmount || 0) - (order.commission || 0)).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <p>Dimulai: {new Date(order.startedAt!).toLocaleString('id-ID')}</p>
                        <p>Selesai: {new Date(order.completedAt!).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MitraHistory;