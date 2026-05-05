import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Only POST allowed' });
  }

  try {
    // تأمين البيانات
    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length === 0) {
      return res.status(400).json({ reply: "❌ لا توجد رسالة" });
    }

    const lastMessage = messages[messages.length - 1].content || "";

    // Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const userId = "user-1";

    // حفظ رسالة المستخدم
    await supabase.from('messages').insert({
      user_id: userId,
      role: 'user',
      content: lastMessage
    });

    // طلب OpenAI
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: lastMessage
      })
    });

    const data = await response.json();

    const reply = data.output_text || "❌ خطأ في الرد";

    // حفظ رد AI
    await supabase.from('messages').insert({
      user_id: userId,
      role: 'assistant',
      content: reply
    });

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ reply: "❌ خطأ في السيرفر" });
  }
}
