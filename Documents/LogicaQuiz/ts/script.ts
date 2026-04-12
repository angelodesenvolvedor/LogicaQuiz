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
    // Nível Fácil
    {
        question: 'O que é uma proposição em lógica proposicional?',
        options: [
            'A) Uma afirmação que pode ser verdadeira ou falsa',
            'B) Uma equação matemática',
            'C) Um tipo de função',
            'D) Uma regra de inferência'
        ],
        answer: 0
    },
    {
        question: 'Qual é o símbolo usado para a negação de uma proposição?',
        options: [
            'A) ∧',
            'B) ∨',
            'C) ¬',
            'D) ⇒'
        ],
        answer: 2
    },
    {
        question: 'Qual é o valor lógico da proposição P ∨ Q quando P é falso e Q é verdadeiro?',
        options: [
            'A) Verdadeiro',
            'B) Falso',
            'C) Indeterminado',
            'D) Não aplicável'
        ],
        answer: 0
    },
    {
        question: 'Qual é a forma equivalente de ¬(P ∧ Q)?',
        options: [
            'A) ¬P ∨ ¬Q',
            'B) ¬P ∧ ¬Q',
            'C) P ∨ Q',
            'D) P ∧ ¬Q'
        ],
        answer: 0
    },
    {
        question: 'Qual das seguintes proposições é uma tautologia?',
        options: [
            'A) P ∨ ¬P',
            'B) P ∧ ¬P',
            'C) P ∧ Q',
            'D) ¬P ∧ ¬Q'
        ],
        answer: 0
    },
    // Nível Intermediário
    {
        question: 'Construa a tabela-verdade para a proposição P ∧ (Q ∨ R). Qual é o valor lógico quando P é verdadeiro, Q é falso e R é verdadeiro?',
        options: [
            'A) Verdadeiro',
            'B) Falso',
            'C) Indeterminado',
            'D) Não aplicável'
        ],
        answer: 0
    },
    {
        question: 'Qual é a equivalência lógica de P ∧ (Q ∨ R)?',
        options: [
            'A) (P ∧ Q) ∨ (P ∧ R)',
            'B) (P ∨ Q) ∧ (P ∨ R)',
            'C) (P ∧ Q) ∧ (P ∧ R)',
            'D) (P ∨ Q) ∨ (P ∨ R)'
        ],
        answer: 0
    },
    {
        question: 'A proposição P ↔ Q é equivalente a qual das seguintes expressões?',
        options: [
            'A) (P ∧ Q) ∨ (¬P ∧ ¬Q)',
            'B) (P ∨ Q) ∧ (¬P ∨ ¬Q)',
            'C) (P ∧ ¬Q) ∨ (¬P ∧ Q)',
            'D) P ∨ Q'
        ],
        answer: 0
    },
    {
        question: 'Qual é o valor lógico da proposição ¬(P ∧ Q) quando P é verdadeiro e Q é verdadeiro?',
        options: [
            'A) Verdadeiro',
            'B) Falso',
            'C) Indeterminado',
            'D) Não aplicável'
        ],
        answer: 1
    },
    {
        question: 'Qual proposição é equivalente a ¬(P ∨ Q)?',
        options: [
            'A) ¬P ∧ ¬Q',
            'B) ¬P ∨ ¬Q',
            'C) P ∧ Q',
            'D) P ∨ ¬Q'
        ],
        answer: 0
    },
    // Nível Avançado
    {
        question: 'Qual é a equivalência lógica de P → Q?',
        options: [
            'A) ¬P ∨ Q',
            'B) P ∧ ¬Q',
            'C) ¬P ∧ Q',
            'D) P ∨ ¬Q'
        ],
        answer: 0
    },
    {
        question: 'Qual das seguintes proposições é equivalente a ¬P ∨ (Q ∧ R)?',
        options: [
            'A) (¬P ∨ Q) ∧ (¬P ∨ R)',
            'B) ¬P ∧ (Q ∨ R)',
            'C) (¬P ∧ Q) ∨ (¬P ∧ R)',
            'D) ¬(P ∨ (Q ∧ R))'
        ],
        answer: 0
    },    
    {
        question: 'Qual proposição é equivalente a "P ↔ Q"?',
        options: [
            'A) (P ∧ Q) ∨ (¬P ∧ ¬Q)',
            'B) P ∨ Q',
            'C) P ∧ Q',
            'D) ¬P ∨ Q'
        ],
        answer: 0
    },    
    {
        question: 'Se P é uma proposição contingente, qual é o valor de "P ou Não P"?',
        options: [
            'A) Verdadeiro',
            'B) Falso',
            'C) Indefinido',
            'D) Não pode ser determinado'
        ],
        answer: 0
    },
    {
        question: 'Qual proposição é equivalente a "P se e somente se Q"?',
        options: [
            'A) (P ∧ Q) ∨ (¬P ∧ ¬Q)',
            'B) P ∨ Q',
            'C) P ∧ Q',
            'D) ¬P ∨ Q'
        ],
        answer: 0
    },    
    {
        question: 'Qual é a forma equivalente de "P → (Q ∧ R)"?',
        options: [
            'A) (P → Q) ∧ (P → R)',
            'B) P ∧ (Q ∨ R)',
            'C) (P ∧ Q) → R',
            'D) (P → Q) ∨ R'
        ],
        answer: 0
    },
    {
        question: 'Qual é a equivalência lógica de ¬(P ∧ ¬Q)?',
        options: [
            'A) ¬P ∨ Q',
            'B) P ∨ ¬Q',
            'C) P ∨ Q',
            'D) ¬P ∨ ¬Q'
        ],
        answer: 0
    },    
    {
        question: 'Qual é a forma equivalente de "¬(P ∨ Q) ∧ R"?',
        options: [
            'A) (¬P ∧ ¬Q) ∧ R',
            'B) ¬(P ∨ Q ∨ R)',
            'C) (¬P ∧ R) ∨ (¬Q ∧ R)',
            'D) ¬(P ∧ Q) ∧ R'
        ],
        answer: 0
    },
    {
        question: 'Dada a proposição "P → Q" e "Q → R", qual é a equivalência lógica de "P → R"?',
        options: [
            'A) (P ∧ Q) → R',
            'B) P ∧ (Q → R)',
            'C) (P → Q) ∧ (Q → R)',
            'D) P → (Q ∧ R)'
        ],
        answer: 0
    },
    {
        question: 'Qual é a equivalência de "¬(P ∧ Q) ∨ (R ∧ ¬S)"?',
        options: [
            'A) (¬P ∨ ¬Q) ∨ (R ∧ ¬S)',
            'B) (¬P ∨ ¬Q) ∧ (R ∨ ¬S)',
            'C) (¬P ∨ ¬Q) ∧ (R ∧ ¬S)',
            'D) ¬(P ∧ (Q ∨ R)) ∨ ¬S'
        ],
        answer: 0
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
