import type { Express } from "express";
import { storage } from "../storage";

export function registerUserRoutes(app: Express, requireAuth: any) {
  // User routes
  app.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser((req as any).user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user profile" });
    }
  });

  app.put("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      const updates = req.body;
      
      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updates.password;
      delete updates.role;
      delete updates.id;
      
      const updatedUser = await storage.updateUser(userId, updates);
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
}
