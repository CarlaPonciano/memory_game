document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const gameContainer = document.getElementById('gameContainer');
  const gameBoard = document.getElementById('gameBoard');
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modalImage');
  const modalText = document.getElementById('modalText');
  const modalTitle = document.getElementById('modalTitle');
  const continueButton = document.getElementById('continueButton');
  const backgroundMusic = document.getElementById('backgroundMusic');
  const audioControlButton = document.getElementById('audioControlButton');
  const congratsScreen = document.getElementById('congratsScreen');
  const restartButton = document.getElementById('restartButton');
  const rotateScreen = document.getElementById('rotateScreen');
  const confettiContainer = document.getElementById('confettiContainer');

  const cardValues = [
    { value: '1', image: 'mes_1.jpeg', description: 'O dia que você chegou para transformar as nossas vidas Aline! Já podiamos sentir felicidade e um amor inifnito no seu olhar.' },
    { value: '1', image: 'mes_1.jpeg', description: 'O dia que você chegou para transformar as nossas vidas Aline! Já podiamos sentir felicidade e um amor inifnito no seu olhar.' },
    { value: '2', image: 'mes_2.jpeg', description: 'Description for B' },
    { value: '2', image: 'mes_2.jpeg', description: 'Description for B' },
  ];
  
  let hasFlippedCard = false;
  let firstCard, secondCard;
  let lockBoard = false;
  let matchedPairs = 0;

  const checkOrientation = () => {
    if (window.innerHeight > window.innerWidth) {
      rotateScreen.style.display = 'flex';
    } else {
      rotateScreen.style.display = 'none';
    }
  };
  
  window.addEventListener('resize', checkOrientation);
  checkOrientation();

  startButton.addEventListener('click', startGame);

  function startGame() {
    gameBoard.innerHTML = '';
    document.querySelector('.start-screen').style.display = 'none';
    gameContainer.style.display = 'flex';
    audioControlButton.style.display = 'block';
    createBoard();
    backgroundMusic.volume = 0.5;
    backgroundMusic.play();
    matchedPairs = 0;
  }

  let isPlaying = true;

  audioControlButton.addEventListener('click', () => {
    if (isPlaying) {
      backgroundMusic.pause();
      audioControlButton.textContent = 'play_circle_filled';
    } else {
      backgroundMusic.play();
      audioControlButton.textContent = 'pause_circle_filled';
    }
    isPlaying = !isPlaying;
  });

  function createBoard() {
    shuffle(cardValues);
    cardValues.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.dataset.value = card.value;
      cardElement.innerHTML = `
        <div class="front"></div>
        <div class="back">
          <img src="assets/meses/${card.image}" alt="${card.value}">
        </div>`;
      cardElement.addEventListener('click', flipCard);
      gameBoard.appendChild(cardElement);
    });
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.value === secondCard.dataset.value;
    if (isMatch) {
      setTimeout(() => {
        showModal(firstCard.dataset.value);
        disableCards();
      }, 500);
      matchedPairs++;
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
  }

  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function showModal(cardValue) {
    const matchingCard = cardValues.find(card => card.value === cardValue);
    modalImage.src = `./assets/meses/${matchingCard.image}`;
    modalTitle.textContent = `${matchingCard.value}° mês`
    modalText.textContent = matchingCard.description;
    modal.style.display = 'flex';
  }

  continueButton.addEventListener('click', () => {
    modal.style.display = 'none';
    if (matchedPairs === cardValues.length / 2) {
      showCongratsScreen();
    }
  });

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function showCongratsScreen() {
    gameContainer.style.display = 'none';
    congratsScreen.style.display = 'flex';
    createConfetti();
  }

  restartButton.addEventListener('click', () => {
    congratsScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    startGame();
  });

  function createConfetti() {
    const confettiCount = 100;
    const colors = ['#ff0', '#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confettiContainer.appendChild(confetti);

      confetti.style.animationDelay = `${Math.random() * 3}s`;
    }
  }
});
