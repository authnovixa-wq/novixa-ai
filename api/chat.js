
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

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
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    console.log("FULL DATA:", JSON.stringify(data, null, 2));

    // 🔥 هذا أهم تعديل
    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "❌ لا يوجد رد من AI";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      reply: "❌ خطأ في السيرفر"
    });
  }
}
