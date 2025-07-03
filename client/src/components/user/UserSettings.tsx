import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCurrentUser, getUsers } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const UserSettings = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentUser] = useState(getCurrentUser());
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'user') {
      navigate('/landing');
      return;
    }
    setFormData({
      name: currentUser.name || '',
      phone: currentUser.phone || '',
      address: currentUser.address || ''
    });
  }, [currentUser, navigate]);

  const handleUpdateProfile = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Error",
        description: "Nama dan nomor HP wajib diisi",
        variant: "destructive"
      });
      return;
    }

    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.id === currentUser!.id 
        ? { ...u, name: formData.name, phone: formData.phone, address: formData.address }
        : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update current user in session
    const updatedUser = { ...currentUser!, name: formData.name, phone: formData.phone, address: formData.address };
    localStorage.setItem('current_user', JSON.stringify(updatedUser));

    toast({
      title: "Berhasil",
      description: "Profil berhasil diperbarui"
    });

    setShowEditDialog(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    toast({
      title: "Logout",
      description: "Anda telah keluar dari aplikasi"
    });
    navigate('/landing');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Pengaturan</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-user')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">👤 Profil Saya</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Nama</span>
                <span className="text-sm font-medium">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Email</span>
                <span className="text-sm font-medium">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">No. HP</span>
                <span className="text-sm font-medium">{currentUser.phone || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Alamat</span>
                <span className="text-sm font-medium">{currentUser.address || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Role</span>
                <span className="text-sm font-medium">USER</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setShowEditDialog(true)}
              >
                ✏️ Edit Profil
              </Button>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">⚙️ Pengaturan Akun</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/user-history')}
              >
                📦 Riwayat Pesanan
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/user-topup')}
              >
                💳 Top-Up Saldo
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/user-chat')}
              >
                💬 Hubungi Admin
              </Button>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">📞 Dukungan</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">📧 id.smartprobyarvin@gmail.com</p>
              <p className="text-sm">📱 081299660660</p>
              <p className="text-sm">🌍 Kab. Bandung - Jawa Barat</p>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">ℹ️ Tentang Aplikasi</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Versi</span>
                <span className="text-sm font-medium">SmartCare v1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Developer</span>
                <span className="text-sm font-medium">SmartPro by Arvin</span>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-4">
                by SmartCare
              </p>
            </CardContent>
          </Card>

          {/* Logout */}
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            🚪 Keluar
          </Button>
        </div>
      </main>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor HP</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                Batal
              </Button>
              <Button onClick={handleUpdateProfile} className="flex-1">
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSettings;