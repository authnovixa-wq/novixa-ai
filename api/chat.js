export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST allowed" });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: "أنت Novixa AI، مساعد ذكي احترافي يساعد في الأعمال والتقنية، تجيب بالعربية أو الإنجليزية حسب المستخدم، بأسلوب واضح واحترافي."
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    // 🔍 تشخيص
    console.log("FULL OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    let reply = "⚠️ لم يتم استخراج رد";

    if (data.output_text) {
      reply = data.output_text;
    } else if (data.output && data.output[0]?.content?.[0]?.text) {
      reply = data.output[0].content[0].text;
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
