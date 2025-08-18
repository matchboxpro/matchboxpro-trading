import { eq, desc } from "drizzle-orm";
import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "../database/connection";

export class UserRepository {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByNickname(nickname: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.nickname, nickname)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const result = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async getAllUsers(): Promise<any[]> {
    const result = await db.select({
      id: users.id,
      username: users.nickname,
      email: users.nickname, // Using nickname as email placeholder
      created_at: users.createdAt,
      last_login: users.createdAt, // Using createdAt as placeholder
      is_active: users.isPremium // Using isPremium as active status placeholder
    }).from(users).orderBy(desc(users.createdAt));
    
    return result.map(user => ({
      ...user,
      username: user.username || `user_${user.id.slice(0, 8)}`
    }));
  }

  async updateUserStatus(userId: number, isActive: boolean): Promise<void> {
    await db.update(users)
      .set({ isPremium: isActive }) // Using isPremium field as status
      .where(eq(users.id, userId.toString()));
  }
}
