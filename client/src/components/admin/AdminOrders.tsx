import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOrders, getCurrentUser } from '@/utils/localStorage';
import type { Order } from '@/utils/localStorage';

const AdminOrders = () => {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/landing');
      return;
    }
    loadOrders();
  }, [currentUser, navigate]);

  const loadOrders = () => {
    const allOrders = getOrders();
    setOrders(allOrders);
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'SmartMassage': return '💆';
      case 'SmartBarber': return '💇';
      case 'SmartClean': return '🧹';
      default: return '📦';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'accepted': return 'bg-primary/10 text-primary';
      case 'in_progress': return 'bg-secondary/10 text-secondary';
      case 'completed': return 'bg-success/10 text-success';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'accepted': return 'Diterima';
      case 'in_progress': return 'Dikerjakan';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card>
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
            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">👤 User: {order.userId}</p>
            {order.mitraId && (
              <p className="text-sm text-muted-foreground">🧑‍🔧 Mitra: {order.mitraId}</p>
            )}
            <p className="text-sm text-muted-foreground">💰 Rate: Rp {order.rate.toLocaleString('id-ID')}/jam</p>
            <p className="text-sm text-muted-foreground">📍 {order.address}</p>
            {order.description && (
              <p className="text-sm text-muted-foreground">📝 {order.description}</p>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Dibuat: {new Date(order.createdAt).toLocaleString('id-ID')}</p>
            {order.startedAt && (
              <p>Dimulai: {new Date(order.startedAt).toLocaleString('id-ID')}</p>
            )}
            {order.completedAt && (
              <p>Selesai: {new Date(order.completedAt).toLocaleString('id-ID')}</p>
            )}
            {order.totalAmount && (
              <p className="font-semibold text-foreground">
                Total: Rp {order.totalAmount.toLocaleString('id-ID')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!currentUser) return null;

  const pendingOrders = getOrdersByStatus('pending');
  const activeOrders = [...getOrdersByStatus('accepted'), ...getOrdersByStatus('in_progress')];
  const completedOrders = getOrdersByStatus('completed');
  const cancelledOrders = getOrdersByStatus('cancelled');

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Riwayat Pesanan</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-admin')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-2 mb-6">
          <Card className="bg-warning/10">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-warning">{pendingOrders.length}</div>
              <div className="text-xs text-muted-foreground">Menunggu</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/10">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-primary">{activeOrders.length}</div>
              <div className="text-xs text-muted-foreground">Aktif</div>
            </CardContent>
          </Card>
          <Card className="bg-success/10">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-success">{completedOrders.length}</div>
              <div className="text-xs text-muted-foreground">Selesai</div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/10">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-destructive">{cancelledOrders.length}</div>
              <div className="text-xs text-muted-foreground">Batal</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">Semua</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">Menunggu</TabsTrigger>
            <TabsTrigger value="active" className="text-xs">Aktif</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Selesai</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-3">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Pesanan</h3>
                    <p className="text-muted-foreground">Belum ada pesanan yang masuk</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-4">
            <div className="space-y-3">
              {pendingOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <h3 className="text-lg font-semibold mb-2">Tidak Ada Pesanan Menunggu</h3>
                  </CardContent>
                </Card>
              ) : (
                pendingOrders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-4">
            <div className="space-y-3">
              {activeOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🛠️</div>
                    <h3 className="text-lg font-semibold mb-2">Tidak Ada Pesanan Aktif</h3>
                  </CardContent>
                </Card>
              ) : (
                activeOrders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <div className="space-y-3">
              {completedOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Pesanan Selesai</h3>
                  </CardContent>
                </Card>
              ) : (
                completedOrders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminOrders;