// Cosmic Timeline - History View

let timelineActive = false;

// Toggle cosmic timeline view
function toggleCosmicTimeline() {
  timelineActive = !timelineActive;

  const cosmicView = document.getElementById('cosmicTimeline');
  const mainContent = document.querySelector('.container');

  if (timelineActive) {
    // Show cosmic timeline
    cosmicView.classList.add('active');
    mainContent.style.display = 'none';
    document.body.style.overflow = 'hidden';

    // Load and display history
    loadCosmicHistory();

    // Start star animation
    createStarfield();

    // Initialize 3D scroll effects
    setTimeout(() => init3DScrollEffects(), 100);
  } else {
    // Hide cosmic timeline
    cosmicView.classList.remove('active');
    mainContent.style.display = 'flex';
    document.body.style.overflow = 'auto';
  }
}

// Create animated starfield
function createStarfield() {
  const starfield = document.querySelector('.starfield');
  if (!starfield) return;

  starfield.innerHTML = '';

  // Create stars
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (Math.random() * 2 + 2) + 's';
    starfield.appendChild(star);
  }

  // Create shooting stars occasionally
  setInterval(() => {
    if (timelineActive && Math.random() > 0.7) {
      createShootingStar();
    }
  }, 3000);
}

// Create shooting star effect
function createShootingStar() {
  const starfield = document.querySelector('.starfield');
  if (!starfield) return;

  const shootingStar = document.createElement('div');
  shootingStar.className = 'shooting-star';
  shootingStar.style.left = Math.random() * 100 + '%';
  shootingStar.style.top = Math.random() * 50 + '%';
  starfield.appendChild(shootingStar);

  setTimeout(() => shootingStar.remove(), 2000);
}

