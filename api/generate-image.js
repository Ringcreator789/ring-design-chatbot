export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ prompt, n: 1, size: "1024x1024" }),
    });

    const data = await response.json();
    res.status(200).json({ imageUrl: data.data[0].url });
  } catch (error) {
    res.status(500).json({ error: "Error generating image" });
  }
}
