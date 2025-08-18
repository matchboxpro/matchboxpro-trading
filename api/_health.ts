import type { Express } from "express";
import { sql } from "drizzle-orm";
import { db } from "../server/storage/database/connection";

export function registerHealthRoutes(app: Express) {
  app.get("/api/_health", async (req, res) => {
    try {
      // Check database connection with simple ping
      let dbOk = false;
      try {
        await db.execute(sql`SELECT 1`);
        dbOk = true;
      } catch (error: any) {
        console.error("DB health check failed:", error?.code || error?.message || error);
      }

      // Check JWT secret
      const hasJwtSecret = !!process.env.JWT_SECRET;

      // Get git info (placeholder - would need actual git commands in production)
      const commit = process.env.RENDER_GIT_COMMIT || "local-dev";
      const branch = process.env.RENDER_GIT_BRANCH || "main";

      if (dbOk) {
        res.json({
          status: "ok",
          timestamp: new Date().toISOString(),
          commit,
          branch,
          DB_OK: dbOk,
          HAS_JWT_SECRET: hasJwtSecret,
          environment: process.env.NODE_ENV || "development"
        });
      } else {
        res.status(500).json({
          status: "db_error",
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "error",
        timestamp: new Date().toISOString()
      });
    }
  });
}
