const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
let wpm = 0;
let totalCharacters = 0;
let correctCharacters = 0;
let cpm = 0;
let startTime;
let quoteIndex = 0;
let currentQuote = [];

quoteInputElement.addEventListener('input', () => {
  console.log('Characters typed is>>>>>', totalCharacters);
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');
  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    console.log('IN FOREACH');

    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
      correctCharacters++;
    } else {
      characterSpan.classList.add('incorrect');
      characterSpan.classList.remove('correct');
      correct = false;
      correctCharacters--;
    }
  });

  cpm =
    correctCharacters > 5
      ? Math.floor((correctCharacters / getTimerTime()) * 60)
      : 0;

  wpm = Math.round(cpm / 5);

  console.log('QUOTE INDEX>?>>', quoteIndex);

  if (correct) renderNewQuote();
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

quoteInputElement.addEventListener('keydown', function (e) {
  console.log('ARRAY QUOTE INDEX>>>', currentQuote[quoteIndex]);
  /*
   * keyCode: 8
   * keyIdentifier: "U+0008"
   */
  console.log('EVent>>', e);
  if (e.key === 'Backspace') {
    console.log('Backpressed');
    totalCharacters--;
    quoteIndex--;
  } else {
    totalCharacters++;
    if (currentQuote[quoteIndex] === e.key) {
      quoteIndex++;
    }
  }
});

async function getNextQuote() {
  const quote = await getRandomQuote();
  console.log(quote);
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  currentQuote = quote.split('');
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach((character) => {
    const charaterSpan = document.createElement('span');
    charaterSpan.innerText = character;
    quoteDisplayElement.appendChild(charaterSpan);
  });
  quoteInputElement.value = null;
  startTimer();
}

function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  setInterval(() => {
    timer.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

renderNewQuote();
