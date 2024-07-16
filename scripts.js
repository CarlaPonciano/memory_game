document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const gameContainer = document.getElementById('gameContainer');
  const gameBoard = document.getElementById('gameBoard');
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modalImage');
  const modalText = document.getElementById('modalText');
  const continueButton = document.getElementById('continueButton');
  const backgroundMusic = document.getElementById('backgroundMusic');
  const audioControlButton = document.getElementById('audioControlButton');
  const cardValues = [
    { value: 'A', image: 'mes_1.jpeg', description: 'Description for A' },
    { value: 'A', image: 'mes_1.jpeg', description: 'Description for A' },
    { value: 'B', image: 'mes_2.jpeg', description: 'Description for B' },
    { value: 'B', image: 'mes_2.jpeg', description: 'Description for B' },
    { value: 'C', image: 'mes_3.jpeg', description: 'Description for C' },
    { value: 'C', image: 'mes_3.jpeg', description: 'Description for C' },
    { value: 'D', image: 'mes_4.jpeg', description: 'Description for D' },
    { value: 'D', image: 'mes_4.jpeg', description: 'Description for D' },
    { value: 'E', image: 'mes_5.jpeg', description: 'Description for E' },
    { value: 'E', image: 'mes_5.jpeg', description: 'Description for E' },
    { value: 'F', image: 'mes_6.jpeg', description: 'Description for F' },
    { value: 'F', image: 'mes_6.jpeg', description: 'Description for F' },
    { value: 'G', image: 'mes_7.jpeg', description: 'Description for G' },
    { value: 'G', image: 'mes_7.jpeg', description: 'Description for G' },
    { value: 'H', image: 'mes_8.jpeg', description: 'Description for H' },
    { value: 'H', image: 'mes_8.jpeg', description: 'Description for H' },
    { value: 'I', image: 'mes_9.jpeg', description: 'Description for I' },
    { value: 'I', image: 'mes_9.jpeg', description: 'Description for I' },
    { value: 'J', image: 'mes_10.jpeg', description: 'Description for J' },
    { value: 'J', image: 'mes_10.jpeg', description: 'Description for J' },
    { value: 'K', image: 'mes_11.jpeg', description: 'Description for K' },
    { value: 'K', image: 'mes_11.jpeg', description: 'Description for K' },
    { value: 'L', image: 'mes_12.jpeg', description: 'Description for L' },
    { value: 'L', image: 'mes_12.jpeg', description: 'Description for L' },
  ];
  let hasFlippedCard = false;
  let firstCard, secondCard;
  let lockBoard = false;

    // Function to check orientation
    const checkOrientation = () => {
      if (window.innerHeight > window.innerWidth) {
        rotateScreen.style.display = 'flex';
      } else {
        rotateScreen.style.display = 'none';
      }
    };
  
    // Add event listener for orientation change
    window.addEventListener('resize', checkOrientation);
    checkOrientation(); // Initial check

  startButton.addEventListener('click', startGame);

  function startGame() {
    document.querySelector('.start-screen').style.display = 'none';
    gameContainer.style.display = 'flex';
    audioControlButton.style.display = 'block';
    createBoard();
    backgroundMusic.volume = 0.5;
    backgroundMusic.play();
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
    isMatch ? handleMatch() : unflipCards();
  }

  function handleMatch() {
    setTimeout(() => {
      showModal(firstCard.dataset.value);
      disableCards();
    }, 500);
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
    modalText.textContent = matchingCard.description;
    modal.style.display = 'flex';
  }

  continueButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
});
