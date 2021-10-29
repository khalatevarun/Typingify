const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const cpmElement = document.getElementById('cpm');
const errorsElement = document.getElementById('errors');
const accuracyElement = document.getElementById('accuracy');
const totalwordsElement = document.getElementById('totalwords');
const tableElement = document.getElementById('stats-list');

let wpm = 0;
let totalCharacters = 0;
let correctCharacters = 0;
let cpm = 0;
let startTime;
let duration = 0;
let quoteIndex = 0;
let currentQuote = [];
let errors = 0;
let mode = 1;
let totalWords = 0;
let accuracy = 0;

quoteInputElement.addEventListener('input', (e) => {
  console.log('Characters typed is>>>>>', totalCharacters);
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');
  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.add('incorrect');
      characterSpan.classList.remove('correct');
      correct = false;
    }
  });

  totalCharacters++;
  console.log('KEY PRSSED>>', e);
  if (currentQuote[quoteIndex] === e.data) {
    correctCharacters++;
    quoteIndex++;
  } else {
    quoteInputElement.value = quoteInputElement.value.slice(0, -1);
    errors++;
  }

  cpm =
    correctCharacters > 5
      ? Math.floor((correctCharacters / getTimerTime()) * 60)
      : 0;

  wpm = Math.round(cpm / 5);
  totalWords = Math.floor(correctCharacters / 5);
  accuracy =
    Math.round(
      ((correctCharacters / totalCharacters) * 100 + Number.EPSILON) * 100
    ) / 100;

  console.log('WPM>>>', wpm);
  wpmElement.innerText = wpm;
  cpmElement.innerText = cpm;
  errorsElement.innerText = errors;
  accuracyElement.innerText = `${
    Math.round(
      ((correctCharacters / totalCharacters) * 100 + Number.EPSILON) * 100
    ) / 100
  }%`;
  totalwordsElement.innerText = Math.floor(correctCharacters / 5);
  console.log('CPM>>>', cpm);
  console.log('Correct characters', correctCharacters);
  console.log('Current time>>>', getTimerTime());

  if (correct) renderNewQuote();
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

quoteInputElement.addEventListener('keydown', function (e) {
  /*
   * keyCode: 8
   * keyIdentifier: "U+0008"
   */

  if (e.key === 'Backspace') {
    e.preventDefault();
  }
  if (e.key === 'Enter') {
    stopTest();
  }
  if (e.key === 'Escape') {
    restartTest();
  }
  console.log('key pressed>>>', e);
});

function stopTest() {
  // stop only if one minute is passed else show alert
  //first add the current stats to an array of objects to display it later in the stats
  // reset everything to 0 and show on the website
  if (duration > 1) {
    tableElement.innerHTML +=
      `<tr>
    <td>` +
      cpm +
      `</td>
    <td>` +
      wpm +
      `</td>
    <td>` +
      accuracy +
      `</td>
    <td>` +
      errors +
      `</td>
    <td>` +
      totalWords +
      `</td>
    <td>` +
      duration +
      `</td>
  </tr>`;

    wpm = 0;
    cpm = 0;
    duration = 0;
    words = 0;
    errors = 0;
    accuracy = 0;
    timerElement.innerText = 0;
    wpmElement.innerText = 0;
    cpmElement.innerText = 0;
    errorsElement.innerText = 0;
    accuracyElement.innerText = 0;
    totalwordsElement.innerText = 0;
  } else {
    alert(
      'You need to atleast type for a duaration of 1min (60 seconds) in order to record the current score. Press escape to exit.'
    );
  }
}

function restartTest() {
  // reset everything to 0 and do not add these stats to the records
}

async function getNextQuote() {
  const quote = await getRandomQuote();
  console.log(quote);
}

async function renderNewQuote() {
  quoteIndex = 0;
  let quote = await getRandomQuote();
  currentQuote = quote.split('');
  quoteDisplayElement.innerHTML = '';
  if (mode === 1) {
    quote = quote.toLowerCase().replace(/[^\w\s]/gi, '');
    currentQuote = quote.split('');
  }
  quote.split('').forEach((character) => {
    const charaterSpan = document.createElement('span');
    charaterSpan.innerText = character;
    quoteDisplayElement.appendChild(charaterSpan);
  });
  quoteInputElement.value = null;
}

function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  setInterval(() => {
    timer.innerText = `${getTimerTime()}s`;
  }, 1000);
}

function getTimerTime() {
  duration = Math.floor((new Date() - startTime) / 1000);
  return duration;
}
startTimer();
renderNewQuote();
