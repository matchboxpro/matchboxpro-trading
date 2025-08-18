import type { Express } from "express";
import { storage } from "../storage";
import { insertMatchSchema } from "@shared/schema";
import { z } from "zod";

export function registerMatchRoutes(app: Express, requireAuth: any) {
  // Matches routes
  app.get("/api/matches", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      const matches = await storage.getUserMatches(userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recuperare i match" });
    }
  });

  app.post("/api/matches", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      const matchData = insertMatchSchema.parse({
        ...req.body,
        requesterId: userId
      });
      
      const match = await storage.createMatch(matchData);
      res.status(201).json(match);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Errore nella creazione del match" });
    }
  });

  app.put("/api/matches/:id", requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      const match = await storage.updateMatch(req.params.id, { status });
      if (!match) {
        return res.status(404).json({ message: "Match non trovato" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: "Errore nell'aggiornamento del match" });
    }
  });

  app.get("/api/matches/find/:albumId", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      const matches = await storage.findPotentialMatches(userId, req.params.albumId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Errore nella ricerca dei match" });
    }
  });
}
