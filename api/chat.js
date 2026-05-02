
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const { message } = req.body;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: message
      })
    });

    const data = await response.json();

    // 🔥 هذا هو الحل الحقيقي
    let reply = "";

    if (data.output && data.output.length > 0) {
      for (const item of data.output) {
        if (item.content) {
          for (const part of item.content) {
            if (part.text) {
              reply += part.text;
            }
          }
        }
      }
    }

    if (!reply) {
      reply = "❌ لم يتم استخراج الرد";
    }

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "❌ خطأ في السيرفر" });
  }
}
