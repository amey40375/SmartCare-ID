import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUsers, getBlockedAccounts, blockAccount, unblockAccount, getCurrentUser } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/utils/localStorage';

const AdminBlock = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [mitras, setMitras] = useState<User[]>([]);
  const [blockedAccounts, setBlockedAccounts] = useState<string[]>([]);
  const [currentUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/landing');
      return;
    }
    loadData();
  }, [currentUser, navigate]);

  const loadData = () => {
    const allUsers = getUsers();
    const mitraList = allUsers.filter(u => u.role === 'mitra');
    setMitras(mitraList);
    
    const blocked = getBlockedAccounts();
    setBlockedAccounts(blocked);
  };

  const handleBlock = (mitraId: string) => {
    const mitra = mitras.find(m => m.id === mitraId);
    if (!mitra) return;

    blockAccount(mitraId);
    
    // Update user isBlocked status
    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.id === mitraId ? { ...u, isBlocked: true } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast({
      title: "Akun Diblokir",
      description: `Mitra ${mitra.name} telah diblokir`
    });

    loadData();
  };

  const handleUnblock = (mitraId: string) => {
    const mitra = mitras.find(m => m.id === mitraId);
    if (!mitra) return;

    unblockAccount(mitraId);
    
    // Update user isBlocked status
    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.id === mitraId ? { ...u, isBlocked: false } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast({
      title: "Blokir Dibuka",
      description: `Mitra ${mitra.name} telah dibuka blokirnya`
    });

    loadData();
  };

  if (!currentUser) return null;

  const activeMitras = mitras.filter(m => !blockedAccounts.includes(m.id));
  const blockedMitras = mitras.filter(m => blockedAccounts.includes(m.id));

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Blokir / Buka Mitra</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-admin')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-success/10">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-success">{activeMitras.length}</div>
              <div className="text-xs text-muted-foreground">Mitra Aktif</div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/10">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-destructive">{blockedMitras.length}</div>
              <div className="text-xs text-muted-foreground">Mitra Diblokir</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">🧑‍🔧 Aktif ({activeMitras.length})</TabsTrigger>
            <TabsTrigger value="blocked">🚫 Diblokir ({blockedMitras.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4">
            <div className="space-y-3">
              {activeMitras.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🧑‍🔧</div>
                    <h3 className="text-lg font-semibold mb-2">Tidak Ada Mitra Aktif</h3>
                    <p className="text-muted-foreground">
                      Belum ada mitra yang terverifikasi
                    </p>
                  </CardContent>
                </Card>
              ) : (
                activeMitras.map((mitra) => (
                  <Card key={mitra.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{mitra.name}</h3>
                            <p className="text-sm text-muted-foreground">📧 {mitra.email}</p>
                            <p className="text-sm text-muted-foreground">📱 {mitra.phone}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-success/10 text-success rounded">
                            ✅ AKTIF
                          </span>
                        </div>
                        
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleBlock(mitra.id)}
                        >
                          🚫 Blokir Mitra
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="blocked" className="mt-4">
            <div className="space-y-3">
              {blockedMitras.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-lg font-semibold mb-2">Tidak Ada Mitra Diblokir</h3>
                    <p className="text-muted-foreground">
                      Semua mitra dalam status aktif
                    </p>
                  </CardContent>
                </Card>
              ) : (
                blockedMitras.map((mitra) => (
                  <Card key={mitra.id} className="border-destructive/20">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{mitra.name}</h3>
                            <p className="text-sm text-muted-foreground">📧 {mitra.email}</p>
                            <p className="text-sm text-muted-foreground">📱 {mitra.phone}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded">
                            🚫 DIBLOKIR
                          </span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-success text-success hover:bg-success hover:text-white"
                          onClick={() => handleUnblock(mitra.id)}
                        >
                          ✅ Buka Blokir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminBlock;