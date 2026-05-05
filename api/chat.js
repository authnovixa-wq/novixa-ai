import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    let body = req.body;

    // حل مشكلة Vercel parsing
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

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

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ reply: "Server error" });
  }
}
