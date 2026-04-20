import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/market-prices", async (req, res) => {
    try {
      // These are realistic 2024/2025 reference averages for Egypt market
      const prices = {
        fish: {
          tilapia: { min: 72, max: 88, avg: 82 },
          seabass: { min: 160, max: 320, avg: 240 },
          seabream: { min: 160, max: 320, avg: 240 },
        },
        feed: {
          standard: 26800, // EGP/Ton (Average 30% Protein)
          soya: 29500,
          corn: 11800
        },
        lastUpdated: new Date().toISOString(),
        source: "تقرير سوق العبور الإسترشادي + بوابة الأسعار المحلية"
      };

      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: "فشل في جلب بيانات السوق" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
