const { getDb } = require("./_mongoClient");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const db = await getDb();
    const collection = db.collection("waitlist");

    let body = req.body;
    if (!body || typeof body !== "object") {
      try {
        body = JSON.parse(req.body);
      } catch {
        body = {};
      }
    }

    const email = String(body.email || "").trim();
    const emailLower = email.toLowerCase();

    if (!email || email.length > 254) {
      return res.status(400).json({ ok: false, error: "Invalid email." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "Invalid email." });
    }

    const result = await collection.updateOne(
      { emailLower },
      {
        $setOnInsert: {
          email,
          emailLower,
          createdAt: new Date(),
          userAgent: req.headers["user-agent"] || null,
          referrer: req.headers["referer"] || null,
          source: "vercel-api",
        },
      },
      { upsert: true }
    );

    return res.status(200).json({
      ok: true,
      alreadyOnList: result.matchedCount > 0,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error." });
  }
};

