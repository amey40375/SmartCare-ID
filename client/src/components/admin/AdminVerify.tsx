import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getMitraApplications, addUser, getCurrentUser } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import type { MitraApplication } from '@/utils/localStorage';

const AdminVerify = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [applications, setApplications] = useState<MitraApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<MitraApplication | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [user] = useState(getCurrentUser());

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/landing');
      return;
    }
    loadApplications();
  }, [user, navigate]);

  const loadApplications = () => {
    const apps = getMitraApplications();
    const pending = apps.filter(app => app.status === 'pending');
    setApplications(pending);
  };

  const handleVerify = (application: MitraApplication) => {
    setSelectedApp(application);
    setFormData({
      email: '',
      password: ''
    });
    setShowDialog(true);
  };

  const handleCreateAccount = () => {
    if (!selectedApp || !formData.email.trim() || !formData.password.trim()) {
      toast({
        title: "Error",
        description: "Mohon lengkapi email dan password",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create mitra account
      const newMitra = {
        id: `mitra-${Date.now()}`,
        email: formData.email,
        name: selectedApp.name,
        phone: selectedApp.phone,
        address: selectedApp.address,
        role: 'mitra' as const,
        skills: selectedApp.skills as ('SmartMassage' | 'SmartBarber' | 'SmartClean')[],
        createdAt: new Date().toISOString(),
        isBlocked: false
      };

      addUser(newMitra);

      // Update application status
      const apps = getMitraApplications();
      const updatedApps = apps.map(app => 
        app.id === selectedApp.id 
          ? { ...app, status: 'approved' as const }
          : app
      );
      localStorage.setItem('mitra_applications', JSON.stringify(updatedApps));

      // Initialize mitra balance
      const balances = JSON.parse(localStorage.getItem('saldo_mitras') || '{}');
      balances[newMitra.id] = 0;
      localStorage.setItem('saldo_mitras', JSON.stringify(balances));

      toast({
        title: "Berhasil",
        description: `Akun mitra ${selectedApp.name} telah dibuat`
      });

      setShowDialog(false);
      loadApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat akun",
        variant: "destructive"
      });
    }
  };

  const handleReject = (application: MitraApplication) => {
    const apps = getMitraApplications();
    const updatedApps = apps.map(app => 
      app.id === application.id 
        ? { ...app, status: 'rejected' as const }
        : app
    );
    localStorage.setItem('mitra_applications', JSON.stringify(updatedApps));
    
    toast({
      title: "Ditolak",
      description: `Pendaftaran ${application.name} telah ditolak`
    });
    
    loadApplications();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Verifikasi Mitra</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-admin')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold mb-2">Tidak Ada Pendaftar</h3>
              <p className="text-muted-foreground">
                Semua pendaftaran mitra telah diproses
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              {applications.length} pendaftar menunggu verifikasi
            </p>
            
            {applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">📱 {app.phone}</p>
                      <p className="text-sm text-muted-foreground">📍 {app.address}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Keahlian:</p>
                      <div className="flex flex-wrap gap-1">
                        {app.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                            {skill === 'SmartMassage' && '💆 Massage'}
                            {skill === 'SmartBarber' && '💇 Barber'}
                            {skill === 'SmartClean' && '🧹 Clean'}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Alasan Bergabung:</p>
                      <p className="text-sm text-muted-foreground">{app.reason}</p>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleVerify(app)}
                      >
                        ✅ Terima
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleReject(app)}
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

      {/* Create Account Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Buat Akun Mitra</DialogTitle>
            <DialogDescription>
              Buat akun login untuk mitra yang telah diverifikasi
            </DialogDescription>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama: {selectedApp.name}</p>
                <p className="text-sm text-muted-foreground">HP: {selectedApp.phone}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Login</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                  Batal
                </Button>
                <Button onClick={handleCreateAccount} className="flex-1">
                  Buat Akun
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVerify;