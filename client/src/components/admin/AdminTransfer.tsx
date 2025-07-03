import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUsers, updateUserBalance, updateMitraBalance, getUserBalance, getMitraBalance, getCurrentUser } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/utils/localStorage';

const AdminTransfer = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/landing');
      return;
    }
    loadUsers();
  }, [currentUser, navigate]);

  const loadUsers = () => {
    const allUsers = getUsers();
    const filteredUsers = allUsers.filter(u => u.role !== 'admin');
    setUsers(filteredUsers);
  };

  const handleTransfer = () => {
    if (!selectedUser || !amount.trim()) {
      toast({
        title: "Error",
        description: "Mohon pilih user dan masukkan jumlah",
        variant: "destructive"
      });
      return;
    }

    const transferAmount = parseInt(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast({
        title: "Error",
        description: "Jumlah tidak valid",
        variant: "destructive"
      });
      return;
    }

    try {
      const user = users.find(u => u.id === selectedUser);
      if (!user) return;

      if (user.role === 'user') {
        const currentBalance = getUserBalance(user.id);
        updateUserBalance(user.id, currentBalance + transferAmount);
      } else {
        const currentBalance = getMitraBalance(user.id);
        updateMitraBalance(user.id, currentBalance + transferAmount);
      }

      toast({
        title: "Berhasil",
        description: `Rp ${transferAmount.toLocaleString('id-ID')} telah dikirim ke ${user.name}`
      });

      setSelectedUser('');
      setAmount('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat transfer",
        variant: "destructive"
      });
    }
  };

  const getSelectedUserBalance = () => {
    if (!selectedUser) return 0;
    const user = users.find(u => u.id === selectedUser);
    if (!user) return 0;
    
    return user.role === 'user' 
      ? getUserBalance(user.id)
      : getMitraBalance(user.id);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Kirim Saldo</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-admin')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Pilih User/Mitra</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penerima" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.role === 'user' ? '👤' : '🧑‍🔧'} {user.name} - {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUser && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Saldo saat ini:</p>
                <p className="text-lg font-semibold">
                  Rp {getSelectedUserBalance().toLocaleString('id-ID')}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah Transfer</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Masukkan jumlah"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12"
              />
            </div>

            <Button 
              onClick={handleTransfer}
              className="w-full h-12"
              disabled={!selectedUser || !amount.trim()}
            >
              🔁 Kirim Saldo
            </Button>
          </CardContent>
        </Card>

        {/* Quick Transfer */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Transfer Cepat</h3>
          <div className="grid grid-cols-3 gap-3">
            {[10000, 25000, 50000].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                className="h-12 flex-col"
              >
                <span className="text-xs">Rp</span>
                <span className="font-semibold">{quickAmount.toLocaleString('id-ID')}</span>
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTransfer;