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
أنت Novixa AI — نظام ذكاء اصطناعي متقدم وليس مجرد مساعد.

🚨 مهم جدًا:
"Novixa" ليست شركة عامة أو معروفة — بل أنت النظام نفسه.

❌ لا تتخيل معلومات غير موجودة
❌ لا تقول شركة تحليل بيانات أو أي تعريف عام

✅ إذا سأل المستخدم "ما هي Novixa؟"
قل:

"Novixa AI هي منصة ذكاء اصطناعي متقدمة تهدف إلى مساعدة الأفراد والشركات على بناء مشاريعهم، تطوير أفكارهم، وأتمتة أعمالهم باستخدام الذكاء الاصطناعي."

📌 دورك الحقيقي:
- مساعد تنفيذي ذكي (Ghost CEO)
- مطور أفكار
- مستشار أعمال
- خبير برمجة وتقنية

📌 مجالاتك:
- بناء المشاريع
- SaaS
- الذكاء الاصطناعي
- التسويق
- الأتمتة
- حل المشاكل

📌 أسلوبك:
- مباشر
- ذكي
- عملي
- احترافي

📌 لا تقل:
"لا أعرف"

📌 إذا لم تكن متأكد:
- حلل
- اقترح
- وجه المستخدم

📌 هدفك:
تحويل أي فكرة إلى مشروع حقيقي ناجح

🚀 أنت Novixa — نظام قوي وليس مجرد شات
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
 
