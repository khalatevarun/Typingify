const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function getNextQuote() {
  const quote = await getRandomQuote();
  console.log(quote);
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerText = quote;
  quote.split('').forEach((character) => {
    const charaterSpan = document.createElement('span');
    charaterSpan.classList.add('correct');
    charaterSpan.innerText = character;
    quoteDisplayElement.appendChild(charaterSpan);
  });
  quoteInputElement.value = null;
}
renderNewQuote();
