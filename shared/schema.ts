import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product 타입 정의
export interface Product {
  id: string;
  productName: string;
  productUrl: string;
  imageUrl: string;
  category: string;
  pricing: {
    regularPrice: number;
    salePrice: number;
    couponPrice: number;
    discountPercentage: number;
    currency: string;
  };
  stock: {
    available: boolean;
    quantity: number;
  };
  stats: {
    purchaseCount: number;
    rating: number;
    reviewCount: number;
  };
  description: string;
  accessibilityLevel: 'none' | 'role-text' | 'aria-label';
}

export interface InsertProduct {
  productName: string;
  productUrl: string;
  imageUrl: string;
  category: string;
  pricing: {
    regularPrice: number;
    salePrice: number;
    couponPrice: number;
    discountPercentage: number;
    currency: string;
  };
  stock: {
    available: boolean;
    quantity: number;
  };
  stats: {
    purchaseCount: number;
    rating: number;
    reviewCount: number;
  };
  description: string;
  accessibilityLevel: 'none' | 'role-text' | 'aria-label';
}
