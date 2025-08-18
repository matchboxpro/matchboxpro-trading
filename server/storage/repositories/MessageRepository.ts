import { eq, asc } from "drizzle-orm";
import { messages, users, type Message, type InsertMessage, type User } from "@shared/schema";
import { db } from "../database/connection";

export class MessageRepository {
  async getMatchMessages(matchId: string): Promise<(Message & { sender: User })[]> {
    const result = await db
      .select({
        id: messages.id,
        matchId: messages.matchId,
        senderId: messages.senderId,
        content: messages.content,
        createdAt: messages.createdAt,
        sender: users,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.matchId, matchId))
      .orderBy(asc(messages.createdAt));

    return result;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }
}
