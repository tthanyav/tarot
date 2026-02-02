
// ========== AI Prediction Functions ==========

// Check if AI is available (only on Vercel, not on GitHub Pages)
const isGitHubPages = window.location.hostname.includes('github.io');
const AI_AVAILABLE = !isGitHubPages;

// API endpoint - use relative path to work with any Vercel deployment URL
const API_ENDPOINT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api/predict'  // Local development
  : '/api/predict';  // Production - relative path works for all Vercel URLs

let tarotCardsData = null;
let currentAIPrediction = null;

// Load tarot cards data
async function loadTarotData() {
  if (tarotCardsData) return tarotCardsData;

  try {
    const response = await fetch('tarot_cards.json');

    if (!response.ok) {
      throw new Error(`Failed to load tarot_cards.json: ${response.status}`);
    }

    tarotCardsData = await response.json();
    return tarotCardsData;
  } catch (error) {
    throw new Error('ไม่สามารถโหลดข้อมูลไพ่ทาโรต์ได้ กรุณาตรวจสอบว่าไฟล์ tarot_cards.json อยู่ในตำแหน่งที่ถูกต้อง');
  }
}

// Get card details from tarot_cards.json
function getCardDetails(cardId) {
  if (!tarotCardsData || !tarotCardsData.tarot_cards) return null;
  return tarotCardsData.tarot_cards.find(card => card.card_id === cardId);
}

