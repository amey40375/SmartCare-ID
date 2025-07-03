import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getUsers, setCurrentUser } from '../utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Email tidak boleh kosong",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const users = getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        toast({
          title: "Login Gagal",
          description: "Akun tidak ditemukan",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Set current user
      setCurrentUser(user);

      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${user.name}!`
      });

      // Redirect based on role
      setTimeout(() => {
        switch (user.role) {
          case 'admin':
            navigate('/dashboard-admin');
            break;
          case 'mitra':
            navigate('/dashboard-mitra');
            break;
          case 'user':
            navigate('/dashboard-user');
            break;
          default:
            navigate('/landing');
        }
      }, 1000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
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
          <h1 className="text-3xl font-poppins font-bold text-gradient-primary mb-2">
            SmartCare
          </h1>
          <p className="text-muted-foreground">
            Masuk ke akun Anda
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-semibold">Login</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            <Button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12 bg-gradient-primary hover:opacity-90"
            >
              {loading ? 'Memuat...' : '🔐 Masuk'}
            </Button>


            {/* Navigation Links */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Belum punya akun?
              </p>
              <div className="flex gap-2">
                <Link to="/register-user" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Daftar User
                  </Button>
                </Link>
                <Link to="/register-mitra" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Daftar Mitra
                  </Button>
                </Link>
              </div>
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

        {/* Contact Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Butuh bantuan? Hubungi kami:</p>
          <p>📧 id.smartprobyarvin@gmail.com</p>
          <p>📱 081299660660</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;