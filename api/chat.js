
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { message, history = [] } = req.body;

    const messages = [
      {
        role: "system",
        content: `
أنت Novixa AI، مساعد ذكي احترافي للشركات ورواد الأعمال.
تقدم:
- تحليل أفكار
- بناء مشاريع
- نصائح عملية
- ردود واضحة ومباشرة

تتكلم بالعربية أو الإنجليزية حسب المستخدم.
كن ذكي، مختصر، واحترافي.
`
      },
      ...history,
      {
        role: "user",
        content: message
      }
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: messages
      })
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      "❌ لم يتم استلام رد من الذكاء الاصطناعي";

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({
      reply: "❌ خطأ في السيرفر"
    });
  }
}
