import { IStorage } from "./interfaces/IStorage";
import { UserRepository } from "./repositories/UserRepository";
import { AlbumRepository } from "./repositories/AlbumRepository";
import { StickerRepository } from "./repositories/StickerRepository";
import { MatchRepository } from "./repositories/MatchRepository";
import { MessageRepository } from "./repositories/MessageRepository";
import { ReportRepository } from "./repositories/ReportRepository";
import { AdminRepository } from "./repositories/AdminRepository";

import type { 
  User, InsertUser, Album, InsertAlbum, 
  Sticker, InsertSticker, UserSticker, InsertUserSticker,
  Match, InsertMatch, Message, InsertMessage,
  Report, InsertReport
} from "@shared/schema";

export class DatabaseStorage implements IStorage {
  private userRepo = new UserRepository();
  private albumRepo = new AlbumRepository();
  private stickerRepo = new StickerRepository();
  private matchRepo = new MatchRepository();
  private messageRepo = new MessageRepository();
  private reportRepo = new ReportRepository();
  private adminRepo = new AdminRepository();

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.userRepo.getUser(id);
  }

  async getUserByNickname(nickname: string): Promise<User | undefined> {
    return this.userRepo.getUserByNickname(nickname);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.userRepo.createUser(user);
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    return this.userRepo.updateUser(id, updates);
  }

  async getAllUsers(): Promise<any[]> {
    return this.userRepo.getAllUsers();
  }

  async updateUserStatus(userId: number, isActive: boolean): Promise<void> {
    return this.userRepo.updateUserStatus(userId, isActive);
  }

  // Albums
  async getAlbums(): Promise<Album[]> {
    return this.albumRepo.getAlbumsOrdered();
  }

  async getAlbum(id: string): Promise<Album | undefined> {
    return this.albumRepo.getAlbum(id);
  }

  async createAlbum(album: InsertAlbum): Promise<Album> {
    return this.albumRepo.createAlbum(album);
  }

  async updateAlbum(id: string, updates: Partial<InsertAlbum>): Promise<Album> {
    return this.albumRepo.updateAlbum(id, updates);
  }

  async deleteAlbum(id: string): Promise<void> {
    return this.albumRepo.deleteAlbum(id);
  }

  async updateAlbumsOrder(albumsOrder: { id: string; displayOrder: number }[]): Promise<void> {
    return this.albumRepo.updateAlbumsOrder(albumsOrder);
  }

  // Stickers
  async getStickersByAlbum(albumId: string): Promise<Sticker[]> {
    return this.stickerRepo.getStickersByAlbum(albumId);
  }

  async getSticker(id: string): Promise<Sticker | undefined> {
    return this.stickerRepo.getSticker(id);
  }

  async createSticker(sticker: InsertSticker): Promise<Sticker> {
    return this.stickerRepo.createSticker(sticker);
  }

  async updateSticker(id: string, updates: Partial<InsertSticker>): Promise<Sticker> {
    return this.stickerRepo.updateSticker(id, updates);
  }

  async deleteSticker(id: string): Promise<void> {
    return this.stickerRepo.deleteSticker(id);
  }

  async deleteAllStickersFromAlbum(albumId: string): Promise<void> {
    return this.stickerRepo.deleteAllStickersFromAlbum(albumId);
  }

  async createMultipleStickers(stickers: InsertSticker[]): Promise<Sticker[]> {
    return this.stickerRepo.createMultipleStickers(stickers);
  }

  async createStickers(stickers: InsertSticker[]): Promise<Sticker[]> {
    return this.stickerRepo.createMultipleStickers(stickers);
  }

  async getUserStickers(userId: string, albumId: string): Promise<(UserSticker & { sticker: Sticker })[]> {
    return this.stickerRepo.getUserStickers(userId, albumId);
  }

  async updateUserSticker(userId: string, stickerId: string, status: string): Promise<UserSticker> {
    return this.stickerRepo.updateUserSticker(userId, stickerId, status);
  }

  // Matches
  async findMatches(userId: string, albumId: string, radiusKm: number, userCap: string): Promise<User[]> {
    return this.matchRepo.findMatches(userId, albumId, radiusKm, userCap);
  }

  async findPotentialMatches(userId: string, albumId: string): Promise<{
    user: User;
    myNeeds: string[];
    myDoubles: string[];
    theirNeeds: string[];
    theirDoubles: string[];
    possibleExchanges: Array<{ myDouble: string; theirNeed: string }>;
  }[]> {
    return this.matchRepo.findPotentialMatches(userId, albumId);
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    return this.matchRepo.createMatch(match);
  }

  async getUserMatches(userId: string): Promise<(Match & { user1: User; user2: User; album: Album })[]> {
    return this.matchRepo.getUserMatches(userId);
  }

  async updateMatch(id: string, updates: Partial<InsertMatch>): Promise<Match> {
    return this.matchRepo.updateMatch(id, updates);
  }

  // Messages
  async getMatchMessages(matchId: string): Promise<(Message & { sender: User })[]> {
    return this.messageRepo.getMatchMessages(matchId);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    return this.messageRepo.createMessage(message);
  }

  // Reports
  async getReports(): Promise<(Report & { reporter: User; reportedUser?: User })[]> {
    return this.reportRepo.getReports();
  }

  async getReportsWithPagination(filters: {
    status?: string;
    priority?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    reports: (Report & { reporter: User; reportedUser?: User })[];
    total: number;
    hasNextPage: boolean;
  }> {
    return this.reportRepo.getReportsWithPagination(filters);
  }

  async createReport(report: InsertReport): Promise<Report> {
    return this.reportRepo.createReport(report);
  }

  async updateReport(id: string, updates: { status?: string; priority?: string }): Promise<Report> {
    return this.reportRepo.updateReport(id, updates);
  }

  // Admin Stats
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalMatches: number;
    activeAlbums: number;
    pendingReports: number;
  }> {
    return this.adminRepo.getAdminStats();
  }
}
