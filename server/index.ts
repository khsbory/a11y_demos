import express from "express";
import { createServer } from "http";
// import { setupVite } from "./vite.js"; // Removed for production dependency isolation
import { registerRoutes } from "./routes.js";
import path from "path";

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // API 라우트 등록
    await registerRoutes(app);

    if (app.get("env") === "development") {
      const { setupVite } = await import("./vite.js");
      await setupVite(app, server);
    } else {
      // Production: Serve static files and handle SPA routing
      const distPath = path.resolve("dist/public");
      app.use(express.static(distPath));
      app.use("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
    }

    server.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`serving on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer(); 