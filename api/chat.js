
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

    const reply = data.output?.[0]?.content?.[0]?.text || "❌ لا يوجد رد";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "❌ خطأ في السيرفر" });
  }
}
