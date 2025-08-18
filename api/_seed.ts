import type { Express } from "express";
import bcrypt from "bcrypt";
import { storage } from "../server/storage";

export function registerSeedRoutes(app: Express) {
  app.post("/api/_seed", async (req, res) => {
    try {
      // Check if user 'dero' already exists
      const existingUser = await storage.getUserByNickname("dero");
      if (existingUser) {
        return res.json({ 
          message: "User 'dero' already exists",
          userId: existingUser.id 
        });
      }

      // Create test user 'dero'
      const hashedPassword = await bcrypt.hash("dero123", 10);
      
      const user = await storage.createUser({
        nickname: "dero",
        password: hashedPassword,
        cap: "00100",
        raggioKm: 10,
        isPremium: false,
        role: "admin"
      });

      res.json({ 
        message: "Test user 'dero' created successfully",
        userId: user.id,
        credentials: {
          nickname: "dero",
          password: "dero123"
        }
      });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ 
        message: "Failed to create test user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}
