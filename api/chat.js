import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ reply: "❌ لا توجد رسالة" });
    }

    const userId = "guest";

    // 🔥 آخر رسالة من المستخدم
    const lastMessage = messages[messages.length - 1].content;

    // 🧠 حفظ رسالة المستخدم
    await supabase.from("messages").insert({
      user_id: userId,
      role: "user",
      content: lastMessage
    });

    // 📥 جلب آخر المحادثات
    const { data: history } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(20);

    const formatted = history.map((m) => ({
      role: m.role,
      content: m.content
    }));

    // 🤖 طلب من OpenAI
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: `
أنت Novixa AI:
خبير في المشاريع والبيزنس
تعطي أفكار + خطط تنفيذ + نصائح ربح
تتكلم عربي بسيط واحترافي
`
          },
          ...formatted
        ]
      })
    });

    const data = await response.json();

    const reply = data.output_text || "⚠️ لم يتم الرد";

    // 🧠 حفظ رد AI
    await supabase.from("messages").insert({
      user_id: userId,
      role: "assistant",
      content: reply
    });

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ reply: "❌ خطأ في السيرفر" });
  }
}
