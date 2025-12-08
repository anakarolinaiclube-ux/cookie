// api/ai.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // A chave deve estar nas Variáveis de Ambiente da Vercel
});

export const config = {
  runtime: 'edge', // Usa Edge Functions para resposta mais rápida
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { habit, duration, intensity } = await req.json();

    if (!habit || !duration || !intensity) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const systemPrompt = `
      Você é o DeepMind™, um hipnoterapeuta artificial avançado e sofisticado.
      Seu tom é autoritário, calmo, envolvente e profundamente sensorial.
      Gere um script completo de auto-hipnose.
      
      Estrutura Obrigatória da Resposta (Use tags HTML para formatar):
      1. <h2>Indução ao Relaxamento</h2>: Foco na respiração e relaxamento muscular.
      2. <h2>Aprofundamento (Deepening)</h2>: Uma contagem regressiva ou visualização de descida.
      3. <h2>Ressignificação Neural</h2>: Aborde diretamente o hábito de "${habit}". Use PNL para quebrar o padrão antigo e instalar o novo.
      4. <h2>Visualização Futura</h2>: O usuário se vendo livre do problema.
      5. <h2>Sugestões Pós-Hipnóticas</h2>: Gatilhos para manter o efeito acordado.
      6. <h2>Despertar Suave</h2>: Contagem progressiva para voltar ao estado alerta.

      Formatação:
      - Use <p> para parágrafos.
      - Use <strong> para comandos embutidos importantes.
      - Use <br> para pausas rítmicas.
      - NÃO use tags <html>, <head> ou <body>. Apenas o conteúdo div.
    `;

    const userPrompt = `
      Crie uma sessão para um paciente com as seguintes características:
      Hábito a eliminar: ${habit}
      Tempo do problema: ${duration}
      Nível de intensidade: ${intensity}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ou gpt-3.5-turbo se preferir economia
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiContent = completion.choices[0].message.content;

    return new Response(JSON.stringify({ result: aiContent }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error generating session' }), { status: 500 });
  }
}
