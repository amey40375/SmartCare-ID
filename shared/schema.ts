import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - supports multiple roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  role: text("role").notNull().default("user"), // 'user', 'mitra', 'admin'
  address: text("address"),
  isBlocked: boolean("is_blocked").default(false),
  skills: text("skills").array(), // For mitra: ['SmartMassage', 'SmartBarber', 'SmartClean']
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mitra applications table
export const mitraApplications = pgTable("mitra_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  skills: text("skills").array().notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  appliedAt: timestamp("applied_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mitraId: integer("mitra_id"),
  service: text("service").notNull(), // 'SmartMassage', 'SmartBarber', 'SmartClean'
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  address: text("address").notNull(),
  description: text("description"),
  paymentMethod: text("payment_method"), // 'balance', 'cash'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  duration: integer("duration"), // in minutes
  commission: decimal("commission", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

// Top-up requests table
export const topUpRequests = pgTable("topup_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  userType: text("user_type").notNull(), // 'user', 'mitra'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'user', 'admin', 'mitra'
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMitraApplicationSchema = createInsertSchema(mitraApplications).omit({
  id: true,
  appliedAt: true,
  processedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  acceptedAt: true,
  startedAt: true,
  completedAt: true,
});

export const insertTopUpRequestSchema = createInsertSchema(topUpRequests).omit({
  id: true,
  requestedAt: true,
  processedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMitraApplication = z.infer<typeof insertMitraApplicationSchema>;
export type MitraApplication = typeof mitraApplications.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertTopUpRequest = z.infer<typeof insertTopUpRequestSchema>;
export type TopUpRequest = typeof topUpRequests.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
