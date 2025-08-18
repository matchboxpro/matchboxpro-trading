import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// Import route modules
import { registerAuthRoutes } from "./routes/auth";
import { registerUserRoutes } from "./routes/user";
import { registerAdminRoutes } from "./routes/admin";
import { registerAlbumRoutes } from "./routes/albums";
import { registerStickerRoutes } from "./routes/stickers";
import { registerMatchRoutes } from "./routes/matches";
import { registerChatRoutes } from "./routes/chat";
import { registerHealthRoutes } from "../api/_health";
import { registerWhoamiRoutes } from "../api/_whoami";
import { registerSeedRoutes } from "../api/_seed";

// Auth middleware
const requireAuth = (req: any, res: any, next: any) => {
  const token = req.cookies['auth-token'];
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const requireAdmin = async (req: any, res: any, next: any) => {
  // Admin access is now open - remove authentication for now
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Cookie parser middleware
  app.use(cookieParser());

  // Register diagnostic routes first
  registerHealthRoutes(app);
  registerWhoamiRoutes(app);
  registerSeedRoutes(app);

  // Register all route modules
  registerAuthRoutes(app, requireAuth);
  registerUserRoutes(app, requireAuth);
  registerAdminRoutes(app, requireAdmin);
  registerAlbumRoutes(app, requireAuth, requireAdmin);
  registerStickerRoutes(app, requireAuth, requireAdmin);
  registerMatchRoutes(app, requireAuth);
  registerChatRoutes(app, requireAuth);

  const server = createServer(app);
  return server;
}
