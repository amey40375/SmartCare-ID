import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCurrentUser } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/landing');
      return;
    }
  }, [currentUser, navigate]);

  const handleResetData = () => {
    // Clear all data except admin account
    const defaultAdmin = {
      id: 'admin-1',
      email: 'admin@smartcare.com',
      name: 'Admin SmartCare',
      phone: '081299660660',
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    localStorage.setItem('mitra_applications', JSON.stringify([]));
    localStorage.setItem('orders', JSON.stringify([]));
    localStorage.setItem('saldo_users', JSON.stringify({}));
    localStorage.setItem('saldo_mitras', JSON.stringify({}));
    localStorage.setItem('topup_requests', JSON.stringify([]));
    localStorage.setItem('blocked_accounts', JSON.stringify([]));
    localStorage.setItem('chat_logs', JSON.stringify([]));

    toast({
      title: "Data Reset",
      description: "Semua data telah direset ke kondisi awal"
    });

    setShowResetDialog(false);
  };

  const getStorageInfo = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const applications = JSON.parse(localStorage.getItem('mitra_applications') || '[]');
    const topups = JSON.parse(localStorage.getItem('topup_requests') || '[]');
    
    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      pendingApplications: applications.length,
      pendingTopups: topups.length
    };
  };

  const storageInfo = getStorageInfo();

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Pengaturan Sistem</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-admin')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* System Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">ℹ️ Informasi Sistem</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Aplikasi</span>
                <span className="text-sm font-medium">SmartCare v1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Platform</span>
                <span className="text-sm font-medium">Web Mobile</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Database</span>
                <span className="text-sm font-medium">localStorage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Status</span>
                <span className="text-sm font-medium text-success">🟢 Online</span>
              </div>
            </CardContent>
          </Card>

          {/* Storage Statistics */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">📊 Statistik Data</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Users</span>
                <span className="text-sm font-medium">{storageInfo.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Orders</span>
                <span className="text-sm font-medium">{storageInfo.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pending Applications</span>
                <span className="text-sm font-medium">{storageInfo.pendingApplications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pending Top-ups</span>
                <span className="text-sm font-medium">{storageInfo.pendingTopups}</span>
              </div>
            </CardContent>
          </Card>

          {/* Admin Account */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">👨‍💼 Akun Admin</h3>
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
                <span className="text-sm">Phone</span>
                <span className="text-sm font-medium">{currentUser.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Role</span>
                <span className="text-sm font-medium">ADMIN</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">📞 Kontak Perusahaan</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">📧 id.smartprobyarvin@gmail.com</p>
              <p className="text-sm">📱 081299660660</p>
              <p className="text-sm">🌍 Kab. Bandung - Jawa Barat - Indonesia</p>
            </CardContent>
          </Card>

          {/* System Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">⚙️ Aksi Sistem</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.reload()}
              >
                🔄 Refresh Aplikasi
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  console.log('All localStorage data:', {
                    users: localStorage.getItem('users'),
                    orders: localStorage.getItem('orders'),
                    applications: localStorage.getItem('mitra_applications'),
                    topups: localStorage.getItem('topup_requests'),
                    userBalances: localStorage.getItem('saldo_users'),
                    mitraBalances: localStorage.getItem('saldo_mitras'),
                    blocked: localStorage.getItem('blocked_accounts'),
                    chats: localStorage.getItem('chat_logs')
                  });
                  toast({
                    title: "Data Exported",
                    description: "Data telah diekspor ke console browser"
                  });
                }}
              >
                📊 Export Data ke Console
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={() => setShowResetDialog(true)}
              >
                🗑️ Reset Semua Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>⚠️ Konfirmasi Reset</DialogTitle>
            <DialogDescription>
              Tindakan ini akan menghapus semua data sistem dan tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tindakan ini akan menghapus SEMUA data termasuk:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Semua user dan mitra</li>
              <li>• Semua pesanan</li>
              <li>• Semua saldo</li>
              <li>• Semua chat logs</li>
              <li>• Semua aplikasi pending</li>
            </ul>
            <p className="text-sm font-semibold text-destructive">
              Data tidak dapat dikembalikan setelah direset!
            </p>
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowResetDialog(false)} className="flex-1">
                Batal
              </Button>
              <Button variant="destructive" onClick={handleResetData} className="flex-1">
                Reset Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettings;