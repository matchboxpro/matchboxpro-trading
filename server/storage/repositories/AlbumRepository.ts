import { eq, desc, count } from "drizzle-orm";
import { albums, stickers, type Album, type InsertAlbum } from "@shared/schema";
import { db } from "../database/connection";
import fs from 'fs';
import path from 'path';

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

  private getOrderFilePath(): string {
    return path.join(process.cwd(), 'album-order.json');
  }

  private loadAlbumOrder(): string[] {
    try {
      const orderFile = this.getOrderFilePath();
      if (fs.existsSync(orderFile)) {
        const data = fs.readFileSync(orderFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.log('No album order file found, using default order');
    }
    return [];
  }

  private saveAlbumOrder(order: string[]): void {
    try {
      const orderFile = this.getOrderFilePath();
      fs.writeFileSync(orderFile, JSON.stringify(order, null, 2));
    } catch (error) {
      console.error('Error saving album order:', error);
    }
  }

  async updateAlbumsOrder(albumsOrder: { id: string; displayOrder: number }[]): Promise<void> {
    // Salva l'ordine su file
    const order = albumsOrder
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(item => item.id);
    
    this.saveAlbumOrder(order);
  }

  async getAlbumsOrdered(): Promise<Album[]> {
    const albums = await this.getAlbums();
    const savedOrder = this.loadAlbumOrder();
    
    if (savedOrder.length === 0) {
      return albums;
    }
    
    // Riordina gli album secondo l'ordine salvato
    const orderedAlbums = [];
    
    // Prima aggiungi gli album nell'ordine specificato
    for (const albumId of savedOrder) {
      const album = albums.find(a => a.id === albumId);
      if (album) {
        orderedAlbums.push(album);
      }
    }
    
    // Poi aggiungi eventuali nuovi album non ancora ordinati
    for (const album of albums) {
      if (!savedOrder.includes(album.id)) {
        orderedAlbums.push(album);
      }
    }
    
    return orderedAlbums;
  }
}
