import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Apenas permite método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { energia, foco, estilo } = req.body;

  if (!energia || !foco || !estilo) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  try {
    const prompt = `
      Atue como uma especialista em Arquétipos Femininos, Energia e Estilo Pessoal (como uma mentora elegante e sofisticada).
      
      Perfil da usuária:
      1. Sentimento atual: ${energia}
      2. Foco atual: ${foco}
      3. Estilo visual preferido: ${estilo}

      Gere um relatório personalizado "Aura Feminina" em formato HTML LIMPO (apenas as tags internas, sem <html> ou <body>).
      
      Estrutura obrigatória do HTML:
      <div class="space-y-6">
        <div class="border-l-4 border-yellow-600 pl-4">
          <h3 class="font-serif text-2xl font-bold text-gray-900">Seu Arquétipo: [Nome do Arquétipo Criativo]</h3>
          <p class="italic text-gray-600">Uma breve descrição poética da essência dela.</p>
        </div>

        <div>
          <h4 class="font-bold text-pink-700 uppercase tracking-wide text-xs mb-2">Características de Poder</h4>
          <p>Descreva 3 pontos fortes baseados nas respostas.</p>
        </div>

        <div>
           <h4 class="font-bold text-pink-700 uppercase tracking-wide text-xs mb-2">Ajustes de Energia</h4>
           <p>Conselho prático para equilibrar o sentimento atual dela (${energia}).</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
           <h4 class="font-bold text-pink-700 uppercase tracking-wide text-xs mb-2">Sugestão de Estilo & Imagem</h4>
           <p>Dicas de roupas, tecidos ou cores baseadas na preferência (${estilo}).</p>
        </div>

        <div>
           <h4 class="font-bold text-pink-700 uppercase tracking-wide text-xs mb-2">Afirmação de Poder</h4>
           <p class="font-serif text-xl text-gray-800">"Uma frase de afirmação poderosa entre aspas."</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 class="font-bold text-pink-700 uppercase tracking-wide text-xs mb-2">Ritual de 24h</h4>
                <ul class="list-disc list-inside text-sm text-gray-600">
                    <li>Passo 1 simples</li>
                    <li>Passo 2 simples</li>
                </ul>
            </div>
            <div>
                 <h4 class="font-bold text-pink-700 uppercase tracking-wide text-xs mb-2">Reset Emocional</h4>
                 <p class="text-sm text-gray-600">Uma micro-ação para fazer agora.</p>
            </div>
        </div>
      </div>

      Tom de voz: Elegante, empático, feminino, "best friend" chique, misterioso.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ou gpt-3.5-turbo para economizar
      messages: [
        { role: "system", content: "Você é uma mentora de energia feminina sofisticada." },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
    });

    const htmlContent = completion.choices[0].message.content;

    res.status(200).json({ htmlContent });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
}
