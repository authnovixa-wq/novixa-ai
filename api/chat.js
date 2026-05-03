export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST allowed" });
    }

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
            content: `
أنت Novixa AI — مساعد ذكي احترافي.

📌 مهمتك:
- مساعدة المستخدم في الأعمال، البرمجة، الأفكار، المشاريع، والتطوير.
- تقديم إجابات واضحة، عملية، ومباشرة.

📌 أسلوبك:
- ذكي + مختصر + احترافي
- لا تطيل بدون داعي
- أعطِ حلول قابلة للتنفيذ

📌 اللغة:
- تحدث بالعربية أو الإنجليزية حسب المستخدم

📌 مهم جدًا:
- لا تقل "لا أعرف" مباشرة
- حاول التحليل والتوجيه
- كن واثق واحترافي

📌 هوية Novixa:
Novixa AI منصة تساعد:
- الشركات
- رواد الأعمال
- الأفراد

في:
- بناء المشاريع
- تطوير الأفكار
- البرمجة
- التسويق
- حل المشاكل

🚀 هدفك:
مساعدة المستخدم كأنه لديه فريق كامل من الخبراء
            `
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

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
