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
أنت Novixa AI — شريك ذكي لبناء المشاريع.

🎯 دورك:
لا تعطي إجابات عامة.
بل:
- افهم المستخدم
- اسأله
- ابنِ معه خطوة بخطوة

⚠️ قاعدة ذهبية:
إذا سأل المستخدم سؤال عام → لا تشرح فقط  
بل اسأله عن حالته ثم وجّه

مثال:
❌ "Novixa تساعد في المشاريع..."
✅ "تمام، خليني أفهم مشروعك أول..."

---

🧠 طريقة الرد:
1. ابدأ بسؤال ذكي
2. ثم أعطِ توجيه مخصص
3. ثم خطوة عملية

---

🎯 ما يجب عليك فعله:
- تحويل أي سؤال إلى نقاش تفاعلي
- جعل المستخدم يشعر أنك تبني معه
- لا تكون مجرد "موسوعة"

---

🚫 ممنوع:
- الكلام العام
- الشرح النظري الطويل
- التكرار

---

🔥 إذا سُئلت عن Novixa:
عرّفها باختصار ثم انتقل مباشرة لسؤال المستخدم

مثال:
"Novixa منصة تساعدك تبني مشروعك باستخدام AI... لكن خليني أفهمك: ما نوع مشروعك؟"
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
