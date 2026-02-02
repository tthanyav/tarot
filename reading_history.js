// Reading History Management (Simplified for Cosmic Timeline)

const MAX_HISTORY = 50;

function getReadingHistory() {
  try {
    const history = localStorage.getItem('tarotReadingHistory');
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error('Error loading history:', e);
    return [];
  }
}

function saveReadingToHistory(reading) {
  try {
    const history = getReadingHistory();

    const newReading = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      question: reading.question || 'คำทำนายทั่วไป',
      spreadType: reading.spreadType,
      cards: reading.cards.map(card => ({
        card_id: card.card_id,
        card_name: card.card_name,
        image: card.image,
        isReversed: card.isReversed || false
      })),
      aiPrediction: reading.aiPrediction || null
    };

    history.unshift(newReading);

    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY);
    }

    localStorage.setItem('tarotReadingHistory', JSON.stringify(history));
    return newReading.id;
  } catch (e) {
    console.error('Error saving history:', e);
    return null;
  }
}

function loadReadingFromHistory(readingId) {
  const history = getReadingHistory();
  return history.find(r => r.id === readingId);
}

function viewHistoryReading(readingId) {
  const reading = loadReadingFromHistory(readingId);
  if (!reading) return;

  question = reading.question === 'คำทำนายทั่วไป' ? '' : reading.question;
  spreadType = reading.spreadType;
  selectedCards = reading.cards;
  currentAIPrediction = reading.aiPrediction;

  goToStep4FromHistory();
}

function goToStep4FromHistory() {
  document.getElementById('step1').classList.remove('active');
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step3').classList.remove('active');
  document.getElementById('step4').classList.add('active');

  const resultQuestion = document.getElementById('questionDisplayResult');
  if (question) {
    resultQuestion.textContent = '"' + question + '"';
    resultQuestion.style.display = 'block';
  } else {
    resultQuestion.textContent = '';
    resultQuestion.style.display = 'none';
  }

  const container = document.getElementById('resultCards');
  container.innerHTML = '';
  container.className = 'result-cards layout-' + spreadType;

  revealWrappers = [];

  if (spreadType === 1) renderLayout1(container);
  else if (spreadType === 2) renderLayout2(container);
  else if (spreadType === 3) renderLayout3(container);
  else if (spreadType === 4) renderLayout4(container);
  else if (spreadType === 10) renderLayout10(container);
  else if (spreadType === 12) renderLayout12(container);

  revealWrappers.forEach(item => {
    item.wrapper.classList.add('revealed');
  });

  if (currentAIPrediction) {
    document.getElementById('aiPredictionContent').innerText = currentAIPrediction;
    document.getElementById('aiPredictionSection').style.display = 'block';
    document.getElementById('aiPredictBtn').style.display = 'none';
  } else {
    document.getElementById('aiPredictionSection').style.display = 'none';
    if (typeof updateAIButtonVisibility === 'function') {
      updateAIButtonVisibility();
    }
  }
}
