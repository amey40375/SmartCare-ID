import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { 
  users, 
  mitraApplications, 
  orders, 
  topUpRequests, 
  chatMessages,
  type User, 
  type InsertUser,
  type MitraApplication,
  type InsertMitraApplication,
  type Order,
  type InsertOrder,
  type TopUpRequest,
  type InsertTopUpRequest,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Mitra application operations
  getMitraApplications(): Promise<MitraApplication[]>;
  createMitraApplication(application: InsertMitraApplication): Promise<MitraApplication>;
  updateMitraApplication(id: number, updates: Partial<InsertMitraApplication>): Promise<MitraApplication | undefined>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getOrdersByMitraId(mitraId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined>;

  // Top-up request operations
  getTopUpRequests(): Promise<TopUpRequest[]>;
  createTopUpRequest(request: InsertTopUpRequest): Promise<TopUpRequest>;
  updateTopUpRequest(id: number, updates: Partial<InsertTopUpRequest>): Promise<TopUpRequest | undefined>;

  // Chat message operations
  getChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Mitra application operations
  async getMitraApplications(): Promise<MitraApplication[]> {
    return await db.select().from(mitraApplications);
  }

  async createMitraApplication(application: InsertMitraApplication): Promise<MitraApplication> {
    const result = await db.insert(mitraApplications).values(application).returning();
    return result[0];
  }

  async updateMitraApplication(id: number, updates: Partial<InsertMitraApplication>): Promise<MitraApplication | undefined> {
    const result = await db.update(mitraApplications).set(updates).where(eq(mitraApplications.id, id)).returning();
    return result[0];
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrdersByMitraId(mitraId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.mitraId, mitraId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const result = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return result[0];
  }

  // Top-up request operations
  async getTopUpRequests(): Promise<TopUpRequest[]> {
    return await db.select().from(topUpRequests);
  }

  async createTopUpRequest(request: InsertTopUpRequest): Promise<TopUpRequest> {
    const result = await db.insert(topUpRequests).values(request).returning();
    return result[0];
  }

  async updateTopUpRequest(id: number, updates: Partial<InsertTopUpRequest>): Promise<TopUpRequest | undefined> {
    const result = await db.update(topUpRequests).set(updates).where(eq(topUpRequests.id, id)).returning();
    return result[0];
  }

  // Chat message operations
  async getChatMessages(): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }
}

// For backwards compatibility with the old interface
export class MemStorage implements IStorage {
  private dbStorage = new DatabaseStorage();

  async getUser(id: number): Promise<User | undefined> {
    return this.dbStorage.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.dbStorage.getUserByEmail(email);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.dbStorage.createUser(user);
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    return this.dbStorage.updateUser(id, updates);
  }

  async getAllUsers(): Promise<User[]> {
    return this.dbStorage.getAllUsers();
  }

  async getMitraApplications(): Promise<MitraApplication[]> {
    return this.dbStorage.getMitraApplications();
  }

  async createMitraApplication(application: InsertMitraApplication): Promise<MitraApplication> {
    return this.dbStorage.createMitraApplication(application);
  }

  async updateMitraApplication(id: number, updates: Partial<InsertMitraApplication>): Promise<MitraApplication | undefined> {
    return this.dbStorage.updateMitraApplication(id, updates);
  }

  async getOrders(): Promise<Order[]> {
    return this.dbStorage.getOrders();
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return this.dbStorage.getOrdersByUserId(userId);
  }

  async getOrdersByMitraId(mitraId: number): Promise<Order[]> {
    return this.dbStorage.getOrdersByMitraId(mitraId);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    return this.dbStorage.createOrder(order);
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    return this.dbStorage.updateOrder(id, updates);
  }

  async getTopUpRequests(): Promise<TopUpRequest[]> {
    return this.dbStorage.getTopUpRequests();
  }

  async createTopUpRequest(request: InsertTopUpRequest): Promise<TopUpRequest> {
    return this.dbStorage.createTopUpRequest(request);
  }

  async updateTopUpRequest(id: number, updates: Partial<InsertTopUpRequest>): Promise<TopUpRequest | undefined> {
    return this.dbStorage.updateTopUpRequest(id, updates);
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return this.dbStorage.getChatMessages();
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    return this.dbStorage.createChatMessage(message);
  }
}

export const storage = new MemStorage();
