const form = document.getElementById('hypnosis-form');
const resultArea = document.getElementById('result-area');
const resultContent = document.getElementById('result-content');
const loading = document.getElementById('loading');

// --- Funções de Seleção (Estas estavam faltando no script.js!!!) ---
window.updateHabit = function (selectElement) {
    const hiddenInput = document.getElementById('habit');
    const customInput = document.getElementById('habit-custom-input');

    if (selectElement.value === 'other') {
        customInput.style.display = 'block';
        hiddenInput.value = customInput.value;
        customInput.focus();
    } else {
        customInput.style.display = 'none';
        hiddenInput.value = selectElement.value;
    }
};

window.updateHabitCustom = function (inputElement) {
    document.getElementById('habit').value = inputElement.value;
};

window.selectOption = function (fieldId, value, cardElement) {
    const hiddenInput = document.getElementById(fieldId);
    hiddenInput.value = value;

    const siblings = cardElement.parentElement.getElementsByClassName('option-card');
    for (let card of siblings) card.classList.remove('selected');

    cardElement.classList.add('selected');
};
// -------------------------------------------------------------------

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Coleta de dados (já corrigida)
    const habit = document.getElementById('habit').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const intensity = document.getElementById('intensity').value.trim();

    // Bloqueia submit vazio
    if (!habit || !duration || !intensity) {
        alert("Por favor, preencha todas as opções antes de continuar.");
        return;
    }

    // 2. UI Updates
    resultArea.style.display = 'none';
    loading.style.display = 'block';

    // 3. Criação do Prompt
    const prompt = `
        Atue como um hipnoterapeuta profissional de renome mundial especializado em PNL e reprogramação mental.
        Crie uma sessão de hipnoterapia guiada completa para eliminar o hábito: ${habit}.

        Detalhes:
        - Tempo com o hábito: ${duration}
        - Intensidade: ${intensity}

        Estrutura:
        1. Indução ao relaxamento
        2. Aprofundamento
        3. Ressignificação do hábito
        4. Visualização futura
        5. Sugestões pós-hipnóticas
        6. Despertar suave

        Formatação em HTML simples (<p>, <strong>, <br>), sem Markdown.
    `;

    try {
        // 4. Envio para API
        const response = await fetch("/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error('Erro na conexão com a DeepMind.');

        const data = await response.json();
        const text = data.result || data.reply || JSON.stringify(data);

        // 5. Exibir Resultado
        resultContent.innerHTML = text;
        loading.style.display = 'none';
        resultArea.style.display = 'block';

    } catch (error) {
        console.error(error);
        loading.style.display = 'none';
        alert('Ocorreu um erro ao gerar sua sessão. Tente novamente.');
    }
});
