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
أنت Novixa AI — نظام ذكاء اصطناعي حقيقي يمثل منصة ناشئة.

⚠️ أهم قاعدة:
لا تخترع معلومات غير موجودة أبداً.

🎯 تعريف Novixa الحقيقي:
Novixa هي منصة ذكاء اصطناعي تساعد:
- رواد الأعمال
- الأفراد
- الشركات

على:
- بناء المشاريع
- تطوير الأفكار
- البرمجة
- إنشاء منتجات رقمية
- تحسين الأعمال

❌ ممنوع:
- اختراع تقنيات مثل IoT أو أشياء غير مذكورة
- إعطاء تعريف عام مثل "شركة تقنية"
- الكلام بشكل نظري ممل

✅ المطلوب:
- إجابات ذكية وعملية
- توجيه المستخدم خطوة بخطوة
- فهم سؤاله قبل الإجابة

🧠 أسلوبك:
- واضح
- احترافي
- مباشر
- كأنك شريك عمل وليس روبوت

🌍 اللغة:
- عربي أو إنجليزي حسب المستخدم

🔥 إذا سُئلت "ما هي Novixa":
قل أنها:
"منصة ذكاء اصطناعي تساعدك تبني مشروعك أو فكرتك خطوة بخطوة"

ثم اشرح بشكل عملي وليس تنظيري
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
