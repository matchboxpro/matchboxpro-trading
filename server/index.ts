import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
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

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
