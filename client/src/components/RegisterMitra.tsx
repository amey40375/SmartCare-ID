import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { addMitraApplication } from '../utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const RegisterMitra = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    skills: [] as string[],
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  const skills = [
    { id: 'SmartMassage', label: '💆 SmartMassage (Pijat Urut)' },
    { id: 'SmartBarber', label: '💇 SmartBarber (Potong Rambut)' },
    { id: 'SmartClean', label: '🧹 SmartClean (Bersih-Bersih Rumah)' }
  ];

  const handleSkillChange = (skillId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillId]
      });
    } else {
      setFormData({
        ...formData,
        skills: formData.skills.filter(s => s !== skillId)
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || 
        formData.skills.length === 0 || !formData.reason.trim()) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const application = {
        id: `mitra-app-${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        skills: formData.skills,
        reason: formData.reason,
        appliedAt: new Date().toISOString(),
        status: 'pending' as const
      };

      addMitraApplication(application);

      toast({
        title: "Pendaftaran Berhasil",
        description: "Formulir pendaftaran mitra telah dikirim. Admin akan memverifikasi dalam 1x24 jam."
      });

      setTimeout(() => {
        navigate('/landing');
      }, 2000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim pendaftaran",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">🧑‍🔧</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-gradient-primary mb-2">
            Daftar Sebagai Mitra
          </h1>
          <p className="text-muted-foreground">
            Bergabung dengan tim profesional SmartCare
          </p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-semibold">🧑‍🔧 Pendaftaran Mitra</h2>
            <p className="text-sm text-muted-foreground">
              Admin akan memverifikasi dalam 1x24 jam
            </p>
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
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea
                id="address"
                placeholder="Masukkan alamat lengkap"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3">
              <Label>Keahlian/Layanan yang Dikuasai *</Label>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={skill.id}
                      checked={formData.skills.includes(skill.id)}
                      onCheckedChange={(checked) => handleSkillChange(skill.id, checked as boolean)}
                    />
                    <Label htmlFor={skill.id} className="flex-1 text-sm">
                      {skill.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Alasan Bergabung dengan SmartCare *</Label>
              <Textarea
                id="reason"
                placeholder="Ceritakan motivasi dan pengalaman Anda..."
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="min-h-[100px]"
              />
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 bg-gradient-secondary hover:opacity-90"
            >
              {loading ? 'Mengirim...' : '📝 Kirim Pendaftaran'}
            </Button>

            <div className="bg-muted p-4 rounded-lg text-sm">
              <h4 className="font-medium mb-2">📋 Proses Selanjutnya:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>1. Admin akan memverifikasi data Anda</li>
                <li>2. Jika disetujui, admin akan membuat akun login</li>
                <li>3. Anda akan dihubungi via WhatsApp</li>
              </ul>
            </div>

            <div className="text-center space-y-2 pt-4">
              <p className="text-sm text-muted-foreground">
                Sudah punya akun mitra?
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

        {/* Contact Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Butuh bantuan? Hubungi kami:</p>
          <p>📧 id.smartprobyarvin@gmail.com</p>
          <p>📱 081299660660</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterMitra;