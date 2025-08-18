import type { Express } from "express";
import { storage } from "../storage";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export function registerChatRoutes(app: Express, requireAuth: any) {
  // Chat routes
  app.get("/api/matches/:matchId/messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getMatchMessages(req.params.matchId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recuperare i messaggi" });
    }
  });

  app.post("/api/matches/:matchId/messages", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        matchId: req.params.matchId,
        senderId: userId
      });
      
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Errore nell'invio del messaggio" });
    }
  });
}
