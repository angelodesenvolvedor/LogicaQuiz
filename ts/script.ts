// Seleção dos elementos da página
const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const loginArea = document.getElementById('loginArea') as HTMLDivElement;
const instructionsSection = document.getElementById('instructions') as HTMLDivElement;
const startButton = document.getElementById('startButton') as HTMLButtonElement;
const gameArea = document.getElementById('gameArea') as HTMLDivElement;
const questionTitle = document.getElementById('questionTitle') as HTMLHeadingElement;
const optionsContainer = document.getElementById('optionsContainer') as HTMLDivElement;
const scoreDisplay = document.getElementById('score') as HTMLParagraphElement;
const roundDisplay = document.getElementById('round') as HTMLParagraphElement;
const timeLeftDisplay = document.getElementById('timeLeft') as HTMLParagraphElement;
const feedbackMessage = document.getElementById('feedbackMessage') as HTMLDivElement;
const rankingArea = document.getElementById('rankingArea') as HTMLDivElement;
const rankingList = document.getElementById('rankingList') as HTMLOListElement;
const restartButton = document.getElementById('restartButton') as HTMLButtonElement;

let timer: ReturnType<typeof setInterval> | null = null;
let db: IDBDatabase | null = null;

// Array de perguntas
const questions = [
    // Fácil
    {
        question: 'Qual é a definição de uma tautologia?',
        options: [
            'A) Uma proposição que é verdadeira em todos os casos possíveis', 
            'B) Uma proposição que é falsa em todos os casos possíveis', 
            'C) Uma proposição que é verdadeira apenas em alguns casos', 
            'D) Uma proposição que pode ser verdadeira ou falsa dependendo do contexto'
        ],
        answer: 0,
        difficulty: 'easy'
    },
    {
        question: 'O que é uma proposição contingente?',
        options: [
            'A) Uma proposição que pode ser verdadeira ou falsa dependendo do caso', 
            'B) Uma proposição que é sempre verdadeira', 
            'C) Uma proposição que é sempre falsa', 
            'D) Uma proposição que é verdadeira em todos os casos possíveis'
        ],
        answer: 0,
        difficulty: 'easy'
    },
    {
        question: 'Qual é a definição de uma contradição?',
        options: [
            'A) Uma proposição que é falsa em todos os casos possíveis', 
            'B) Uma proposição que é verdadeira em todos os casos possíveis', 
            'C) Uma proposição que é verdadeira em alguns casos e falsa em outros', 
            'D) Uma proposição que não pode ser determinada como verdadeira ou falsa'
        ],
        answer: 0,
        difficulty: 'easy'
    },
    {
        question: 'O que caracteriza uma prova direta?',
        options: [
            'A) Demonstrar que a conclusão é verdadeira assumindo que a premissa é verdadeira', 
            'B) Mostrar que a conclusão é falsa para provar que a proposição é verdadeira', 
            'C) Provar que a proposição é verdadeira em todos os casos possíveis', 
            'D) Usar uma contradição para provar que a proposição é verdadeira'
        ],
        answer: 0,
        difficulty: 'easy'
    },
    {
        question: 'Qual é a forma correta da negação da proposição "P ou Q"?',
        options: [
            'A) Não P e Não Q', 
            'B) Não P ou Não Q', 
            'C) P e Q', 
            'D) P ou Não Q'
        ],
        answer: 0,
        difficulty: 'easy'
    },
    {
        question: 'Qual é a forma correta da proposição "P e Não (Q ou R)"?',
        options: [
            'A) P e Não Q e Não R', 
            'B) Não P ou (Q e R)', 
            'C) P e (Não Q ou Não R)', 
            'D) Não P e (Q ou R)'
        ],
        answer: 0,
        difficulty: 'easy'
    },
    // Intermediário
    {
        question: 'Qual é a negação de "Se P então Q"?',
        options: [
            'A) P e Não Q', 
            'B) Não P ou Q', 
            'C) Não P e Não Q', 
            'D) P ou Q'
        ],
        answer: 0,
        difficulty: 'medium'
    },
    {
        question: 'Quando a proposição "Se P então Q" é considerada verdadeira?',
        options: [
            'A) Quando P é verdadeiro e Q é verdadeiro', 
            'B) Quando P é falso e Q é verdadeiro', 
            'C) Quando P é verdadeiro e Q é falso', 
            'D) Quando P é falso e Q é falso'
        ],
        answer: 1,
        difficulty: 'medium'
    },
    {
        question: 'Qual proposição é equivalente a "Não (P e Não Q)"?',
        options: [
            'A) Não P ou Q', 
            'B) P ou Q', 
            'C) Não P e Q', 
            'D) Não P ou Não Q'
        ],
        answer: 0,
        difficulty: 'medium'
    },
    {
        question: 'Qual é a forma equivalente de "P e (Q ou R)"?',
        options: [
            'A) (P e Q) ou (P e R)', 
            'B) P e Q e R', 
            'C) P e (Q e R)', 
            'D) (P ou Q) e (P ou R)'
        ],
        answer: 0,
        difficulty: 'medium'
    },
    {
        question: 'Qual é a forma equivalente de "Não (P ou Q) e R"?',
        options: [
            'A) (Não P e Não Q) e R', 
            'B) (Não P e Não Q) ou R', 
            'C) Não P e (Não Q e R)', 
            'D) Não (P ou Q) ou R'
        ],
        answer: 0,
        difficulty: 'medium'
    },
    // Avançado
    {
        question: 'Se P é uma tautologia, qual é o valor da proposição "P ou Q"?',
        options: [
            'A) Verdadeiro', 
            'B) Falso', 
            'C) Indefinido', 
            'D) Depende do valor de Q'
        ],
        answer: 0,
        difficulty: 'hard'
    },
    {
        question: 'Qual é a prova por contraposição de "Se P então Q"?',
        options: [
            'A) Mostrar que se Não Q então Não P', 
            'B) Mostrar que se P então Não Q', 
            'C) Mostrar que se Não P então Q', 
            'D) Mostrar que se Q então P'
        ],
        answer: 0,
        difficulty: 'hard'
    },
    {
        question: 'Qual é a prova por contradição para provar que "P ou Q" é verdadeiro?',
        options: [
            'A) Suponha que P e Q são falsos e chegue a uma contradição', 
            'B) Suponha que P é verdadeiro e chegue a uma contradição', 
            'C) Suponha que Q é verdadeiro e chegue a uma contradição', 
            'D) Suponha que P é falso e chegue a uma contradição'
        ],
        answer: 0,
        difficulty: 'hard'
    },
    {
        question: 'Qual é a prova por casos de que "P ou Q" é verdadeiro?',
        options: [
            'A) Mostrar que P é verdadeiro ou Q é verdadeiro em dois casos distintos', 
            'B) Mostrar que P e Q são ambos verdadeiros', 
            'C) Mostrar que P é falso ou Q é falso', 
            'D) Mostrar que P é verdadeiro e Q é falso'
        ],
        answer: 0,
        difficulty: 'hard'
    },
    {
        question: 'Qual é a forma equivalente de "P se e somente se Q"?',
        options: [
            'A) (P e Q) ou (Não P e Não Q)', 
            'B) (P e Q) e (Não P e Q)', 
            'C) (P ou Q) e (P ou Não Q)', 
            'D) Não P ou Q'
        ],
        answer: 0,
        difficulty: 'hard'
    },
    {
        question: 'Qual é a forma equivalente de "P e Não (Q ou R)"?',
        options: [
            'A) (P e Não Q e Não R)', 
            'B) (P e Não Q) ou (P e Não R)', 
            'C) P e (Não Q ou Não R)', 
            'D) Não P ou (Q e R)'
        ],
        answer: 0,
        difficulty: 'hard'
    },
    {
        question: 'Como se chama uma proposição que é falsa em todos os casos possíveis?',
        options: [
            'A) Contradição', 
            'B) Tautologia', 
            'C) Contingência', 
            'D) Equivalência'
        ],
        answer: 0,
        difficulty: 'hard'
    }
];

