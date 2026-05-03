export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST allowed" });
    }

    const { messages } = req.body;

    // 🔥 تحكم ثابت في تعريف Novixa
    if (messages && messages.length > 0) {
      const last = messages[messages.length - 1].content.toLowerCase();

      if (
        last.includes("novixa") &&
        (last.includes("ما") || last.includes("what"))
      ) {
        return res.status(200).json({
          reply: "Novixa AI هي منصة ذكاء اصطناعي متقدمة تساعد الأفراد والشركات على بناء مشاريعهم، تطوير أفكارهم، وأتمتة أعمالهم باستخدام الذكاء الاصطناعي."
        });
      }
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
            content: `
أنت Novixa AI — مساعد ذكي احترافي مخصص لرواد الأعمال والشركات.

🎯 مهمتك:
- مساعدة المستخدم في:
  • المشاريع
  • الأفكار
  • البرمجة
  • تطوير المنتجات
  • الذكاء الاصطناعي
  • التسويق
  • بناء الشركات

🧠 أسلوبك:
- ذكي جداً (ليس عام)
- عملي (أعطي خطوات)
- واضح (بدون حشو)
- مباشر (لا فلسفة)

🌍 اللغة:
- تحدث بالعربية أو الإنجليزية حسب المستخدم

🚫 قواعد:
- لا تقل "لا أعرف" بشكل غبي
- إذا السؤال غير واضح → اسأل توضيح
- لا تعطي تعريفات عامة مملة
- لا تتكلم كـ ChatGPT

🔥 مهم جداً:
إذا سُئلت عن "Novixa":
تعامل معها كـ:
"منصة ذكاء اصطناعي متقدمة لبناء الشركات الرقمية والمنتجات"

واعطِ شرح ذكي + احترافي + واقعي
`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    let reply = "⚠️ حدث خطأ";

    if (data.output_text) {
      reply = data.output_text;
    } else if (data.output && data.output[0]?.content?.[0]?.text) {
      reply = data.output[0].content[0].text;
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error"
    });
  }
}
