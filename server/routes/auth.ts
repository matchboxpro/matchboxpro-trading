import type { Express } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export function registerAuthRoutes(app: Express, requireAuth: any) {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if nickname already exists
      const existingUser = await storage.getUserByNickname(userData.nickname);
      if (existingUser) {
        return res.status(400).json({ 
          message: "Nickname già in uso" 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      res.status(201).json({ 
        message: "User registered successfully", 
        userId: user.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { nickname, password } = req.body;
      const user = await storage.getUserByNickname(nickname);
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error" });
      }

      const token = jwt.sign(
        { userId: user.id, nickname: user.nickname, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({ 
        message: "Login successful", 
        user: { id: user.id, nickname: user.nickname, role: user.role } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    res.json({ message: "Logout successful" });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
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
}
