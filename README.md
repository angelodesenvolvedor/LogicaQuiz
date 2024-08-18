# Lógica Quiz

**Uma aplicação interativa para testar e aprimorar conhecimentos em lógica proposicional.**

## 🔥 Introdução

O **Lógica Quiz** é um projeto desenvolvido como parte da disciplina de **Matemática Discreta** do curso de **Bacharelado em Tecnologia da Informação**. Trata-se de um jogo educativo que envolve lógica, onde os usuários podem aprimorar seu raciocínio lógico através de perguntas sobre lógica proposicional. O objetivo principal é fornecer uma plataforma interativa para praticar e entender conceitos fundamentais de lógica.

**✅ Funcionalidades:**
- Perguntas de múltipla escolha em três níveis de dificuldade: fácil, intermediário e avançado.
- Feedback imediato sobre respostas corretas e incorretas.
- Sistema de pontuação com um ranking para comparar resultados.
- Conteúdo educativo sobre lógica proposicional, incluindo tautologia, contradição, contingência e equivalência.
- Interface responsiva que se adapta a diferentes tamanhos de tela.

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado em seu sistema:

- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/)

## 🔨 Guia de instalação

**Passo 1: Clonar o repositório**
```bash
git clone https://github.com/angelodesenvolvedor/LogicaQuiz.git
cd LogicaQuiz
```

**Passo 2: Instalar dependências**
```bash
npm install
```

**Passo 3: Instalar o TypeScript como dependência de desenvolvimento**
```bash
npm install typescript -D
```

**Passo 4: Rodar o TypeScript**
```bash
npx tsc --watch
```

## 📂 Estrutura de Pastas

```
/LogicaQuiz
    /css
        style.css
    /image
        logomarca.png
    /js
        script.js
    index.html
```

- **`/css`**: Contém o arquivo de estilo `style.css` para a aparência da aplicação.
- **`/image`**: Contém imagens usadas no projeto, como o ícone `logomarca.png`.
- **`/js`**: Contém o arquivo de script `script.js` para a lógica do jogo.
- **`index.html`**: Arquivo principal HTML da aplicação.
  
![Tela de Login]![image](https://github.com/user-attachments/assets/0b2f3098-b19d-4bb0-9cc4-6d034858de06)

*Tela de Login: A tela onde os usuários inserem seu nome e PIN para acessar o jogo.*

![Tela de Jogo](./image/tela-jogo.png)  
*Tela de Jogo: Exibe a pergunta atual e opções de resposta, além de mostrar a pontuação e o tempo restante.*

![Tela de Ranking](./image/tela-ranking.png)  
*Tela de Ranking: Mostra a classificação dos jogadores com base em suas pontuações.*


## 📦 Tecnologias usadas

- **HTML**: Define a estrutura e o layout da aplicação.
- **CSS**: Responsável pela estilização da interface do usuário.
- **TypeScript**: Utilizado para escrever a lógica do jogo com segurança de tipos.
- **JavaScript**: Manipula o DOM e fornece a interatividade necessária para o funcionamento do jogo.

## 🧑🏽‍💻 Autor

* **Angelo Silvano** - *Front-End Developer* - [angelodesenvolvedor](https://github.com/angelodesenvolvedor)

## 📄 Licença

* Este projeto está sob a licença MIT - acesse os detalhes em [LICENSE.md](https://github.com/angelodesenvolvedor/LogicaQuiz/tree/master?tab=MIT-1-ov-file).
