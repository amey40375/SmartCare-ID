import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { addUser, getUsers } from '../utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const RegisterUser = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists
      const users = getUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      
      if (existingUser) {
        toast({
          title: "Registrasi Gagal",
          description: "Email sudah terdaftar",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        role: 'user' as const,
        createdAt: new Date().toISOString()
      };

      addUser(newUser);

      toast({
        title: "Registrasi Berhasil",
        description: "Akun berhasil dibuat. Silakan login."
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat registrasi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">SC</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-gradient-primary mb-2">
            Daftar Sebagai User
          </h1>
          <p className="text-muted-foreground">
            Bergabung dengan SmartCare untuk mendapatkan layanan terbaik
          </p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-semibold">👤 Registrasi User</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">No. HP/WhatsApp *</Label>
              <Input
                id="phone"
                placeholder="Masukkan nomor HP"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                placeholder="Masukkan alamat (opsional)"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="h-12"
              />
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 bg-gradient-primary hover:opacity-90"
            >
              {loading ? 'Mendaftar...' : '✅ Daftar Sekarang'}
            </Button>

            <div className="text-center space-y-2 pt-4">
              <p className="text-sm text-muted-foreground">
                Sudah punya akun?
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Masuk ke Akun
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <Link to="/landing">
                <Button variant="ghost" size="sm">
                  ← Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Dengan mendaftar, Anda menyetujui syarat dan ketentuan SmartCare</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;