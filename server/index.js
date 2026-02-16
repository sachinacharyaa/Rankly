const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

require("dotenv").config();

const PORT = Number(process.env.PORT || 8787);
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "rankly";

const app = express();
app.use(cors());
app.use(express.json({ limit: "32kb" }));

let mongoClient;
let waitlistCollection;
let mongoReady = false;
let mongoInitError = "";

async function initMongo() {
  if (!MONGODB_URI || String(MONGODB_URI).includes("<db_password>")) {
    mongoReady = false;
    mongoInitError =
      "MongoDB is not configured. Set MONGODB_URI in .env (see .env.example).";
    // eslint-disable-next-line no-console
    console.warn(mongoInitError);
    return;
  }

  mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();

  const db = mongoClient.db(MONGODB_DB);
  waitlistCollection = db.collection("waitlist");

  await waitlistCollection.createIndex({ emailLower: 1 }, { unique: true });
  mongoReady = true;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mongoReady });
});

app.post("/api/waitlist", async (req, res) => {
  try {
    if (!mongoReady || !waitlistCollection) {
      return res.status(503).json({
        ok: false,
        error:
          mongoInitError ||
          "Waitlist storage is not ready. Configure MongoDB and restart the server.",
      });
    }

    const email = String(req.body?.email || "").trim();
    const emailLower = email.toLowerCase();

    if (!email || email.length > 254) {
      return res.status(400).json({ ok: false, error: "Invalid email." });
    }

    // minimal sanity check (not full RFC validation)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "Invalid email." });
    }

    const result = await waitlistCollection.updateOne(
      { emailLower },
      {
        $setOnInsert: {
          email,
          emailLower,
          createdAt: new Date(),
          userAgent: req.get("user-agent") || null,
          referrer: req.get("referer") || null,
        },
      },
      { upsert: true }
    );

    return res.json({
      ok: true,
      alreadyOnList: result.matchedCount > 0,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error." });
  }
});

// Serve built frontend when dist exists (production)
const distPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
} else {
  app.get("/", (_req, res) => {
    res.type("text").send(
      "API is running. In development, visit the Vite app at http://localhost:5173"
    );
  });
}

initMongo()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Mongo init failed:", err);
    mongoReady = false;
    mongoInitError =
      "MongoDB connection failed. Check your MONGODB_URI and network access, then restart.";
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API running on http://localhost:${PORT}`);
    });
  });

process.on("SIGINT", async () => {
  try {
    await mongoClient?.close();
  } finally {
    process.exit(0);
  }
});

