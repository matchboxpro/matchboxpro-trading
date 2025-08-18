import { eq, count } from "drizzle-orm";
import { users, matches, albums, reports } from "@shared/schema";
import { db } from "../database/connection";

export class AdminRepository {
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalMatches: number;
    activeAlbums: number;
    pendingReports: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [matchCount] = await db.select({ count: count() }).from(matches);
    const [albumCount] = await db.select({ count: count() }).from(albums).where(eq(albums.isActive, true));
    const [reportCount] = await db.select({ count: count() }).from(reports).where(eq(reports.status, 'nuovo'));

    return {
      totalUsers: userCount.count,
      totalMatches: matchCount.count,
      activeAlbums: albumCount.count,
      pendingReports: reportCount.count,
    };
  }
}