// Apply fan or stack layout based on visibility
function applyCardLayout(container, isCentered) {
  const cards = container.querySelectorAll('.cosmic-mini-card, .cosmic-more');
  const totalCards = cards.length;

  if (totalCards === 0) return;

  const middleIndex = (totalCards - 1) / 2;

  cards.forEach((card, index) => {
    if (isCentered) {
      // Fan layout when centered
      const maxRotation = 25;
      const cardSpacing = 40;
      const rotation = (index - middleIndex) * (maxRotation / Math.max(middleIndex, 1));
      const xOffset = (index - middleIndex) * cardSpacing;
      const yOffset = Math.abs(index - middleIndex) * 15;
      const zIndex = 50 - Math.abs(index - middleIndex) * 5;

      card.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg)`;
      card.style.zIndex = zIndex;
    } else {
      // Stack layout when not centered
      const stackOffset = index * 3;
      const zIndex = index;

      card.style.transform = `translateX(${stackOffset}px) translateY(0px) rotate(0deg)`;
      card.style.zIndex = zIndex;
    }
  });
}

// Update all card layouts based on scroll position
function updateCardLayouts() {
  const scrollContainer = document.querySelector('.cosmic-timeline-scroll');
  if (!scrollContainer) return;

  const readingCards = document.querySelectorAll('.cosmic-reading-card');
  const containerRect = scrollContainer.getBoundingClientRect();
  const centerY = containerRect.top + containerRect.height / 2;

  readingCards.forEach(readingCard => {
    const cardContainer = readingCard.querySelector('.reading-cards');
    if (!cardContainer) return;

    const cardRect = readingCard.getBoundingClientRect();
    const cardCenterY = cardRect.top + cardRect.height / 2;
    const distance = Math.abs(centerY - cardCenterY);
    const threshold = 200; // Distance threshold for being "centered"

    const isCentered = distance < threshold;
    applyCardLayout(cardContainer, isCentered);
  });
}

// Load and display cosmic history
function loadCosmicHistory() {
  const history = getReadingHistory();
  const timeline = document.getElementById('cosmicTimelineContent');

  if (history.length === 0) {
    timeline.innerHTML = `
      <div class="cosmic-empty">
        <div class="cosmic-icon">✨</div>
        <h2>ยังไม่มีประวัติการจับไพ่</h2>
        <p>เริ่มต้นเส้นทางดวงดาวของคุณกันเถอะ</p>
      </div>
    `;
    return;
  }

  // Group by date
  const grouped = groupByDate(history);

  timeline.innerHTML = Object.keys(grouped).map((dateKey, groupIndex) => {
    const readings = grouped[dateKey];
    const dateLabel = formatCosmicDate(new Date(readings[0].timestamp));

    return `
      <div class="cosmic-date-group" style="animation-delay: ${groupIndex * 0.1}s">
        <div class="cosmic-date-marker">
          <div class="cosmic-orb"></div>
          <div class="date-label">${dateLabel}</div>
        </div>

        <div class="cosmic-readings">
          ${readings.map((reading, index) => {
            const time = new Date(reading.timestamp).toLocaleTimeString('th-TH', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return `
              <div class="cosmic-reading-card"
                   onclick="viewCosmicReading(${reading.id})"
                   style="animation-delay: ${(groupIndex * 0.1) + (index * 0.05)}s">
                <div class="cosmic-card-glow"></div>
                <div class="reading-time">${time}</div>
                <div class="reading-question">${reading.question || 'คำทำนายทั่วไป'}</div>
                <div class="reading-cards">
                  ${reading.cards.slice(0, 3).map(card => `
                    <div class="cosmic-mini-card${card.isReversed ? ' reversed' : ''}">
                      <img src="${card.image}" alt="${card.card_name}">
                      <div class="card-shimmer"></div>
                    </div>
                  `).join('')}
                  ${reading.cards.length > 3 ? `
                    <div class="cosmic-more">+${reading.cards.length - 3}</div>
                  ` : ''}
                </div>
                <div class="reading-arrow">→</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Apply initial layout and setup scroll listener
  setTimeout(() => {
    updateCardLayouts();

    const scrollContainer = document.querySelector('.cosmic-timeline-scroll');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateCardLayouts);
    }
  }, 100);
}

// Group readings by date
function groupByDate(history) {
  const grouped = {};

  history.forEach(reading => {
    const date = new Date(reading.timestamp);
    const dateKey = date.toDateString();

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(reading);
  });

  return grouped;
}

// Format date for cosmic theme
function formatCosmicDate(date) {
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return '✦ วันนี้ ✦';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '✧ เมื่อวาน ✧';
  } else {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  }
}

// View a reading from cosmic timeline
function viewCosmicReading(readingId) {
  // Close cosmic timeline
  toggleCosmicTimeline();

  // View the reading
  setTimeout(() => {
    viewHistoryReading(readingId);
  }, 500);
}

// Close cosmic timeline
function closeCosmicTimeline() {
  if (timelineActive) {
    toggleCosmicTimeline();
  }
}

// 3D Scroll Effects
function init3DScrollEffects() {
  const scrollContainer = document.querySelector('.cosmic-timeline-scroll');
  if (!scrollContainer) return;

  scrollContainer.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.cosmic-reading-card');
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;
    const centerY = scrollTop + clientHeight / 2;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardTop = scrollTop + rect.top;
      const cardCenter = cardTop + rect.height / 2;
      const distance = Math.abs(centerY - cardCenter);
      const maxDistance = clientHeight / 2;
      const normalizedDistance = Math.min(distance / maxDistance, 1);

      // 3D Transform based on distance from center
      const rotateX = (normalizedDistance - 0.5) * 8; // Tilt effect
      const scale = 1 - normalizedDistance * 0.15; // Scale effect
      const opacity = 1 - normalizedDistance * 0.3; // Fade effect
      const translateZ = -normalizedDistance * 50; // Depth effect

      card.style.transform = `translateZ(${translateZ}px) scale(${scale}) rotateX(${rotateX}deg)`;
      card.style.opacity = opacity;
    });
  });

  // Trigger initial calculation
  scrollContainer.dispatchEvent(new Event('scroll'));
}
