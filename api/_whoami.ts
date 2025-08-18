import type { Express } from "express";
import jwt from "jsonwebtoken";

export function registerWhoamiRoutes(app: Express) {
  app.get("/api/_whoami", (req, res) => {
    const token = req.cookies['auth-token'];
    
    if (!token) {
      return res.status(401).json({ 
        error: "No authentication token found",
        authenticated: false 
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ 
        error: "Server configuration error",
        authenticated: false 
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      res.json({
        authenticated: true,
        payload: decoded,
        tokenValid: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(401).json({
        error: "Invalid or expired token",
        authenticated: false,
        tokenValid: false,
        timestamp: new Date().toISOString()
      });
    }
  });
}
