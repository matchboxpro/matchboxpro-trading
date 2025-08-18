import type { 
  User, InsertUser, Album, InsertAlbum, 
  Sticker, InsertSticker, UserSticker, InsertUserSticker,
  Match, InsertMatch, Message, InsertMessage,
  Report, InsertReport
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByNickname(nickname: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  
  // Albums
  getAlbums(): Promise<Album[]>;
  getAlbum(id: string): Promise<Album | undefined>;
  createAlbum(album: InsertAlbum): Promise<Album>;
  updateAlbum(id: string, updates: Partial<InsertAlbum>): Promise<Album>;
  deleteAlbum(id: string): Promise<void>;
  
  // Stickers
  getStickersByAlbum(albumId: string): Promise<Sticker[]>;
  getSticker(id: string): Promise<Sticker | undefined>;
  createSticker(sticker: InsertSticker): Promise<Sticker>;
  updateSticker(id: string, updates: Partial<InsertSticker>): Promise<Sticker>;
  deleteSticker(id: string): Promise<void>;
  createMultipleStickers(stickers: InsertSticker[]): Promise<Sticker[]>;
  
  // User Stickers
  getUserStickers(userId: string, albumId: string): Promise<(UserSticker & { sticker: Sticker })[]>;
  updateUserSticker(userId: string, stickerId: string, status: string): Promise<UserSticker>;
  
  // Matches
  findMatches(userId: string, albumId: string, radiusKm: number, userCap: string): Promise<User[]>;
  findPotentialMatches(userId: string, albumId: string): Promise<{
    user: User;
    myNeeds: string[];
    myDoubles: string[];
    theirNeeds: string[];
    theirDoubles: string[];
    possibleExchanges: Array<{ myDouble: string; theirNeed: string }>;
  }[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  getUserMatches(userId: string): Promise<(Match & { user1: User; user2: User; album: Album })[]>;
  
  // Messages
  getMatchMessages(matchId: string): Promise<(Message & { sender: User })[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Reports
  getReports(): Promise<(Report & { reporter: User; reportedUser?: User })[]>;
  getReportsWithPagination(filters: {
    status?: string;
    priority?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    reports: (Report & { reporter: User; reportedUser?: User })[];
    total: number;
    hasNextPage: boolean;
  }>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: string, updates: { status?: string; priority?: string }): Promise<Report>;
  
  // Stats
  getAdminStats(): Promise<{
    totalUsers: number;
    totalMatches: number;
    activeAlbums: number;
    pendingReports: number;
  }>;
  
  // Users management
  getAllUsers(): Promise<any[]>;
  updateUserStatus(userId: number, isActive: boolean): Promise<void>;
}
