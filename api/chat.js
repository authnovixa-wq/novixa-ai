import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { message } = req.body;

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
    return res.status(500).json({
      reply: "Error",
      error: error.message
    });
  }
}