// Scroll to AI section smoothly
function scrollToAISection() {
  const aiSection = document.getElementById('aiLoadingSection').style.display !== 'none'
    ? document.getElementById('aiLoadingSection')
    : (document.getElementById('aiPredictionSection').style.display !== 'none'
      ? document.getElementById('aiPredictionSection')
      : document.getElementById('aiErrorSection'));

  if (aiSection && aiSection.style.display !== 'none') {
    aiSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Generate AI prediction
async function getAIPrediction() {
  // Hide previous results/errors
  document.getElementById('aiPredictionSection').style.display = 'none';
  document.getElementById('aiErrorSection').style.display = 'none';

  // Show loading
  document.getElementById('aiLoadingSection').style.display = 'block';

  // Hide the AI button temporarily
  document.getElementById('aiPredictBtn').style.display = 'none';

  // Scroll to loading section
  setTimeout(() => scrollToAISection(), 100);

  try {
    // Load tarot data if not loaded
    await loadTarotData();

    if (!tarotCardsData) {
      throw new Error('Failed to load tarot card data');
    }

    // Prepare card information
    const cardsInfo = selectedCards.map(card => {
      const cardDetails = getCardDetails(card.card_id);
      if (cardDetails && cardDetails.readings) {
        return {
          name: cardDetails.card_name,
          readings: cardDetails.readings,
          isReversed: card.isReversed || false
        };
      }
      return null;
    }).filter(card => card !== null);

    // Create prompt for AI
    const prompt = createTarotPrompt(question, cardsInfo, spreadType);

    // Call serverless API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error('ไม่สามารถเชื่อมต่อกับหมอดู AI ได้ในขณะนี้');
    }

    const data = await response.json();

    if (data.prediction) {
      const prediction = data.prediction;
      currentAIPrediction = prediction;

      // Hide loading
      document.getElementById('aiLoadingSection').style.display = 'none';

      // Show prediction
      document.getElementById('aiPredictionContent').innerText = prediction;
      document.getElementById('aiPredictionSection').style.display = 'block';

      // Scroll to prediction
      setTimeout(() => scrollToAISection(), 100);

      // Keep button hidden - no need to predict again
    } else {
      throw new Error('Invalid response format');
    }

  } catch (error) {
    // Hide loading
    document.getElementById('aiLoadingSection').style.display = 'none';

    // Show error
    document.getElementById('aiErrorSection').style.display = 'block';

    // Scroll to error section
    setTimeout(() => scrollToAISection(), 100);

    // Show button again
    document.getElementById('aiPredictBtn').style.display = 'flex';
  }
}

// Create prompt for AI
function createTarotPrompt(userQuestion, cards, numCards) {
  let prompt = '';

  // Add question
  if (userQuestion && userQuestion.trim()) {
    prompt += `คำถาม: "${userQuestion}"\n\n`;
  }

  // Add cards
  prompt += `ไพ่ที่เปิดได้ ${numCards} ใบ:\n`;
  cards.forEach((card, index) => {
    const cardName = card.isReversed ? `${card.name} (กลับหัว/Reversed)` : card.name;
    prompt += `${index + 1}. ${cardName}\n`;
  });

  // Instructions for the AI - Thai fortune teller style
  prompt += `\n--- วิธีอ่านไพ่ (แบบหมอดูไทย) ---\n\n`;
  prompt += `รูปแบบการพูด:\n\n`;
  prompt += `1. เปิดหัว (1-2 ประโยค):\n`;
  prompt += `   - "จากไพ่ที่เปิดออกมา เห็นว่า..."\n`;
  prompt += `   - บอกภาพรวมและคำตอบคำถามแบบกระชับ\n\n`;
  prompt += `2. อ่านไพ่แต่ละใบ (ใช้ภาษาหมอดูไทย):\n`;
  cards.forEach((card, index) => {
    const cardDesc = card.isReversed ? `${card.name} (กลับ)` : card.name;
    prompt += `   • ไพ่ ${cardDesc}: `;
    if (card.isReversed) {
      prompt += `พูดว่า "ไพ่กลับ/หงาย" อธิบายว่าพลังลด/มีอุปสรรค หรือกำลังผ่านพ้น (ขึ้นกับไพ่)\n`;
    } else {
      prompt += `อธิบายความหมายแบบสั้นๆ เชื่อมกับชีวิตจริง\n`;
    }
  });
  prompt += `\n3. ปิดท้าย:\n`;
  prompt += `   - ให้กำลังใจหรือคำแนะนำที่ทำได้จริง\n`;
  prompt += `   - อาจใช้ "ขอให้...", "พยายาม...", "อย่าลืม..."\n`;
  prompt += `\n`;

  // Add reversed cards explanation if any card is reversed
  const hasReversed = cards.some(c => c.isReversed);
  if (hasReversed) {
    prompt += `\n**หมายเหตุ:** มีไพ่กลับหัว ต้องตีความหมายตรงกันข้ามหรือลดกำลัง\n`;
  }

  prompt += `\nตัวอย่างต้นแบบ:\n`;
  prompt += `"จากไพ่ที่เปิดออกมา เห็นว่า [ตอบคำถาม] ค่ะ\n\n`;
  prompt += `ไพ่ ${cards[0]?.name || 'แรก'}${cards[0]?.isReversed ? ' (กลับ)' : ''} ออกว่า...\n`;
  if (cards[1]) prompt += `ไพ่ ${cards[1].name}${cards[1]?.isReversed ? ' (กลับ)' : ''} บอกว่า...\n`;
  if (cards[2]) prompt += `ส่วนไพ่ ${cards[2].name}${cards[2]?.isReversed ? ' (หงาย)' : ''} เห็นว่า...\n\n`;
  prompt += `[คำแนะนำปิดท้าย]"\n\n`;
  prompt += `ความยาว: 150-200 คำ | ภาษาหมอดูไทย ไม่เป็นทางการจนเกิน`;

  return prompt;
}

// Retry AI prediction
function retryAIPrediction() {
  document.getElementById('aiErrorSection').style.display = 'none';
  getAIPrediction();
}

// Show/hide AI button based on question and platform availability
function updateAIButtonVisibility() {
  const aiBtn = document.getElementById('aiPredictBtn');

  // Hide AI button on GitHub Pages (no serverless function support)
  if (!AI_AVAILABLE) {
    aiBtn.style.display = 'none';
    return;
  }

  // Show button only if question is entered
  if (question && question.trim()) {
    aiBtn.style.display = 'flex';
  } else {
    aiBtn.style.display = 'none';
  }
}
