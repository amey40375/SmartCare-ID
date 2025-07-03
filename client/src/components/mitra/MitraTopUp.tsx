import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addTopUpRequest, getCurrentUser, getMitraBalance } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const MitraTopUp = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentUser] = useState(getCurrentUser());
  const [amount, setAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'mitra') {
      navigate('/landing');
      return;
    }
    loadBalance();
  }, [currentUser, navigate]);

  const loadBalance = () => {
    const balance = getMitraBalance(currentUser!.id);
    setCurrentBalance(balance);
  };

  const handleTopUp = () => {
    const topUpAmount = parseInt(amount);
    
    if (!amount.trim() || isNaN(topUpAmount) || topUpAmount < 10000) {
      toast({
        title: "Error",
        description: "Minimum top-up Rp 10.000",
        variant: "destructive"
      });
      return;
    }

    const request = {
      id: `topup-${Date.now()}`,
      userId: currentUser!.id,
      userType: 'mitra' as const,
      amount: topUpAmount,
      status: 'pending' as const,
      requestedAt: new Date().toISOString()
    };

    addTopUpRequest(request);

    toast({
      title: "Permintaan Terkirim",
      description: `Permintaan top-up Rp ${topUpAmount.toLocaleString('id-ID')} telah dikirim ke admin`
    });

    setAmount('');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Top-Up Saldo</h1>
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
              <h3 className="text-lg font-semibold mb-2">Saldo Saat Ini</h3>
              <p className="text-3xl font-bold text-primary">
                Rp {currentBalance.toLocaleString('id-ID')}
              </p>
              {currentBalance < 10000 && (
                <p className="text-sm text-destructive mt-2">
                  ⚠️ Saldo di bawah minimum untuk menerima pesanan
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Up Form */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Isi Saldo</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Top-Up</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Masukkan jumlah (min. Rp 10.000)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button 
                onClick={handleTopUp}
                className="w-full h-12"
                disabled={!amount.trim()}
              >
                💳 Kirim Permintaan Top-Up
              </Button>
            </CardContent>
          </Card>

          {/* Quick Top Up */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top-Up Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              {[25000, 50000, 100000, 250000].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="h-16 flex-col"
                >
                  <span className="text-xs">Rp</span>
                  <span className="font-semibold">{quickAmount.toLocaleString('id-ID')}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Info */}
          <Card className="bg-muted">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">ℹ️ Informasi Top-Up Mitra</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Minimum top-up Rp 10.000</li>
                <li>• Minimum saldo Rp 10.000 untuk menerima pesanan</li>
                <li>• Komisi 25% dipotong otomatis setelah pekerjaan selesai</li>
                <li>• Permintaan akan diproses oleh admin</li>
                <li>• Proses biasanya 1-24 jam kerja</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MitraTopUp;