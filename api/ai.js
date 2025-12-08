const form = document.getElementById('hypnosis-form');
const resultArea = document.getElementById('result-area');
const resultContent = document.getElementById('result-content');
const loading = document.getElementById('loading');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Coleta de dados
    const habit = document.getElementById('habit').value;
    const duration = document.getElementById('duration').value;
    const intensity = document.getElementById('intensity').value;

    // 2. UI Updates
    resultArea.style.display = 'none';
    loading.style.display = 'block';
    
    // 3. Criação do Prompt
    const prompt = `
        Atue como um hipnoterapeuta profissional de renome mundial especializado em PNL e reprogramação mental.
        Crie uma sessão de hipnoterapia guiada em texto completa e imersiva para um paciente que deseja eliminar o hábito de: ${habit}.
        
        Detalhes do paciente:
        - Tempo que possui o hábito: ${duration}.
        - Intensidade do vício/hábito: ${intensity}.

        Estrutura da sessão (texto corrido e formatado):
        1. Indução ao relaxamento profundo (respiração e contagem).
        2. Aprofundamento do transe.
        3. Ressignificação do hábito (focando na intensidade ${intensity}).
        4. Visualização do futuro livre desse hábito.
        5. Sugestões pós-hipnóticas de controle e aversão ao hábito.
        6. Despertar suave e energizante.

        O tom deve ser calmo, autoritário mas acolhedor, misterioso e profundamente transformador.
        Use formatação HTML simples (como <p>, <strong>, <br>) para separar os parágrafos e dar ênfase. Não use Markdown.
    `;

    try {
        // 4. Fetch para API
        const response = await fetch("/api/ai", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('Erro na conexão com a DeepMind.');
        }

        const data = await response.json();
        
        // Assumindo que o backend retorna { result: "texto..." } ou direto o texto
        const text = data.result || data.reply || JSON.stringify(data);

        // 5. Exibir Resultado
        resultContent.innerHTML = text;
        loading.style.display = 'none';
        resultArea.style.display = 'block';

        // 6. Limpar campos
        form.reset();

    } catch (error) {
        console.error(error);
        loading.style.display = 'none';
        alert('Ocorreu um erro ao gerar sua sessão. Tente novamente.');
    }
});
