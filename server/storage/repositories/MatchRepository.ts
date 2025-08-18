import { eq, and, or, desc, sql } from "drizzle-orm";
import { matches, users, albums, userStickers, stickers, type Match, type InsertMatch, type User, type Album } from "@shared/schema";
import { db } from "../database/connection";

export class MatchRepository {
  async findMatches(userId: string, albumId: string, radiusKm: number, userCap: string): Promise<User[]> {
    // For now, simplified matching by CAP proximity and same album
    // In a real implementation, you'd use geographical calculations
    const result = await db
      .select()
      .from(users)
      .where(and(
        eq(users.albumSelezionato, albumId),
        eq(users.cap, userCap), // Simplified - same CAP for now
        sql`${users.id} != ${userId}`
      ))
      .limit(20);
    
    return result;
  }

  async findPotentialMatches(userId: string, albumId: string): Promise<{
    user: User;
    myNeeds: string[];
    myDoubles: string[];
    theirNeeds: string[];
    theirDoubles: string[];
    possibleExchanges: Array<{ myDouble: string; theirNeed: string }>;
  }[]> {
    try {
      // Get my stickers status
      const myStickers = await db
        .select({
          stickerId: userStickers.stickerId,
          status: userStickers.status,
          stickerNumber: stickers.number,
        })
        .from(userStickers)
        .innerJoin(stickers, eq(userStickers.stickerId, stickers.id))
        .where(and(
          eq(userStickers.userId, userId),
          eq(stickers.albumId, albumId)
        ));

      const myNeeds = myStickers.filter(s => s.status === 'no').map(s => s.stickerNumber);
      const myDoubles = myStickers.filter(s => s.status === 'double').map(s => s.stickerNumber);

      // Get other users with same album
      const otherUsers = await db
        .select()
        .from(users)
        .where(and(
          eq(users.albumSelezionato, albumId),
          sql`${users.id} != ${userId}`
        ));

      const potentialMatches: Array<{
        user: User;
        myNeeds: string[];
        myDoubles: string[];
        theirNeeds: string[];
        theirDoubles: string[];
        possibleExchanges: Array<{ myDouble: string; theirNeed: string }>;
      }> = [];

      await Promise.all(otherUsers.map(async (user) => {
        // Get their stickers status
        const theirStickers = await db
          .select({
            stickerId: userStickers.stickerId,
            status: userStickers.status,
            stickerNumber: stickers.number,
          })
          .from(userStickers)
          .innerJoin(stickers, eq(userStickers.stickerId, stickers.id))
          .where(and(
            eq(userStickers.userId, user.id),
            eq(stickers.albumId, albumId)
          ));

        const theirNeeds = theirStickers.filter(s => s.status === 'no').map(s => s.stickerNumber);
        const theirDoubles = theirStickers.filter(s => s.status === 'double').map(s => s.stickerNumber);

        // Find possible exchanges
        const possibleExchanges: Array<{ myDouble: string; theirNeed: string }> = [];
        
        myDoubles.forEach(myDouble => {
          theirDoubles.forEach(theirDouble => {
            if (myNeeds.includes(theirDouble)) {
              possibleExchanges.push({
                myDouble: myDouble,
                theirNeed: theirDouble
              });
            }
          });
        });

        if (possibleExchanges.length > 0) {
          potentialMatches.push({
            user,
            myNeeds,
            myDoubles,
            theirNeeds,
            theirDoubles,
            possibleExchanges
          });
        }
      }));

      return potentialMatches;
    } catch (error) {
      console.error("Error finding potential matches:", error);
      return [];
    }
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const result = await db.insert(matches).values(match).returning();
    return result[0];
  }

  async getUserMatches(userId: string): Promise<(Match & { user1: User; user2: User; album: Album })[]> {
    const result = await db
      .select({
        id: matches.id,
        user1Id: matches.user1Id,
        user2Id: matches.user2Id,
        albumId: matches.albumId,
        status: matches.status,
        createdAt: matches.createdAt,
        user1: users,
        user2: sql`NULL`.as('user2'),
        album: albums,
      })
      .from(matches)
      .innerJoin(users, eq(matches.user1Id, users.id))
      .innerJoin(albums, eq(matches.albumId, albums.id))
      .where(or(
        eq(matches.user1Id, userId),
        eq(matches.user2Id, userId)
      ))
      .orderBy(desc(matches.createdAt));

    // Get the other user for each match
    const enrichedMatches = await Promise.all(
      result.map(async (match) => {
        const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
        const otherUser = await db.select().from(users).where(eq(users.id, otherUserId)).limit(1);
        return {
          ...match,
          user2: otherUser[0]!,
        };
      })
    );

    return enrichedMatches;
  }

  async updateMatch(id: string, updates: Partial<InsertMatch>): Promise<Match> {
    const result = await db.update(matches).set(updates).where(eq(matches.id, id)).returning();
    return result[0];
  }
}
