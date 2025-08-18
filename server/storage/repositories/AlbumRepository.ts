import { eq, desc, count } from "drizzle-orm";
import { albums, stickers, type Album, type InsertAlbum } from "@shared/schema";
import { db } from "../database/connection";

export class AlbumRepository {
  async getAlbums(): Promise<Album[]> {
    const albumsWithCount = await db
      .select({
        id: albums.id,
        name: albums.name,
        year: albums.year,
        isActive: albums.isActive,
        createdAt: albums.createdAt,
        stickerCount: count(stickers.id)
      })
      .from(albums)
      .leftJoin(stickers, eq(albums.id, stickers.albumId))
      .where(eq(albums.isActive, true))
      .groupBy(albums.id, albums.name, albums.year, albums.isActive, albums.createdAt)
      .orderBy(desc(albums.createdAt));
    
    return albumsWithCount;
  }

  async getAlbum(id: string): Promise<Album | undefined> {
    const result = await db.select().from(albums).where(eq(albums.id, id)).limit(1);
    return result[0];
  }

  async createAlbum(album: InsertAlbum): Promise<Album> {
    const result = await db.insert(albums).values(album).returning();
    return result[0];
  }

  async updateAlbum(id: string, updates: Partial<InsertAlbum>): Promise<Album> {
    const result = await db.update(albums)
      .set(updates)
      .where(eq(albums.id, id))
      .returning();
    return result[0];
  }

  async deleteAlbum(id: string): Promise<void> {
    await db.delete(albums).where(eq(albums.id, id));
  }
}
