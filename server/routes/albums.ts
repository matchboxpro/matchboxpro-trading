import type { Express } from "express";
import { storage } from "../storage";
import { insertAlbumSchema } from "@shared/schema";
import { z } from "zod";

export function registerAlbumRoutes(app: Express, requireAuth: any, requireAdmin: any) {
  // Albums routes
  app.get("/api/albums", async (req, res) => {
    try {
      const albums = await storage.getAlbums();
      res.json(albums);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recuperare gli album" });
    }
  });

  app.get("/api/albums/:id", async (req, res) => {
    try {
      const album = await storage.getAlbum(req.params.id);
      if (!album) {
        return res.status(404).json({ message: "Album non trovato" });
      }
      res.json(album);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recuperare l'album" });
    }
  });

  app.post("/api/albums", requireAdmin, async (req, res) => {
    try {
      const albumData = insertAlbumSchema.parse(req.body);
      const album = await storage.createAlbum(albumData);
      res.status(201).json(album);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Errore nella creazione dell'album" });
    }
  });

  app.put("/api/albums/:id", requireAdmin, async (req, res) => {
    try {
      const albumData = insertAlbumSchema.partial().parse(req.body);
      const album = await storage.updateAlbum(req.params.id, albumData);
      if (!album) {
        return res.status(404).json({ message: "Album non trovato" });
      }
      res.json(album);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Errore nell'aggiornamento dell'album" });
    }
  });

  app.delete("/api/albums/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteAlbum(req.params.id);
      res.json({ message: "Album eliminato con successo" });
    } catch (error) {
      res.status(500).json({ message: "Errore nell'eliminazione dell'album" });
    }
  });
}
