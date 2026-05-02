
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

    // 👇 الحل الحقيقي هنا
    let reply = "";

    if (data.output_text) {
      reply = data.output_text;
    } else if (data.output && data.output.length > 0) {
      for (const item of data.output) {
        if (item.content) {
          for (const part of item.content) {
            if (part.type === "output_text") {
              reply += part.text;
            }
          }
        }
      }
    }

    if (!reply) {
      console.log("DEBUG FULL RESPONSE:", JSON.stringify(data, null, 2));
      reply = "❌ لا يوجد رد من AI";
    }

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "❌ خطأ في السيرفر" });
  }
}
