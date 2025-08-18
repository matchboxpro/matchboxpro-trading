import { eq, asc, and } from "drizzle-orm";
import { stickers, userStickers, type Sticker, type InsertSticker, type UserSticker } from "@shared/schema";
import { db } from "../database/connection";

export class StickerRepository {
  async getStickersByAlbum(albumId: string): Promise<Sticker[]> {
    return await db.select().from(stickers)
      .where(eq(stickers.albumId, albumId))
      .orderBy(asc(stickers.number));
  }

  async getSticker(id: string): Promise<Sticker | undefined> {
    const result = await db.select().from(stickers).where(eq(stickers.id, id)).limit(1);
    return result[0];
  }

  async createSticker(sticker: InsertSticker): Promise<Sticker> {
    const result = await db.insert(stickers).values(sticker).returning();
    return result[0];
  }

  async updateSticker(id: string, updates: Partial<InsertSticker>): Promise<Sticker> {
    const result = await db.update(stickers)
      .set(updates)
      .where(eq(stickers.id, id))
      .returning();
    return result[0];
  }

  async deleteSticker(id: string): Promise<void> {
    await db.delete(stickers).where(eq(stickers.id, id));
  }

  async createMultipleStickers(stickerList: InsertSticker[]): Promise<Sticker[]> {
    if (stickerList.length === 0) return [];
    const result = await db.insert(stickers).values(stickerList).returning();
    return result;
  }

  async deleteAllStickersFromAlbum(albumId: string): Promise<void> {
    await db.delete(stickers).where(eq(stickers.albumId, albumId));
  }

  async getUserStickers(userId: string, albumId: string): Promise<(UserSticker & { sticker: Sticker })[]> {
    const result = await db
      .select({
        id: userStickers.id,
        userId: userStickers.userId,
        stickerId: userStickers.stickerId,
        status: userStickers.status,
        updatedAt: userStickers.updatedAt,
        sticker: stickers,
      })
      .from(userStickers)
      .innerJoin(stickers, eq(userStickers.stickerId, stickers.id))
      .where(and(
        eq(userStickers.userId, userId),
        eq(stickers.albumId, albumId)
      ))
      .orderBy(asc(stickers.number));
    
    return result;
  }

  async updateUserSticker(userId: string, stickerId: string, status: string): Promise<UserSticker> {
    // Check if user sticker exists
    const existing = await db.select()
      .from(userStickers)
      .where(and(
        eq(userStickers.userId, userId),
        eq(userStickers.stickerId, stickerId)
      ))
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      const result = await db.update(userStickers)
        .set({ status, updatedAt: new Date() })
        .where(and(
          eq(userStickers.userId, userId),
          eq(userStickers.stickerId, stickerId)
        ))
        .returning();
      return result[0];
    } else {
      // Create new
      const result = await db.insert(userStickers)
        .values({ userId, stickerId, status })
        .returning();
      return result[0];
    }
  }
}
