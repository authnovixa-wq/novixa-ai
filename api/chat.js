import OpenAI from "openai";

const limiter = new Map();

export default async function handler(req, res) {
  try {
    const ip = req.headers["x-forwarded-for"] || "anon";

    const now = Date.now();
    const last = limiter.get(ip) || 0;

    if (now - last < 1500) {
      return res.status(429).json({ error: "Slow down" });
    }

    limiter.set(ip, now);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);

    const { message, history = [] } = body;

    if (!message) {
      return res.status(400).json({ error: "No message" });
    }

    const messages = [
      { role: "system", content: "أنت مساعد ذكي احترافي، واضح ومفيد" },
      ...history.slice(-10),
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Server error"
    });
  }
}
