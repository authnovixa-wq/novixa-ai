import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    console.log("🔥 API CALLED");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    console.log("BODY:", body);

    const message = body?.message;

    if (!message) {
      return res.status(400).json({ reply: "No message provided" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices[0].message.content;

    console.log("REPLY:", reply);

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ ERROR:", error);
    return res.status(500).json({
      reply: "Server error",
      error: error.message
    });
  }
}
