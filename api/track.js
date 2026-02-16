const { getDb } = require("./_mongoClient");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const db = await getDb();
    const collection = db.collection("events");

    let body = req.body;
    if (!body || typeof body !== "object") {
      try {
        body = JSON.parse(req.body);
      } catch {
        body = {};
      }
    }

    const type = String(body.type || "").trim() || "pageview";
    const path = String(body.path || req.url || "/");

    await collection.insertOne({
      type,
      path,
      createdAt: new Date(),
      userAgent: req.headers["user-agent"] || null,
      referrer: req.headers["referer"] || null,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error." });
  }
};