// Estrutura para armazenar o estado do jogo e ranking
interface GameState {
    ranking: { name: string; score: number }[];
    currentQuestionIndex: number;
    score: number;
    round: number;
    timeLeft: number;
}

// Inicializar estado do jogo
const initialGameState: GameState = {
    ranking: [],
    currentQuestionIndex: 0,
    score: 0,
    round: 1,
    timeLeft: 30
};

// Estado do jogo
const gameState: GameState = { ...initialGameState };

// Função para abrir o banco de dados IndexedDB
function openDatabase(): void {
    const request = indexedDB.open('LógicaQuizDB', 1);

    request.onupgradeneeded = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('gameState', { keyPath: 'id' });
    };

    request.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        loadGameState();
    };

    request.onerror = () => {
        console.error('Erro ao abrir o banco de dados');
    };
}

// Função para carregar o estado do jogo do IndexedDB
function loadGameState(): void {
    if (!db) return;

    const transaction = db.transaction('gameState', 'readonly');
    const store = transaction.objectStore('gameState');
    const request = store.get(1);

    request.onsuccess = () => {
        if (request.result) {
            Object.assign(gameState, request.result);
            console.log('Estado do jogo carregado', gameState);
        }
    };

    request.onerror = () => {
        console.error('Erro ao carregar o estado do jogo');
    };
}

// Função para salvar o estado do jogo no IndexedDB
function saveGameState(): void {
    if (!db) return;

    const transaction = db.transaction('gameState', 'readwrite');
    const store = transaction.objectStore('gameState');
    const request = store.put({ ...gameState, id: 1 });

    request.onsuccess = () => console.log('Estado do jogo salvo');
    request.onerror = () => console.error('Erro ao salvar o estado do jogo');
}

