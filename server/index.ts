import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { LRUCache } from "lru-cache";
import crypto from "crypto";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.set("trust proxy", 1);

const isProd = process.env.NODE_ENV === "production";

// Morgan logging: in produzione logga solo errori (>=400)
app.use(morgan(isProd ? "tiny" : "dev", {
  skip: (_req, res) => isProd ? res.statusCode < 400 : false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rate limit gentile SOLO su /api/user/stickers (disabilitato in development)
if (isProd) {
  app.use("/api/user/stickers", rateLimit({
    windowMs: 10_000, // 10s
    max: 30,          // 30 richieste/10s per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, reason: "rate_limited" }
  }));
}

// Dedup ravvicinato (idempotenza base)
const dedupCache = new LRUCache({ max: 5000, ttl: 3000 }); // 3s

function dedupKey(req: Request) {
  const userId =
    ((req as any).user?.id) ||
    (req.headers["x-user-id"]) ||
    ((req as any).cookies?.user_id) || "anon";
  const bodyStr = JSON.stringify(req.body ?? {});
  const hash = crypto.createHash("sha1").update(bodyStr).digest("hex");
  return `${userId}:${hash}`;
}

// Middleware dedup PRIMA della logica attuale di PUT /api/user/stickers
app.put("/api/user/stickers/:stickerId", (req, res, next) => {
  try {
    const key = dedupKey(req);
    if (dedupCache.has(key)) {
      res.set("Cache-Control", "no-store, max-age=0");
      return res.status(202).json({ ok: true, dedup: true });
    }
    dedupCache.set(key, true);
    res.set("Cache-Control", "no-store, max-age=0");
    return next(); // continua verso l'handler esistente
  } catch {
    return next(); // non bloccare il flusso se qualcosa va storto
  }
});

// Custom logging middleware (ridotto per produzione)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // In produzione logga solo errori (>=400) o richieste lente (>2s)
      if (!isProd || res.statusCode >= 400 || duration > 2000) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse && res.statusCode >= 400) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Auto-report server errors to reports system
    if (status >= 500) {
      // Async error reporting - don't block response
      setTimeout(async () => {
        try {
          const { storage } = await import("./storage");
          
          // Create anonymous user if needed
          let reporterId = (req as any).user?.userId;
          if (!reporterId) {
            try {
              const anonUser = await storage.createUser({
                nickname: `server_error_${Date.now()}`,
                password: 'server_error',
                cap: '00000',
                role: 'user'
              });
              reporterId = anonUser.id;
            } catch (userError) {
              console.error("Could not create reporter user:", userError);
              return;
            }
          }
          
          await storage.createReport({
            reporterId,
            type: 'api_error',
            description: `Server Error ${status}: ${message}`,
            status: 'nuovo',
            priority: 'alta',
            page: req.path,
            errorDetails: err.stack || JSON.stringify(err),
            userAgent: req.headers['user-agent'] || 'Unknown',
            url: `${req.protocol}://${req.get('Host')}${req.originalUrl}`,
          });
          
          console.log(`✅ Auto-reported server error: ${status} ${message}`);
        } catch (reportError) {
          console.error("Failed to auto-report server error:", reportError);
        }
      }, 0);
    }

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve on port 3001 for development
  const port = parseInt(process.env.PORT || '3001', 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
