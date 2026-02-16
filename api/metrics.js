const { getDb } = require("./_mongoClient");

module.exports = async function handler(_req, res) {
  try {
    const db = await getDb();
    const events = db.collection("events");
    const waitlist = db.collection("waitlist");

    const [pageviews, waitlistJoins, uniqueEmails] = await Promise.all([
      events.countDocuments({ type: "pageview" }),
      events.countDocuments({ type: "waitlist_join" }),
      waitlist.estimatedDocumentCount(),
    ]);

    return res.status(200).json({
      ok: true,
      pageviews,
      waitlistJoins,
      uniqueEmails,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error." });
  }
};