function handleLogin(event: Event): void {
    event.preventDefault();

    // Pegando os valores do input
    let username = (document.getElementById('username') as HTMLInputElement).value;
    const userCode = (document.getElementById('userCode') as HTMLInputElement).value;

    // Normalização do username para evitar duplicação por case sensitivity
    username = username.toLowerCase().trim();

    // Verificação de unicidade do username no ranking
    const existingUser = gameState.ranking.find(entry => entry.name === username);
    if (existingUser) {
        alert('Nome de usuário já existe. Escolha outro nome.');
        return;
    }

    // Validação do código do usuário para garantir que é um número de 9 dígitos
    if (!userCode.match(/^\d{9}$/)) {
        alert('O código do usuário deve ser um número de 9 dígitos.');
        return;
    }

    // Verificação dos campos e progresso para a próxima seção
    if (username !== '' && userCode !== '') {
        alert(`Bem-vindo, ${username}!`);
        loginArea.classList.add('hidden');
        instructionsSection.classList.remove('hidden');
        startButton.classList.remove('hidden'); // Exibir o botão Iniciar o Jogo
        resetGameStateForNewUser(); // Resetar o estado do jogo para um novo usuário
    } else {
        alert('Por favor, preencha ambos os campos.');
    }
}

// Função para iniciar o jogo
function startGame(): void {
    instructionsSection.classList.add('hidden');
    gameArea.classList.remove('hidden');
    startButton.classList.add('hidden');
    showQuestion();
}

// Função para exibir a pergunta atual
function showQuestion(): void {
    const currentQuestion = questions[gameState.currentQuestionIndex];

    if (!currentQuestion) {
        console.error('Erro: Pergunta não encontrada!');
        return;
    }

    questionTitle.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
    });

    feedbackMessage.classList.add('hidden');
    resetTimer();
}

// Função para resetar e iniciar o temporizador
function resetTimer(): void {
    gameState.timeLeft = 30;
    timeLeftDisplay.textContent = `Tempo: ${gameState.timeLeft}s`;
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

// Função para atualizar o temporizador
function updateTimer(): void {
    if (--gameState.timeLeft <= 0) {
        clearInterval(timer!);
        handleTimeout();
    } else {
        timeLeftDisplay.textContent = `Tempo: ${gameState.timeLeft}s`;
    }
}

// Função para lidar com a seleção de uma opção
function selectOption(selectedIndex: number): void {
    clearInterval(timer!);
    const isCorrect = selectedIndex === questions[gameState.currentQuestionIndex].answer;

    if (isCorrect) gameState.score += 10;

    showFeedbackMessage(isCorrect ? 'Certo' : 'Errado', isCorrect);

    gameState.currentQuestionIndex++;
    gameState.round++;

    scoreDisplay.textContent = `Pontuação: ${gameState.score}`;
    roundDisplay.textContent = `Rodada: ${gameState.round}`;

    setTimeout(
        gameState.currentQuestionIndex < questions.length ? showQuestion : endGame,
        2000
    );
}

// Função para lidar com o tempo esgotado
function handleTimeout(): void {
    showFeedbackMessage('Tempo esgotado!', false);
    gameState.currentQuestionIndex++;
    gameState.round++;
    setTimeout(
        gameState.currentQuestionIndex < questions.length ? showQuestion : endGame,
        2000
    );
}

// Função para exibir a mensagem de feedback
function showFeedbackMessage(message: string, isCorrect: boolean): void {
    feedbackMessage.textContent = message;
    feedbackMessage.classList.remove('hidden');
    feedbackMessage.style.color = isCorrect ? 'green' : 'red';

    setTimeout(() => feedbackMessage.classList.add('hidden'), 1500);
}

// Função para finalizar o jogo
function endGame(): void {
    clearInterval(timer!);
    gameArea.classList.add('hidden');
    rankingArea.classList.remove('hidden');
    updateRanking();
}

// Função para atualizar o ranking
function updateRanking(): void {
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const username = usernameInput.value.toLowerCase().trim();

    gameState.ranking.push({ name: username, score: gameState.score });
    gameState.ranking.sort((a, b) => b.score - a.score);

    rankingList.innerHTML = '';
    gameState.ranking.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score} pontos`;
        rankingList.appendChild(listItem);
    });

    saveGameState();
}

// Função para reiniciar o jogo
function restartGame(): void {
    rankingArea.classList.add('hidden');
    loginArea.classList.remove('hidden');
    resetGameStateForNewUser();
    loginForm.reset();
}

// Função para resetar o estado do jogo para um novo usuário
function resetGameStateForNewUser(): void {
    Object.assign(gameState, {
        ...initialGameState,
        ranking: [...gameState.ranking],
    });
    scoreDisplay.textContent = `Pontuação: ${gameState.score}`;
    roundDisplay.textContent = `Rodada: ${gameState.round}`;
    timeLeftDisplay.textContent = `Tempo: ${gameState.timeLeft}s`;
    feedbackMessage.classList.add('hidden');
}

// Event listeners
loginForm.addEventListener('submit', handleLogin);
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

// Abrir banco de dados ao carregar a página
window.addEventListener('load', openDatabase);