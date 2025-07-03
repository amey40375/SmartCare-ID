import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getOrders, updateOrder, getCurrentUser, getMitraBalance, getBlockedAccounts } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/utils/localStorage';

const MitraIncoming = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser] = useState(getCurrentUser());
  const [balance, setBalance] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'mitra') {
      navigate('/landing');
      return;
    }
    checkBlocked();
    loadOrders();
    loadBalance();
  }, [currentUser, navigate]);

  const checkBlocked = () => {
    const blocked = getBlockedAccounts();
    const blocked_status = blocked.includes(currentUser!.id);
    setIsBlocked(blocked_status);
  };

  const loadOrders = () => {
    const allOrders = getOrders();
    const mitraOrders = allOrders.filter(order => 
      order.status === 'pending' && 
      (order.mitraId === currentUser!.id || !order.mitraId)
    );
    setOrders(mitraOrders);
  };

  const loadBalance = () => {
    const mitraBalance = getMitraBalance(currentUser!.id);
    setBalance(mitraBalance);
  };

  const handleAcceptOrder = (order: Order) => {
    if (balance < 10000) {
      toast({
        title: "Saldo Tidak Cukup",
        description: "Saldo minimum Rp 10.000 untuk menerima pesanan",
        variant: "destructive"
      });
      return;
    }

    const updatedOrder = {
      ...order,
      mitraId: currentUser!.id,
      status: 'accepted' as const,
      acceptedAt: new Date().toISOString()
    };

    updateOrder(order.id, updatedOrder);

    toast({
      title: "Pesanan Diterima",
      description: "Pesanan berhasil diterima dan masuk ke daftar kerja"
    });

    // Redirect to active work page
    navigate('/mitra-active');
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'SmartMassage': return '💆';
      case 'SmartBarber': return '💇';
      case 'SmartClean': return '🧹';
      default: return '📦';
    }
  };

  if (!currentUser) return null;

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-poppins font-bold text-gradient-primary">Pesanan Masuk</h1>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-mitra')}>
                ← Kembali
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <Card className="border-destructive/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-lg font-semibold mb-2 text-destructive">Akun Terkunci</h3>
              <p className="text-muted-foreground mb-4">
                Akun Anda sedang terkunci. Silakan hubungi admin untuk bantuan.
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate('/mitra-chat')}
              >
                💬 Chat Admin
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Pesanan Masuk</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-mitra')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* Balance Warning */}
          {balance < 10000 && (
            <Card className="border-warning/20 bg-warning/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-warning">⚠️</span>
                  <div>
                    <p className="text-sm font-medium">Saldo Tidak Mencukupi</p>
                    <p className="text-xs text-muted-foreground">
                      Minimum saldo Rp 10.000 untuk menerima pesanan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Balance */}
          <Card className="bg-primary/10">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Saldo Saat Ini</p>
              <p className="text-xl font-bold text-primary">
                Rp {balance.toLocaleString('id-ID')}
              </p>
            </CardContent>
          </Card>

          {/* Orders */}
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📥</div>
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Pesanan</h3>
                <p className="text-muted-foreground">
                  Belum ada pesanan masuk untuk Anda
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {orders.length} pesanan menunggu konfirmasi
              </p>
              
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
                        <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded">
                          Menunggu
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">👤 User: {order.userId}</p>
                        <p className="text-sm text-muted-foreground">💰 Rate: Rp {order.rate.toLocaleString('id-ID')}/jam</p>
                        <p className="text-sm text-muted-foreground">📍 {order.address}</p>
                        {order.description && (
                          <p className="text-sm text-muted-foreground">📝 {order.description}</p>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <p>Dibuat: {new Date(order.createdAt).toLocaleString('id-ID')}</p>
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => handleAcceptOrder(order)}
                        disabled={balance < 10000}
                      >
                        ✅ Terima Pesanan
                      </Button>
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

export default MitraIncoming;