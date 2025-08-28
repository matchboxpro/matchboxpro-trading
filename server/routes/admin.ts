import type { Express } from "express";
import { storage } from "../storage";

export function registerAdminRoutes(app: Express, requireAdmin: any) {
  // Admin routes - open access for development
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recuperare le statistiche" });
    }
  });

  // Users management routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recuperare gli utenti" });
    }
  });

  app.patch("/api/admin/users/:id/toggle-status", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { is_active } = req.body;
      
      await storage.updateUserStatus(userId, is_active);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Errore nell'aggiornamento stato utente" });
    }
  });

  // Reports routes
  app.get("/api/admin/reports", async (req, res) => {
    try {
      const filters = {
        status: req.query.status === 'all' ? undefined : req.query.status as string,
        priority: req.query.priority === 'all' ? undefined : req.query.priority as string,
        type: req.query.type === 'all' ? undefined : req.query.type as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };
      
      const result = await storage.getReportsWithPagination(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Errore nel recuperare le segnalazioni" });
    }
  });

  // IMPORTANTE: bulk-status DEVE essere PRIMA di :id per evitare conflitti di route
  app.put("/api/admin/reports/bulk-status", async (req, res) => {
    try {
      const { reportIds, status } = req.body;
      
      if (!Array.isArray(reportIds) || reportIds.length === 0) {
        return res.status(400).json({ message: "IDs segnalazioni non validi" });
      }
      
      if (!status || !['nuovo', 'aperto', 'inviato'].includes(status)) {
        return res.status(400).json({ message: "Stato non valido" });
      }
      
      
      const updatedCount = await storage.bulkUpdateReportStatus(reportIds, status);
      res.json({ success: true, updatedCount });
    } catch (error) {
      console.error("Error bulk updating report status:", error);
      res.status(500).json({ message: "Errore nell'aggiornamento dello stato delle segnalazioni" });
    }
  });

  app.put("/api/admin/reports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedReport = await storage.updateReport(id, updates);
      res.json(updatedReport);
    } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).json({ message: "Errore nell'aggiornare la segnalazione" });
    }
  });

  app.delete("/api/admin/reports/bulk", async (req, res) => {
    try {
      const { reportIds } = req.body;
      
      if (!Array.isArray(reportIds) || reportIds.length === 0) {
        return res.status(400).json({ message: "IDs segnalazioni non validi" });
      }
      
      await storage.deleteReports(reportIds);
      res.json({ success: true, deletedCount: reportIds.length });
    } catch (error) {
      console.error("Error deleting reports:", error);
      res.status(500).json({ message: "Errore nell'eliminazione delle segnalazioni" });
    }
  });

  app.post("/api/reports/error", async (req, res) => {
    try {
      const userId = (req as any).user?.userId;
      
      // Se non c'è sessione utente, crea un utente anonimo temporaneo per le segnalazioni
      let reporterId = userId;
      if (!userId) {
        // Cerca se esiste già un utente "anonymous" per le segnalazioni automatiche
        const anonymousUser = await storage.getUserByNickname("anonymous");
        if (anonymousUser) {
          reporterId = anonymousUser.id;
        } else {
          // Crea utente anonimo se non esiste
          const newAnonymousUser = await storage.createUser({
            nickname: "anonymous",
            password: "no-password",
            cap: "00000",
            raggioKm: 0,
            role: "user"
          });
          reporterId = newAnonymousUser.id;
        }
      }

      const reportData = {
        ...req.body,
        type: "error",
        status: "nuovo",
        priority: "media",
        reporterId: reporterId,
        userAgent: req.get('User-Agent') || '',
        url: req.body.url || req.get('Referer') || ''
      };
      
      const report = await storage.createReport(reportData);
      res.json(report);
    } catch (error) {
      console.error("Error creating error report:", error);
      res.status(500).json({ message: "Errore nella creazione della segnalazione" });
    }
  });

  // Album reordering endpoint
  app.put("/api/admin/albums/reorder", async (req, res) => {
    try {
      const { albums: albumsOrder } = req.body;
      
      if (!Array.isArray(albumsOrder)) {
        return res.status(400).json({ message: "Invalid albums order data" });
      }
      
      // Crea l'array con id e displayOrder
      const orderData = albumsOrder.map((album, index) => ({
        id: album.id,
        displayOrder: index
      }));
      
      await storage.updateAlbumsOrder(orderData);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating albums order:", error);
      res.status(500).json({ message: "Errore nell'aggiornamento dell'ordine degli album" });
    }
  });
}
