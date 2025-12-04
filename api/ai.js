import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt não fornecido." });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um gerador de receitas extremamente preciso e confiável." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    return res.status(200).json({
      result: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("Erro na API:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Erro interno ao gerar resposta.",
      details: error.message
    });
  }
}
