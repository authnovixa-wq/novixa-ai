export default async function handler(req, res) {
  // ✅ السماح فقط بـ POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    // ✅ تحقق من وجود API Key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "API key missing from server"
      });
    }

    const { message } = req.body;

    // ✅ تحقق من الإدخال
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Invalid message"
      });
    }

    // 🧠 تحسين بسيط: توجيه الأسلوب
    const systemPrompt = `
أنت Novixa AI.
تتحدث بالعربية والإنجليزية.
كن واضح، مختصر، واحترافي.
ساعد المستخدم في الأعمال، البرمجة، والأفكار.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `${systemPrompt}\n\nUser: ${message}`
      })
    });

    const data = await response.json();

    // 🔍 طباعة للتشخيص (تشوفها في Vercel Logs)
    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    let reply = "⚠️ لم يتم استخراج رد";

    if (data.output_text) {
      reply = data.output_text;
    } else if (data.output && data.output[0]?.content?.[0]?.text) {
      reply = data.output[0].content[0].text;
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
