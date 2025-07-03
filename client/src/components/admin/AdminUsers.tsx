import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUsers, getCurrentUser } from '@/utils/localStorage';
import type { User } from '@/utils/localStorage';

const AdminUsers = () => {
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [mitras, setMitras] = useState<User[]>([]);
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
    const userList = allUsers.filter(u => u.role === 'user');
    const mitraList = allUsers.filter(u => u.role === 'mitra');
    setUsers(userList);
    setMitras(mitraList);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Data User & Mitra</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-admin')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">👤 Users ({users.length})</TabsTrigger>
            <TabsTrigger value="mitras">🧑‍🔧 Mitras ({mitras.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-4">
            <div className="space-y-3">
              {users.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">👤</div>
                    <h3 className="text-lg font-semibold mb-2">Belum Ada User</h3>
                    <p className="text-muted-foreground">
                      Belum ada user yang terdaftar
                    </p>
                  </CardContent>
                </Card>
              ) : (
                users.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">{user.name}</h3>
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                            USER
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">📧 {user.email}</p>
                        <p className="text-sm text-muted-foreground">📱 {user.phone}</p>
                        {user.address && (
                          <p className="text-sm text-muted-foreground">📍 {user.address}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Bergabung: {new Date(user.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="mitras" className="mt-4">
            <div className="space-y-3">
              {mitras.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🧑‍🔧</div>
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Mitra</h3>
                    <p className="text-muted-foreground">
                      Belum ada mitra yang terverifikasi
                    </p>
                  </CardContent>
                </Card>
              ) : (
                mitras.map((mitra) => (
                  <Card key={mitra.id}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">{mitra.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${
                            mitra.isBlocked 
                              ? 'bg-destructive/10 text-destructive' 
                              : 'bg-secondary/10 text-secondary'
                          }`}>
                            {mitra.isBlocked ? '🚫 BLOCKED' : '🧑‍🔧 MITRA'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">📧 {mitra.email}</p>
                        <p className="text-sm text-muted-foreground">📱 {mitra.phone}</p>
                        {mitra.address && (
                          <p className="text-sm text-muted-foreground">📍 {mitra.address}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Bergabung: {new Date(mitra.createdAt).toLocaleDateString('id-ID')}
                        </p>
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

export default AdminUsers;