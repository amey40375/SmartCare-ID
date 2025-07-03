import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getUsers, addOrder, getCurrentUser, getUserBalance } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/utils/localStorage';

const UserOrder = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentUser] = useState(getCurrentUser());
  const [availableMitras, setAvailableMitras] = useState<User[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedMitra, setSelectedMitra] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('balance');
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    rate: 125000
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'user') {
      navigate('/landing');
      return;
    }
    loadMitras();
  }, [currentUser, navigate]);

  const loadMitras = () => {
    const users = getUsers();
    const mitras = users.filter(u => u.role === 'mitra' && !u.isBlocked);
    setAvailableMitras(mitras);
  };

  const getServiceMitras = () => {
    if (!selectedService) return [];
    return availableMitras.filter(m => m.skills?.includes(selectedService as 'SmartMassage' | 'SmartBarber' | 'SmartClean'));
  };

  const handleSubmit = () => {
    if (!selectedService || !selectedMitra || !formData.address.trim()) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua data pesanan",
        variant: "destructive"
      });
      return;
    }

    // Check balance only if payment method is balance
    if (paymentMethod === 'balance') {
      const userBalance = getUserBalance(currentUser!.id);
      if (userBalance < formData.rate) {
        toast({
          title: "Saldo Tidak Cukup",
          description: "Mohon top-up saldo terlebih dahulu atau pilih pembayaran cash",
          variant: "destructive"
        });
        return;
      }
    }

    const newOrder = {
      id: `order-${Date.now()}`,
      userId: currentUser!.id,
      mitraId: selectedMitra,
      service: selectedService as 'SmartMassage' | 'SmartBarber' | 'SmartClean',
      address: formData.address,
      description: formData.description,
      rate: formData.rate,
      paymentMethod: paymentMethod as 'balance' | 'cash',
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    addOrder(newOrder);

    toast({
      title: "Pesanan Berhasil",
      description: "Pesanan Anda telah dikirim ke mitra"
    });

    navigate('/dashboard-user');
  };

  if (!currentUser) return null;

  const serviceMitras = getServiceMitras();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Pesan Layanan</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-user')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Buat Pesanan Baru</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Pilih Layanan</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SmartMassage">💆 SmartMassage</SelectItem>
                  <SelectItem value="SmartBarber">💇 SmartBarber</SelectItem>
                  <SelectItem value="SmartClean">🧹 SmartClean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedService && (
              <div className="space-y-2">
                <Label>Pilih Mitra</Label>
                <Select value={selectedMitra} onValueChange={setSelectedMitra}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mitra" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceMitras.length === 0 ? (
                      <SelectItem value="no-mitra" disabled>Tidak ada mitra tersedia</SelectItem>
                    ) : (
                      serviceMitras.map((mitra) => (
                        <SelectItem key={mitra.id} value={mitra.id}>
                          🧑‍🔧 {mitra.name} - {mitra.phone}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea
                id="address"
                placeholder="Masukkan alamat lengkap untuk layanan"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Catatan Tambahan (Opsional)</Label>
              <Textarea
                id="description"
                placeholder="Tambahkan catatan khusus jika diperlukan"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Tarif per Jam</Label>
              <Input
                id="rate"
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData({...formData, rate: parseInt(e.target.value) || 125000})}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                Tarif standar: Rp 125.000/jam
              </p>
            </div>

            <div className="space-y-3">
              <Label>Metode Pembayaran</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="balance" id="balance" />
                  <Label htmlFor="balance" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span>💳 Potong Saldo</span>
                      <span className="text-sm text-muted-foreground">
                        Saldo: Rp {getUserBalance(currentUser?.id || '').toLocaleString('id-ID')}
                      </span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span>💵 Bayar Cash</span>
                      <span className="text-sm text-muted-foreground">
                        Bayar langsung ke mitra
                      </span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Estimasi Biaya:</p>
              <p className="text-lg font-semibold">
                Rp {formData.rate.toLocaleString('id-ID')}/jam
              </p>
              <p className="text-xs text-muted-foreground">
                {paymentMethod === 'balance' 
                  ? 'Pembayaran akan dipotong dari saldo setelah layanan selesai'
                  : 'Pembayaran cash langsung ke mitra setelah layanan selesai'
                }
              </p>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full h-12"
              disabled={!selectedService || !selectedMitra || !formData.address.trim()}
            >
              📋 Buat Pesanan
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserOrder;