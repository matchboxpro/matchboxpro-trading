import type { Express } from "express";
import { storage } from "../server/storage";

export function registerHealthRoutes(app: Express) {
  app.get("/api/_health", async (req, res) => {
    try {
      // Check database connection
      let dbOk = false;
      try {
        await storage.getUser("1"); // Simple DB query to test connection
        dbOk = true;
      } catch (error) {
        console.error("Database health check failed:", error);
      }

      // Check JWT secret
      const hasJwtSecret = !!process.env.JWT_SECRET;

      // Get git info (placeholder - would need actual git commands in production)
      const commit = process.env.RENDER_GIT_COMMIT || "local-dev";
      const branch = process.env.RENDER_GIT_BRANCH || "main";

      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        commit,
        branch,
        DB_OK: dbOk,
        HAS_JWT_SECRET: hasJwtSecret,
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString()
      });
    }
  });
}
