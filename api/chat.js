export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { messages } = req.body;

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
            content: `أنت Novixa AI، مساعد ذكي يساعد في:
- الأعمال
- المشاريع
- البرمجة

تحدث بالعربية أو الإنجليزية حسب المستخدم.
كن ذكي، واضح، عملي، ومفيد دائماً.
لا تعطي إجابات عامة، بل حلول مباشرة.`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    let reply = "❌ لم يتم الحصول على رد";

    if (data.output_text) {
      reply = data.output_text;
    } else if (data.output && data.output[0]?.content?.[0]?.text) {
      reply = data.output[0].content[0].text;
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ reply: "❌ خطأ في السيرفر" });
  }
}
