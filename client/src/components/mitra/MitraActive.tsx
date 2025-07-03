import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getOrders, updateOrder, getCurrentUser, getMitraBalance, updateMitraBalance, blockAccount } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/utils/localStorage';

const MitraActive = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser] = useState(getCurrentUser());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [workDuration, setWorkDuration] = useState(0);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'mitra') {
      navigate('/landing');
      return;
    }
    loadOrders();
  }, [currentUser, navigate]);

  // Timer effect for real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadOrders = () => {
    const allOrders = getOrders();
    const mitraOrders = allOrders.filter(order => 
      order.mitraId === currentUser!.id && 
      (order.status === 'accepted' || order.status === 'in_progress')
    );
    setOrders(mitraOrders);
  };

  const handleStartWork = (order: Order) => {
    const updatedOrder = {
      ...order,
      status: 'in_progress' as const,
      startedAt: new Date().toISOString()
    };

    updateOrder(order.id, updatedOrder);
    setActiveTimer(order.id);

    toast({
      title: "Pekerjaan Dimulai",
      description: "Timer telah dimulai untuk pesanan ini"
    });

    loadOrders();
  };

  const handleCompleteWork = (order: Order) => {
    setSelectedOrder(order);
    
    // Calculate work duration
    const startTime = new Date(order.startedAt!).getTime();
    const endTime = new Date().getTime();
    const duration = Math.ceil((endTime - startTime) / (1000 * 60 * 60)); // hours
    setWorkDuration(duration);
    
    setShowCompleteDialog(true);
  };

  const confirmComplete = () => {
    if (!selectedOrder) return;

    const totalAmount = selectedOrder.rate * workDuration;
    const commission = totalAmount * 0.25; // 25% commission
    const currentBalance = getMitraBalance(currentUser!.id);

    // Complete the order regardless of balance
    const updatedOrder = {
      ...selectedOrder,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
      duration: workDuration,
      totalAmount: totalAmount,
      commission: commission
    };

    updateOrder(selectedOrder.id, updatedOrder);

    if (currentBalance < commission) {
      // Block mitra if insufficient balance but still complete the order
      blockAccount(currentUser!.id);
      
      toast({
        title: "Pekerjaan Selesai - Akun Terkunci",
        description: `Saldo tidak cukup untuk komisi Rp ${commission.toLocaleString('id-ID')}. Akun Anda dikunci. Hubungi admin.`,
        variant: "destructive"
      });
    } else {
      // Deduct commission from mitra balance
      updateMitraBalance(currentUser!.id, currentBalance - commission);
      
      toast({
        title: "Pekerjaan Selesai",
        description: `Komisi Rp ${commission.toLocaleString('id-ID')} telah dipotong dari saldo`
      });
    }

    setShowCompleteDialog(false);
    setSelectedOrder(null);
    setActiveTimer(null);
    loadOrders();
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'SmartMassage': return '💆';
      case 'SmartBarber': return '💇';
      case 'SmartClean': return '🧹';
      default: return '📦';
    }
  };

  const getWorkingTime = (startedAt: string) => {
    const start = new Date(startedAt).getTime();
    const now = currentTime.getTime();
    const duration = Math.floor((now - start) / (1000 * 60)); // minutes
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Sedang Dikerjakan</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-mitra')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🛠️</div>
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Pekerjaan Aktif</h3>
                <p className="text-muted-foreground">
                  Terima pesanan untuk mulai bekerja
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
              <p className="text-sm text-muted-foreground">
                {orders.length} pekerjaan aktif
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
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'accepted' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-secondary/10 text-secondary'
                        }`}>
                          {order.status === 'accepted' ? 'Diterima' : 'Dikerjakan'}
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

                      {order.status === 'in_progress' && order.startedAt && (
                        <div className="bg-secondary/10 p-3 rounded-lg">
                          <p className="text-sm font-medium">⏱️ Waktu Kerja: {getWorkingTime(order.startedAt)}</p>
                          <p className="text-xs text-muted-foreground">
                            Dimulai: {new Date(order.startedAt).toLocaleString('id-ID')}
                          </p>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        <p>Diterima: {new Date(order.acceptedAt!).toLocaleString('id-ID')}</p>
                      </div>

                      {order.status === 'accepted' ? (
                        <Button 
                          className="w-full"
                          onClick={() => handleStartWork(order)}
                        >
                          ▶️ Mulai Bekerja
                        </Button>
                      ) : (
                        <Button 
                          variant="secondary"
                          className="w-full"
                          onClick={() => handleCompleteWork(order)}
                        >
                          ✅ Selesaikan Pekerjaan
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Complete Work Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Selesaikan Pekerjaan</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Layanan: {selectedOrder.service}</p>
                <p className="text-sm text-muted-foreground">Durasi: {workDuration} jam</p>
                <p className="text-sm text-muted-foreground">Rate: Rp {selectedOrder.rate.toLocaleString('id-ID')}/jam</p>
              </div>
              
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <h4 className="font-semibold text-sm">📋 Invoice Pekerjaan</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Pendapatan:</span>
                    <span>Rp {(selectedOrder.rate * workDuration).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Komisi Platform (25%):</span>
                    <span>-Rp {(selectedOrder.rate * workDuration * 0.25).toLocaleString('id-ID')}</span>
                  </div>
                  <hr className="my-1" />
                  <div className="flex justify-between font-semibold">
                    <span>Pendapatan Bersih:</span>
                    <span>Rp {(selectedOrder.rate * workDuration * 0.75).toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Komisi akan dipotong dari saldo Anda
                </p>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowCompleteDialog(false)} className="flex-1">
                  Batal
                </Button>
                <Button onClick={confirmComplete} className="flex-1">
                  Selesai
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MitraActive;