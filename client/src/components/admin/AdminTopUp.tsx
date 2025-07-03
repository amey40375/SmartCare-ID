import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTopUpRequests, updateTopUpRequest, updateUserBalance, updateMitraBalance, getCurrentUser } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import type { TopUpRequest } from '@/utils/localStorage';

const AdminTopUp = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [requests, setRequests] = useState<TopUpRequest[]>([]);
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/landing');
      return;
    }
    loadRequests();
  }, [currentUser, navigate]);

  const loadRequests = () => {
    const allRequests = getTopUpRequests();
    const pending = allRequests.filter(req => req.status === 'pending');
    setRequests(pending);
  };

  const handleApprove = (request: TopUpRequest) => {
    try {
      // Update balance
      if (request.userType === 'user') {
        const currentBalance = JSON.parse(localStorage.getItem('saldo_users') || '{}')[request.userId] || 0;
        updateUserBalance(request.userId, currentBalance + request.amount);
      } else {
        const currentBalance = JSON.parse(localStorage.getItem('saldo_mitras') || '{}')[request.userId] || 0;
        updateMitraBalance(request.userId, currentBalance + request.amount);
      }

      // Update request status
      updateTopUpRequest(request.id, {
        status: 'approved',
        processedAt: new Date().toISOString()
      });

      toast({
        title: "Berhasil",
        description: `Top-up Rp ${request.amount.toLocaleString('id-ID')} telah disetujui`
      });

      loadRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memproses top-up",
        variant: "destructive"
      });
    }
  };

  const handleReject = (request: TopUpRequest) => {
    updateTopUpRequest(request.id, {
      status: 'rejected',
      processedAt: new Date().toISOString()
    });

    toast({
      title: "Ditolak",
      description: "Permintaan top-up telah ditolak"
    });

    loadRequests();
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Konfirmasi Top-Up</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-admin')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-lg font-semibold mb-2">Tidak Ada Permintaan</h3>
              <p className="text-muted-foreground">
                Semua permintaan top-up telah diproses
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              {requests.length} permintaan menunggu konfirmasi
            </p>
            
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Rp {request.amount.toLocaleString('id-ID')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {request.userType === 'user' ? '👤 User' : '🧑‍🔧 Mitra'}: {request.userId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.requestedAt).toLocaleDateString('id-ID')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.requestedAt).toLocaleTimeString('id-ID')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleApprove(request)}
                      >
                        ✅ Setujui
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleReject(request)}
                      >
                        ❌ Tolak
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTopUp;