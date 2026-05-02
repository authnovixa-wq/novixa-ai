
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { message, history = [] } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: [
          {
            role: "system",
            content: "أنت مساعد ذكي احترافي للشركات. رد باحتراف."
          },
          ...history,
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    // 🔥 أهم تعديل هنا
    let reply = "❌ لا يوجد رد";

    if (data.output && data.output.length > 0) {
      const content = data.output[0].content;
      if (content && content.length > 0) {
        reply = content[0].text;
      }
    }

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({
      reply: "❌ خطأ في السيرفر: " + error.message
    });
  }
}
