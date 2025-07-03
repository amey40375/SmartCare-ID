// SmartCare localStorage utility functions
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'mitra' | 'admin';
  address?: string;
  createdAt: string;
  isBlocked?: boolean;
  skills?: ('SmartMassage' | 'SmartBarber' | 'SmartClean')[];
}

export interface MitraApplication {
  id: string;
  name: string;
  phone: string;
  address: string;
  skills: string[];
  reason: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Order {
  id: string;
  userId: string;
  mitraId?: string;
  service: 'SmartMassage' | 'SmartBarber' | 'SmartClean';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  rate: number;
  address: string;
  description?: string;
  paymentMethod?: 'balance' | 'cash';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  acceptedAt?: string;
  totalAmount?: number;
  duration?: number;
  commission?: number;
}

export interface TopUpRequest {
  id: string;
  userId: string;
  userType: 'user' | 'mitra';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  type: 'user' | 'admin' | 'mitra';
}

// Initialize default data
export const initializeDefaultData = () => {
  // Default admin account
  const defaultUsers: User[] = [
    {
      id: 'admin-1',
      email: 'admin@smartcare.com',
      name: 'Admin SmartCare',
      phone: '081299660660',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ];

  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  // Initialize other data structures
  if (!localStorage.getItem('mitra_applications')) {
    localStorage.setItem('mitra_applications', JSON.stringify([]));
  }
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('saldo_users')) {
    localStorage.setItem('saldo_users', JSON.stringify({}));
  }
  if (!localStorage.getItem('saldo_mitras')) {
    localStorage.setItem('saldo_mitras', JSON.stringify({}));
  }
  if (!localStorage.getItem('topup_requests')) {
    localStorage.setItem('topup_requests', JSON.stringify([]));
  }
  if (!localStorage.getItem('blocked_accounts')) {
    localStorage.setItem('blocked_accounts', JSON.stringify([]));
  }
  if (!localStorage.getItem('chat_logs')) {
    localStorage.setItem('chat_logs', JSON.stringify([]));
  }
  if (!localStorage.getItem('current_user')) {
    localStorage.setItem('current_user', JSON.stringify(null));
  }
};

// User management
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const addUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  return JSON.parse(localStorage.getItem('current_user') || 'null');
};

export const setCurrentUser = (user: User | null) => {
  localStorage.setItem('current_user', JSON.stringify(user));
};

// Mitra applications
export const getMitraApplications = (): MitraApplication[] => {
  return JSON.parse(localStorage.getItem('mitra_applications') || '[]');
};

export const addMitraApplication = (application: MitraApplication) => {
  const applications = getMitraApplications();
  applications.push(application);
  localStorage.setItem('mitra_applications', JSON.stringify(applications));
};

// Orders
export const getOrders = (): Order[] => {
  return JSON.parse(localStorage.getItem('orders') || '[]');
};

export const addOrder = (order: Order) => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const updateOrder = (orderId: string, updates: Partial<Order>) => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updates };
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};

// Balance management
export const getUserBalance = (userId: string): number => {
  const balances = JSON.parse(localStorage.getItem('saldo_users') || '{}');
  return balances[userId] || 0;
};

export const getMitraBalance = (mitraId: string): number => {
  const balances = JSON.parse(localStorage.getItem('saldo_mitras') || '{}');
  return balances[mitraId] || 0;
};

export const updateUserBalance = (userId: string, amount: number) => {
  const balances = JSON.parse(localStorage.getItem('saldo_users') || '{}');
  balances[userId] = amount;
  localStorage.setItem('saldo_users', JSON.stringify(balances));
};

export const updateMitraBalance = (mitraId: string, amount: number) => {
  const balances = JSON.parse(localStorage.getItem('saldo_mitras') || '{}');
  balances[mitraId] = amount;
  localStorage.setItem('saldo_mitras', JSON.stringify(balances));
};

// Top-up requests
export const getTopUpRequests = (): TopUpRequest[] => {
  return JSON.parse(localStorage.getItem('topup_requests') || '[]');
};

export const addTopUpRequest = (request: TopUpRequest) => {
  const requests = getTopUpRequests();
  requests.push(request);
  localStorage.setItem('topup_requests', JSON.stringify(requests));
};

export const updateTopUpRequest = (requestId: string, updates: Partial<TopUpRequest>) => {
  const requests = getTopUpRequests();
  const index = requests.findIndex(r => r.id === requestId);
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates };
    localStorage.setItem('topup_requests', JSON.stringify(requests));
  }
};

// Blocked accounts
export const getBlockedAccounts = (): string[] => {
  return JSON.parse(localStorage.getItem('blocked_accounts') || '[]');
};

export const blockAccount = (userId: string) => {
  const blocked = getBlockedAccounts();
  if (!blocked.includes(userId)) {
    blocked.push(userId);
    localStorage.setItem('blocked_accounts', JSON.stringify(blocked));
  }
};

export const unblockAccount = (userId: string) => {
  const blocked = getBlockedAccounts();
  const filtered = blocked.filter(id => id !== userId);
  localStorage.setItem('blocked_accounts', JSON.stringify(filtered));
};

// Chat
export const getChatMessages = (): ChatMessage[] => {
  return JSON.parse(localStorage.getItem('chat_logs') || '[]');
};

export const addChatMessage = (message: ChatMessage) => {
  const messages = getChatMessages();
  messages.push(message);
  localStorage.setItem('chat_logs', JSON.stringify(messages));
};