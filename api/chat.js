
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST allowed" });
    }

    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message
      })
    });

    const data = await response.json();

    // 👇 أهم سطر للتشخيص
    console.log("FULL OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    let reply = "";

    if (data.output_text) {
      reply = data.output_text;
    } else if (data.output && data.output[0]?.content?.[0]?.text) {
      reply = data.output[0].content[0].text;
    } else {
      reply = "⚠️ لم يتم استخراج الرد";
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
