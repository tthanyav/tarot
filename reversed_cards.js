// Reversed Cards Feature

// Global variable to track if reversed cards are enabled
let reversedCardsEnabled = false;

// Load saved setting from localStorage
function loadReversedSetting() {
  const saved = localStorage.getItem('reversedCardsEnabled');
  reversedCardsEnabled = saved === 'true';

  const toggle = document.getElementById('reversedToggle');
  if (toggle) {
    toggle.checked = reversedCardsEnabled;
  }
}

// Toggle reversed cards setting
function toggleReversedCards() {
  const toggle = document.getElementById('reversedToggle');
  reversedCardsEnabled = toggle.checked;

  // Save to localStorage
  localStorage.setItem('reversedCardsEnabled', reversedCardsEnabled);

  console.log('Reversed cards:', reversedCardsEnabled ? 'Enabled' : 'Disabled');
}

// Determine if a card should be reversed (40% chance if enabled)
function shouldCardBeReversed() {
  if (!reversedCardsEnabled) return false;
  return Math.random() < 0.4; // 40% chance
}

// Apply reversed status to selected cards
function applyReversedStatus(cards) {
  if (!reversedCardsEnabled) {
    // All cards normal
    return cards.map(card => ({ ...card, isReversed: false }));
  }

  // Randomly reverse some cards
  return cards.map(card => ({
    ...card,
    isReversed: shouldCardBeReversed()
  }));
}

// Get card name with reversed indicator
function getCardDisplayName(cardName, isReversed) {
  return isReversed ? `${cardName} (Reversed)` : cardName;
}

// Load setting when page loads
window.addEventListener('DOMContentLoaded', () => {
  loadReversedSetting();
});
