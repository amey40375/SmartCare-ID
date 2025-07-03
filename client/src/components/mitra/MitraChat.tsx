import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getCurrentUser } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const MitraChat = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentUser] = useState(getCurrentUser());
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'mitra') {
      navigate('/landing');
      return;
    }
    loadMessages();
  }, [currentUser, navigate]);

  const loadMessages = () => {
    const chatLogs = JSON.parse(localStorage.getItem('chat_logs') || '{}');
    const mitraMessages = chatLogs[currentUser!.id] || [];
    setMessages(mitraMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      sender: currentUser!.id,
      senderName: currentUser!.name,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'mitra_to_admin'
    };

    const chatLogs = JSON.parse(localStorage.getItem('chat_logs') || '{}');
    if (!chatLogs[currentUser!.id]) {
      chatLogs[currentUser!.id] = [];
    }
    chatLogs[currentUser!.id].push(message);
    localStorage.setItem('chat_logs', JSON.stringify(chatLogs));

    setMessages([...messages, message]);
    setNewMessage('');

    toast({
      title: "Pesan Terkirim",
      description: "Pesan Anda telah dikirim ke admin"
    });
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-poppins font-bold text-gradient-primary">Live Chat</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard-mitra')}>
              ← Kembali
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* Chat Header */}
          <Card className="bg-primary/10">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold">💬 Chat dengan Admin</h3>
              <p className="text-sm text-muted-foreground">
                Hubungi admin untuk bantuan atau keluhan
              </p>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Riwayat Chat</h3>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-muted-foreground">Belum ada pesan</p>
                  <p className="text-sm text-muted-foreground">Mulai chat dengan mengirim pesan</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.sender === currentUser.id
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-muted mr-4'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Send Message */}
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ketik pesan Anda..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  📤
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Messages */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Pesan Cepat</h3>
            <div className="space-y-2">
              {[
                "Halo admin, saya butuh bantuan",
                "Akun saya terkunci, mohon bantuan",
                "Ada masalah dengan pembayaran",
                "Saldo saya tidak bertambah setelah top-up",
                "User tidak merespon"
              ].map((quickMsg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewMessage(quickMsg)}
                  className="w-full justify-start text-left h-auto py-2"
                >
                  {quickMsg}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MitraChat;