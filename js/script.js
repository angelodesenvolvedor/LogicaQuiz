"use strict";
// Seleção dos elementos da página
const loginForm = document.getElementById('loginForm');
const loginArea = document.getElementById('loginArea');
const instructionsSection = document.getElementById('instructions');
const startButton = document.getElementById('startButton');
const gameArea = document.getElementById('gameArea');
const questionTitle = document.getElementById('questionTitle');
const optionsContainer = document.getElementById('optionsContainer');
const scoreDisplay = document.getElementById('score');
const roundDisplay = document.getElementById('round');
const timeLeftDisplay = document.getElementById('timeLeft');
const feedbackMessage = document.getElementById('feedbackMessage');
const rankingArea = document.getElementById('rankingArea');
const rankingList = document.getElementById('rankingList');
const restartButton = document.getElementById('restartButton');
let timer = null;
let db = null;
// Array de perguntas
const questions = [
    {
        question: 'Qual é a forma correta da negação da proposição "P ou Q"?',
        options: [
            'A) Não P e Não Q',
            'B) Não P ou Não Q',
            'C) P e Q',
            'D) P ou Não Q'
        ],
        answer: 0
    },
    {
        question: 'Quando a proposição "Se P então Q" é considerada verdadeira?',
        options: [
            'A) Quando P é verdadeiro e Q é verdadeiro',
            'B) Quando P é falso e Q é verdadeiro',
            'C) Quando P é verdadeiro e Q é falso',
            'D) Quando P é falso e Q é falso'
        ],
        answer: 1
    },
    {
        question: 'Qual é a forma equivalente de "P e (Q ou R)"?',
        options: [
            'A) (P e Q) ou (P e R)',
            'B) P e Q e R',
            'C) P e (Q e R)',
            'D) (P ou Q) e (P ou R)'
        ],
        answer: 0
    },
    {
        question: 'Como se chama uma proposição que é verdadeira em todos os casos possíveis?',
        options: [
            'A) Tautologia',
            'B) Contradição',
            'C) Contingência',
            'D) Equivalência'
        ],
        answer: 0
    },
    {
        question: 'Qual é a negação de "Se P então Q"?',
        options: [
            'A) P e Não Q',
            'B) Não P ou Q',
            'C) Não P e Não Q',
            'D) P ou Q'
        ],
        answer: 0
    },
    {
        question: 'Qual proposição é equivalente a "P ou (Q e R)"?',
        options: [
            'A) (P ou Q) e (P ou R)',
            'B) P ou Q ou R',
            'C) (P e Q) ou (P e R)',
            'D) (P e Q) ou R'
        ],
        answer: 0
    },
    {
        question: 'Se P e Q são ambas falsas, qual é o valor da proposição "P ou Q"?',
        options: [
            'A) Verdadeira',
            'B) Falsa',
            'C) Indefinida',
            'D) Não pode ser determinado'
        ],
        answer: 1
    },
    {
        question: 'Qual é o valor da proposição "Não (P e Q)" quando P é verdadeiro e Q é falso?',
        options: [
            'A) Verdadeiro',
            'B) Falso',
            'C) Indefinido',
            'D) Não pode ser determinado'
        ],
        answer: 0
    },
    {
        question: 'Qual é a forma correta da proposição "P e Não (Q ou R)"?',
        options: [
            'A) P e Não Q e Não R',
            'B) Não P ou (Q e R)',
            'C) P e (Não Q ou Não R)',
            'D) Não P e (Q ou R)'
        ],
        answer: 0
    },
    {
        question: 'Se P é uma tautologia, qual é o valor da proposição "P ou Q"?',
        options: [
            'A) Verdadeiro',
            'B) Falso',
            'C) Indefinido',
            'D) Depende do valor de Q'
        ],
        answer: 0
    },
    {
        question: 'Qual proposição é equivalente a "Não (P e Não Q)"?',
        options: [
            'A) Não P ou Q',
            'B) P ou Q',
            'C) Não P e Q',
            'D) Não P ou Não Q'
        ],
        answer: 0
    },
    {
        question: 'Como se chama uma proposição que é falsa em todos os casos possíveis?',
        options: [
            'A) Contradição',
            'B) Tautologia',
            'C) Contingência',
            'D) Equivalência'
        ],
        answer: 0
    },
    {
        question: 'Qual é a forma equivalente de "Não (P e Q) ou R"?',
        options: [
            'A) (Não P ou Não Q) ou R',
            'B) Não P ou (Não Q e R)',
            'C) Não (P e Q) e R',
            'D) Não P ou Não Q ou R'
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
            'A) (P e Q) ou (Não P e Não Q)',
            'B) P ou Q',
            'C) P e Q',
            'D) Não P ou Q'
        ],
        answer: 0
    }
];
// Inicializar estado do jogo
const initialGameState = {
    ranking: [],
    currentQuestionIndex: 0,
    score: 0,
    round: 1,
    timeLeft: 30
};
// Estado do jogo
const gameState = Object.assign({}, initialGameState);
// Função para abrir o banco de dados IndexedDB
function openDatabase() {
    const request = indexedDB.open('LógicaQuizDB', 1);
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        db.createObjectStore('gameState', { keyPath: 'id' });
    };
    request.onsuccess = (event) => {
        db = event.target.result;
        loadGameState();
    };
    request.onerror = () => {
        console.error('Erro ao abrir o banco de dados');
    };
}
// Função para carregar o estado do jogo do IndexedDB
function loadGameState() {
    if (!db)
        return;
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
function saveGameState() {
    if (!db)
        return;
    const transaction = db.transaction('gameState', 'readwrite');
    const store = transaction.objectStore('gameState');
    const request = store.put(Object.assign(Object.assign({}, gameState), { id: 1 }));
    request.onsuccess = () => console.log('Estado do jogo salvo');
    request.onerror = () => console.error('Erro ao salvar o estado do jogo');
}
function handleLogin(event) {
    event.preventDefault();
    // Pegando os valores do input
    let username = document.getElementById('username').value;
    const userCode = document.getElementById('userCode').value;
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
    }
    else {
        alert('Por favor, preencha ambos os campos.');
    }
}
// Função para iniciar o jogo
function startGame() {
    instructionsSection.classList.add('hidden');
    gameArea.classList.remove('hidden');
    startButton.classList.add('hidden');
    showQuestion();
}
// Função para exibir a pergunta atual
function showQuestion() {
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
function resetTimer() {
    gameState.timeLeft = 30;
    timeLeftDisplay.textContent = `Tempo: ${gameState.timeLeft}s`;
    if (timer)
        clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}
// Função para atualizar o temporizador
function updateTimer() {
    if (--gameState.timeLeft <= 0) {
        clearInterval(timer);
        handleTimeout();
    }
    else {
        timeLeftDisplay.textContent = `Tempo: ${gameState.timeLeft}s`;
    }
}
// Função para lidar com a seleção de uma opção
function selectOption(selectedIndex) {
    clearInterval(timer);
    const isCorrect = selectedIndex === questions[gameState.currentQuestionIndex].answer;
    if (isCorrect)
        gameState.score += 10;
    showFeedbackMessage(isCorrect ? 'Certo' : 'Errado', isCorrect);
    gameState.currentQuestionIndex++;
    gameState.round++;
    scoreDisplay.textContent = `Pontuação: ${gameState.score}`;
    roundDisplay.textContent = `Rodada: ${gameState.round}`;
    setTimeout(gameState.currentQuestionIndex < questions.length ? showQuestion : endGame, 2000);
}
// Função para lidar com o tempo esgotado
function handleTimeout() {
    showFeedbackMessage('Tempo esgotado!', false);
    gameState.currentQuestionIndex++;
    gameState.round++;
    setTimeout(gameState.currentQuestionIndex < questions.length ? showQuestion : endGame, 2000);
}
// Função para exibir a mensagem de feedback
function showFeedbackMessage(message, isCorrect) {
    feedbackMessage.textContent = message;
    feedbackMessage.classList.remove('hidden');
    feedbackMessage.style.color = isCorrect ? 'green' : 'red';
    setTimeout(() => feedbackMessage.classList.add('hidden'), 1500);
}
// Função para finalizar o jogo
function endGame() {
    clearInterval(timer);
    gameArea.classList.add('hidden');
    rankingArea.classList.remove('hidden');
    updateRanking();
}
// Função para atualizar o ranking
function updateRanking() {
    const usernameInput = document.getElementById('username');
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
function restartGame() {
    rankingArea.classList.add('hidden');
    loginArea.classList.remove('hidden');
    resetGameStateForNewUser();
    loginForm.reset();
}
// Função para resetar o estado do jogo para um novo usuário
function resetGameStateForNewUser() {
    Object.assign(gameState, Object.assign(Object.assign({}, initialGameState), { ranking: [...gameState.ranking] }));
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
