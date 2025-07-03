import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUsers, getCurrentUser } from '@/utils/localStorage';
import type { User } from '@/utils/localStorage';

const UserMitras = () => {
  const [, navigate] = useLocation();
  const [mitras, setMitras] = useState<User[]>([]);
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'user') {
      navigate('/landing');
      return;
    }
    loadMitras();
  }, [currentUser, navigate]);

  const loadMitras = () => {
    const users = getUsers();
    const activeMitras = users.filter(u => u.role === 'mitra' && !u.isBlocked);
    setMitras(activeMitras);
  };

  const getMitrasByService = (service: string) => {
    return mitras.filter(m => m.skills?.includes(service as 'SmartMassage' | 'SmartBarber' | 'SmartClean'));
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'SmartMassage': return '💆';
      case 'SmartBarber': return '💇';
      case 'SmartClean': return '🧹';
      default: return '🧑‍🔧';
    }
  };

  const handleSelectMitra = (mitra: User) => {
    // Store selected mitra and redirect to order page
    localStorage.setItem('selected_mitra', JSON.stringify(mitra));
    navigate('/user-order');
  };

  const MitraCard = ({ mitra }: { mitra: User }) => (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{mitra.name}</h3>
              <p className="text-sm text-muted-foreground">📱 {mitra.phone}</p>
              {mitra.address && (
                <p className="text-sm text-muted-foreground">📍 {mitra.address}</p>
              )}
            </div>
            <span className="text-xs px-2 py-1 bg-success/10 text-success rounded">
              ✅ AKTIF
            </span>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Keahlian:</p>
            <div className="flex flex-wrap gap-1">
              {mitra.skills?.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  {getServiceIcon(skill)} {skill}
                </span>
              ))}
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => handleSelectMitra(mitra)}
          >
            📋 Pilih Mitra
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (!currentUser) return null;

  const massageMitras = getMitrasByService('SmartMassage');
  const barberMitras = getMitrasByService('SmartBarber');
  const cleanMitras = getMitrasByService('SmartClean');

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Pilih Mitra</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-user')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-primary/10">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-primary">{massageMitras.length}</div>
              <div className="text-xs text-muted-foreground">Massage</div>
            </CardContent>
          </Card>
          <Card className="bg-secondary/10">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-secondary">{barberMitras.length}</div>
              <div className="text-xs text-muted-foreground">Barber</div>
            </CardContent>
          </Card>
          <Card className="bg-accent/10">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-accent">{cleanMitras.length}</div>
              <div className="text-xs text-muted-foreground">Clean</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">Semua</TabsTrigger>
            <TabsTrigger value="massage" className="text-xs">💆</TabsTrigger>
            <TabsTrigger value="barber" className="text-xs">💇</TabsTrigger>
            <TabsTrigger value="clean" className="text-xs">🧹</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-3">
              {mitras.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🧑‍🔧</div>
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Mitra</h3>
                    <p className="text-muted-foreground">Belum ada mitra yang terverifikasi</p>
                  </CardContent>
                </Card>
              ) : (
                mitras.map((mitra) => <MitraCard key={mitra.id} mitra={mitra} />)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="massage" className="mt-4">
            <div className="space-y-3">
              {massageMitras.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">💆</div>
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Mitra Massage</h3>
                  </CardContent>
                </Card>
              ) : (
                massageMitras.map((mitra) => <MitraCard key={mitra.id} mitra={mitra} />)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="barber" className="mt-4">
            <div className="space-y-3">
              {barberMitras.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">💇</div>
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Mitra Barber</h3>
                  </CardContent>
                </Card>
              ) : (
                barberMitras.map((mitra) => <MitraCard key={mitra.id} mitra={mitra} />)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="clean" className="mt-4">
            <div className="space-y-3">
              {cleanMitras.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🧹</div>
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Mitra Clean</h3>
                  </CardContent>
                </Card>
              ) : (
                cleanMitras.map((mitra) => <MitraCard key={mitra.id} mitra={mitra} />)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserMitras;