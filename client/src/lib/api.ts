// Simple API helper functions for frontend to backend communication

const API_BASE = "/api";

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },

  async patch(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
};

// Authentication functions
export const auth = {
  async login(email: string, password: string) {
    return apiClient.post("/auth/login", { email, password });
  },

  async register(userData: any) {
    return apiClient.post("/auth/register", userData);
  }
};

// User functions
export const users = {
  async getAll() {
    return apiClient.get("/users");
  },

  async getById(id: number) {
    return apiClient.get(`/users/${id}`);
  },

  async update(id: number, updates: any) {
    return apiClient.patch(`/users/${id}`, updates);
  }
};

// Order functions
export const orders = {
  async getAll() {
    return apiClient.get("/orders");
  },

  async getByUserId(userId: number) {
    return apiClient.get(`/orders/user/${userId}`);
  },

  async getByMitraId(mitraId: number) {
    return apiClient.get(`/orders/mitra/${mitraId}`);
  },

  async create(orderData: any) {
    return apiClient.post("/orders", orderData);
  },

  async update(id: number, updates: any) {
    return apiClient.patch(`/orders/${id}`, updates);
  }
};

// Mitra application functions
export const mitraApplications = {
  async getAll() {
    return apiClient.get("/mitra-applications");
  },

  async create(applicationData: any) {
    return apiClient.post("/mitra-applications", applicationData);
  },

  async update(id: number, updates: any) {
    return apiClient.patch(`/mitra-applications/${id}`, updates);
  }
};

// Top-up request functions
export const topUpRequests = {
  async getAll() {
    return apiClient.get("/topup-requests");
  },

  async create(requestData: any) {
    return apiClient.post("/topup-requests", requestData);
  },

  async update(id: number, updates: any) {
    return apiClient.patch(`/topup-requests/${id}`, updates);
  }
};

// Chat message functions
export const chatMessages = {
  async getAll() {
    return apiClient.get("/chat-messages");
  },

  async create(messageData: any) {
    return apiClient.post("/chat-messages", messageData);
  }
};