//VARIAVEIS
const card = document.querySelectorAll(".card");
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
// Objeto com as imagens (caminhos relativos)
const frontCard = [
  { id: 1, img: "img_1.jpg" },
  { id: 2, img: "img_2.jpg" },
  { id: 3, img: "img_3.jpg" },
];
// Variável para contar pares
let matchedPairs = 0;
const totalPairs = frontCard.length; // 3 pares
const winMessage = document.querySelector(".win-message");
const restartWinBtn = document.querySelector("#restart-win");
const restartLoseBtn = document.querySelector("#restart-lose");
// Variável para número máximo de jogadas
let moves = 0;
const MAX_MOVES = 5;
const movesElement = document.getElementById("moves");
const maxMovesElement = document.getElementById("max-moves");
const loseMessage = document.querySelector(".lose-message");

//Duplicar o objeto de imagens para criar pares e embaralhá-las.
const shufflePairs = [...frontCard, ...frontCard]
  .map((c) => ({ ...c, img: c.img || "fallback.png" }))
  .sort(() => Math.random() - 0.5);

// Atribuir dinamicamente IDs e imagens
card.forEach((card, index) => {
  const cardData = shufflePairs[index];
  // Atribui ID único ao dataset
  cardData.img = cardData.img || "fallback.png"; // Fallback se a imagem for indefinida
  card.dataset.cardId = cardData.id;
  // Insere a imagem no verso
  card.querySelector(
    ".card-back"
  ).innerHTML = `<img src="${cardData.img}" class="card-image" alt="Carta ${cardData.id}"/>`;
});

//Inicialize o máximo de jogadas:
maxMovesElement.textContent = MAX_MOVES;

// Controlar o flip
function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("flipped");

  if (!hasFlippedCard) {
    //1ª carta virada
    hasFlippedCard = true;
    firstCard = this;
  } else {
    //2ª carta virada
    secondCard = this;
    checkForMatch();
  }
}

// Verificar pares
const checkForMatch = () => {
  const isMatch = firstCard.dataset.cardId === secondCard.dataset.cardId;
  isMatch ? disableCards() : unflipCards();
  // Incrementa jogadas APÓS verificar o par (correção)

  if (!isMatch) {
    moves++; //Incrementa nº de jogadas - somente qdo erra os pares
    movesElement.textContent = moves;
  }

  // Verifica se atingiu o limite
  if (moves >= MAX_MOVES && matchedPairs < totalPairs) {
    lockBoard = true; // Bloqueia o tabuleiro
    // Remove os eventos de clique das cartas
    card.forEach((c) => c.removeEventListener("click", flipCard));
    setTimeout(() => {
      loseMessage.classList.add("show");
    }, 800);
  }
};

// Gerenciar estado do jogo
// Ações para Pares
const disableCards = () => {
  matchedPairs++; // Incrementa a cada par correto
  if (matchedPairs === totalPairs) {
    setTimeout(() => {
      winMessage.classList.add("show");
    }, 800); //Aguarda a animação do flip terminar
  }
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
};

const unflipCards = () => {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1500);
};

//Função para resetar o board
const resetBoard = () => {
  [lockBoard, hasFlippedCard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

//Função do Botão reiniciar
const resetGame = () => {
  //Resetar estado
  matchedPairs = 0;
  lockBoard = false; //Garante que o tabuleiro está desbloqueado
  winMessage.classList.remove("show");
  loseMessage.classList.remove("show");

  //Reativar todas as cartas
  card.forEach((c) => {
    c.classList.remove("flipped");
    c.addEventListener("click", flipCard);
  });

  //Reembaralhar as cartas
  const shufflePairs = [...frontCard, ...frontCard]
    .map((c) => ({ ...c, img: c.img || "fallback.png" }))
    .sort(() => Math.random() - 0.5);
  card.forEach((cardElement, index) => {
    const cardData = shufflePairs[index];

    // Verificação de segurança
    if (!cardData) {
      console.error("Não há dados para a carta no índice:", index);
      return;
    }

    cardData.img = cardData.img || "fallback.png";

    cardElement.dataset.cardId = cardData.id;
    //Inserção da Imagem
    const cardBack = cardElement.querySelector(".card-back");
    if (cardBack) {
      cardBack.innerHTML = `<img src="${cardData.img}" class="card-image" alt="Carta ${cardData.id}"/>`;
    }
  });

  moves = 0;
  movesElement.textContent = "0";
  loseMessage.classList.remove("show");

  // Reativa os eventos de clique nas cartas
  card.forEach((c) => {
    c.addEventListener("click", flipCard);
  });
};

restartWinBtn.addEventListener("click", resetGame);
restartLoseBtn.addEventListener("click", resetGame);

card.forEach((c) => {
  c.addEventListener("click", flipCard);
});
