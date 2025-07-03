import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertMitraApplicationSchema,
  insertOrderSchema,
  insertTopUpRequestSchema,
  insertChatMessageSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // In production, use proper session management or JWT
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(user => ({ ...user, password: undefined }));
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      delete updates.password; // Don't allow password updates through this route
      const user = await storage.updateUser(parseInt(req.params.id), updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Mitra application routes
  app.get("/api/mitra-applications", async (req, res) => {
    try {
      const applications = await storage.getMitraApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mitra applications" });
    }
  });

  app.post("/api/mitra-applications", async (req, res) => {
    try {
      const applicationData = insertMitraApplicationSchema.parse(req.body);
      const application = await storage.createMitraApplication(applicationData);
      res.json(application);
    } catch (error) {
      res.status(400).json({ error: "Failed to create mitra application" });
    }
  });

  app.patch("/api/mitra-applications/:id", async (req, res) => {
    try {
      const updates = req.body;
      const application = await storage.updateMitraApplication(parseInt(req.params.id), updates);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to update mitra application" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByUserId(parseInt(req.params.userId));
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  });

  app.get("/api/orders/mitra/:mitraId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByMitraId(parseInt(req.params.mitraId));
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mitra orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const updates = req.body;
      const order = await storage.updateOrder(parseInt(req.params.id), updates);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // Top-up request routes
  app.get("/api/topup-requests", async (req, res) => {
    try {
      const requests = await storage.getTopUpRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top-up requests" });
    }
  });

  app.post("/api/topup-requests", async (req, res) => {
    try {
      const requestData = insertTopUpRequestSchema.parse(req.body);
      const request = await storage.createTopUpRequest(requestData);
      res.json(request);
    } catch (error) {
      res.status(400).json({ error: "Failed to create top-up request" });
    }
  });

  app.patch("/api/topup-requests/:id", async (req, res) => {
    try {
      const updates = req.body;
      const request = await storage.updateTopUpRequest(parseInt(req.params.id), updates);
      if (!request) {
        return res.status(404).json({ error: "Top-up request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to update top-up request" });
    }
  });

  // Chat message routes
  app.get("/api/chat-messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat-messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Failed to create chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
