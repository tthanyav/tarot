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

function updateReadingAIPrediction(readingId, aiPrediction) {
  try {
    const history = getReadingHistory();
    const reading = history.find(r => r.id === readingId);

    if (reading) {
      reading.aiPrediction = aiPrediction;
      localStorage.setItem('tarotReadingHistory', JSON.stringify(history));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error updating AI prediction:', e);
    return false;
  }
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

function clearHistory() {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประวัติการจับไพ่ทั้งหมด?')) {
    localStorage.removeItem('tarotReadingHistory');
    if (typeof loadCosmicHistory === 'function') {
      loadCosmicHistory();
    }
  }
}

function mockupHistory() {
  const questions = [
    'เรื่องความรักของฉันจะเป็นอย่างไร',
    'การงานในปีนี้จะเป็นอย่างไร',
    'ฉันควรเปลี่ยนงานหรือไม่',
    'คนที่ฉันชอบคิดอย่างไรกับฉัน',
    'การเงินของฉันในอนาคตจะดีขึ้นไหม',
    'ฉันจะได้เจอคนที่ใช่เมื่อไหร่',
    'โอกาสในการเลื่อนตำแหน่งมีไหม',
    'ครอบครัวของฉันจะมีความสุขไหม',
    'ฉันควรลงทุนตอนนี้หรือไม่',
    'สุขภาพของฉันเป็นอย่างไร',
    'มิตรภาพของฉันจะยืนยาวไหม',
    'ฉันควรศึกษาต่อหรือทำงาน',
    'คำทำนายทั่วไป',
    'อนาคตของฉันจะเป็นอย่างไร',
    'ฉันกำลังเดินในเส้นทางที่ถูกต้องไหม'
  ];

  const spreadTypes = [1, 2, 3, 4, 10, 12];
  const history = getReadingHistory();

  // Create 30 mock readings
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);

    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

    const spread = spreadTypes[Math.floor(Math.random() * spreadTypes.length)];
    const mockCards = [];

    for (let j = 0; j < spread; j++) {
      const cardNum = Math.floor(Math.random() * 78);
      const cardIdStr = `Card_Tarot_${cardNum.toString().padStart(2, '0')}`;
      mockCards.push({
        card_id: cardIdStr,
        card_name: `Tarot Card ${cardNum}`,
        image: `images/${cardIdStr}.png`,
        isReversed: Math.random() > 0.6
      });
    }

    const reading = {
      id: Date.now() - i * 1000,
      timestamp: timestamp.toISOString(),
      question: questions[Math.floor(Math.random() * questions.length)],
      spreadType: spread,
      cards: mockCards,
      aiPrediction: Math.random() > 0.5 ? 'คำทำนายจำลองสำหรับการทดสอบ UI การจับไพ่รอบนี้แสดงให้เห็นถึงพลังงานที่ดีและโอกาสที่กำลังจะมาถึง' : null
    };

    history.unshift(reading);
  }

  localStorage.setItem('tarotReadingHistory', JSON.stringify(history));

  if (typeof loadCosmicHistory === 'function') {
    loadCosmicHistory();
  }

  alert('สร้าง Mock Data 30 รายการเรียบร้อย!');
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
