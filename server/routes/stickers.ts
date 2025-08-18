import type { Express } from "express";
import { storage } from "../storage";
import { insertStickerSchema, insertUserStickerSchema } from "@shared/schema";
import { z } from "zod";

export function registerStickerRoutes(app: Express, requireAuth: any, requireAdmin: any) {
  // Stickers routes
  app.get("/api/albums/:albumId/stickers", async (req, res) => {
    try {
      const stickers = await storage.getStickersByAlbum(req.params.albumId);
      res.json(stickers);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recuperare le figurine" });
    }
  });

  app.post("/api/albums/:albumId/stickers", requireAdmin, async (req, res) => {
    try {
      const stickerData = insertStickerSchema.parse({
        ...req.body,
        albumId: req.params.albumId
      });
      const sticker = await storage.createSticker(stickerData);
      res.status(201).json(sticker);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Errore nella creazione della figurina" });
    }
  });

  app.post("/api/albums/:albumId/stickers/bulk", requireAdmin, async (req, res) => {
    try {
      const { stickers } = req.body;
      if (!Array.isArray(stickers)) {
        return res.status(400).json({ message: "Formato dati non valido" });
      }

      const stickerData = stickers.map(sticker => ({
        ...sticker,
        albumId: req.params.albumId
      }));

      const createdStickers = await storage.createMultipleStickers(stickerData);
      res.status(201).json(createdStickers);
    } catch (error) {
      res.status(500).json({ message: "Errore nell'importazione delle figurine" });
    }
  });

  app.put("/api/stickers/:id", requireAdmin, async (req, res) => {
    try {
      const stickerData = insertStickerSchema.partial().parse(req.body);
      const sticker = await storage.updateSticker(req.params.id, stickerData);
      if (!sticker) {
        return res.status(404).json({ message: "Figurina non trovata" });
      }
      res.json(sticker);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Errore nell'aggiornamento della figurina" });
    }
  });

  app.delete("/api/stickers/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteSticker(req.params.id);
      res.json({ message: "Figurina eliminata con successo" });
    } catch (error) {
      res.status(500).json({ message: "Errore nell'eliminazione della figurina" });
    }
  });

  app.delete("/api/albums/:albumId/stickers", requireAdmin, async (req, res) => {
    try {
      await storage.deleteAllStickersFromAlbum(req.params.albumId);
      res.json({ message: "Tutte le figurine dell'album sono state eliminate" });
    } catch (error) {
      res.status(500).json({ message: "Errore nell'eliminazione delle figurine" });
    }
  });

  // User stickers routes
  app.get("/api/user/stickers/:albumId", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      const userStickers = await storage.getUserStickers(userId, req.params.albumId);
      res.json(userStickers);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recuperare le figurine utente" });
    }
  });

  app.put("/api/user/stickers/:stickerId", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      
      // Schema per update - solo status richiesto
      const updateSchema = z.object({
        status: z.enum(["yes", "no", "double"])
      });
      const { status } = updateSchema.parse(req.body);
      
      const userSticker = await storage.updateUserSticker(userId, req.params.stickerId, status);
      res.json(userSticker);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Errore nell'aggiornamento dello stato figurina" });
    }
  });
}
