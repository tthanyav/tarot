
// ========== AI Prediction Functions ==========

const OPENAI_API_KEY = "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";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

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
          readings: cardDetails.readings
        };
      }
      return null;
    }).filter(card => card !== null);

    // Create prompt for AI
    const prompt = createTarotPrompt(question, cardsInfo, spreadType);

    // Call OpenAI API
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "หมอดูไพ่ทาโรต์มืออาชีพ ให้คำทำนายภาษาไทยกระชับ อบอุ่น"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error('ไม่สามารถเชื่อมต่อกับหมอดู AI ได้ในขณะนี้');
    }

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const prediction = data.choices[0].message.content;
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
  let prompt = userQuestion && userQuestion.trim()
    ? `คำถาม: "${userQuestion}"\n\n`
    : `คำทำนายทั่วไป\n\n`;

  prompt += `ไพ่ ${numCards} ใบ:\n`;

  cards.forEach((card, index) => {
    prompt += `${index + 1}. ${card.name}\n`;
    if (card.readings) {
      // ใช้แค่ความหมายที่เกี่ยวข้องกับคำถาม หรือความหมายหลัก
      const reading = card.readings.card_of_the_day ||
                     card.readings.love ||
                     card.readings.work ||
                     card.readings.finance;
      if (reading) {
        // ตัดข้อความที่ยาวเกินไป เหลือแค่ 150 ตัวอักษรแรก
        const shortReading = reading.length > 150 ? reading.substring(0, 150) + '...' : reading;
        prompt += `   ${shortReading}\n`;
      }
    }
    prompt += `\n`;
  });

  prompt += `\nทำนายภาษาไทย 200-250 คำ เชื่อมโยงคำถาม อธิบายไพ่ ให้คำแนะนำเชิงบวก`;

  return prompt;
}

// Retry AI prediction
function retryAIPrediction() {
  document.getElementById('aiErrorSection').style.display = 'none';
  getAIPrediction();
}

// Show/hide AI button based on question
function updateAIButtonVisibility() {
  const aiBtn = document.getElementById('aiPredictBtn');
  if (question && question.trim()) {
    aiBtn.style.display = 'flex';
  } else {
    aiBtn.style.display = 'none';
  }
}
