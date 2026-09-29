/**
 * PAI CLASS — Animated Landing Page Engine
 * Interactive Simulators, 3D Tilt, Bilingual Chat, and Slide Deck Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroTilt();
  initPortalSwitcher();
  initSwipeAttendanceSim();
  initBilingualChatSim();
  initDeckGallery();
  initScrollAnimations();
  initMetricCounters();
  initMobileMenu();
});

/* ==========================================================================
   1. HERO 3D PERSPECTIVE TILT
   ========================================================================== */
function initHeroTilt() {
  const card = document.getElementById('heroMockupCard');
  if (!card) return;

  const stage = card.parentElement;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7; // max 7 deg
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  stage.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* ==========================================================================
   2. TRI-PORTAL EXPERIENCE SWITCHER
   ========================================================================== */
function initPortalSwitcher() {
  const tabBtns = document.querySelectorAll('.portal-tab-btn');
  const panels = document.querySelectorAll('.portal-showcase-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRole = btn.dataset.role;

      // Update active tab button
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active showcase panel
      panels.forEach(panel => {
        if (panel.id === `panel-${targetRole}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================================
   3. SMART SWIPE ATTENDANCE SIMULATOR
   ========================================================================== */
const studentRoster = [
  { id: 1, name: 'Adnan Shah', roll: '26-ST-021', dept: 'CS · Semester 4', initial: 'A' },
  { id: 2, name: 'Eman Sheikh', roll: '26-ST-022', dept: 'CS · Semester 4', initial: 'E' },
  { id: 3, name: 'Zaid Akram', roll: '26-ST-023', dept: 'CS · Semester 4', initial: 'Z' },
  { id: 4, name: 'Sanam Ammar', roll: '26-ST-024', dept: 'CS · Semester 4', initial: 'S' },
  { id: 5, name: 'Karan Faheem', roll: '26-ST-025', dept: 'CS · Semester 4', initial: 'K' }
];

let currentStudentIndex = 0;
let presentCount = 0;
let absentCount = 0;

function initSwipeAttendanceSim() {
  renderCurrentStudentCard();
  updateAttendanceGauge();

  const btnPresent = document.getElementById('btnSwipePresent');
  const btnAbsent = document.getElementById('btnSwipeAbsent');
  const btnReset = document.getElementById('btnResetAttendance');

  if (btnPresent) {
    btnPresent.addEventListener('click', () => handleSwipe('present'));
  }
  if (btnAbsent) {
    btnAbsent.addEventListener('click', () => handleSwipe('absent'));
  }
  if (btnReset) {
    btnReset.addEventListener('click', resetAttendance);
  }
}

function handleSwipe(action) {
  if (currentStudentIndex >= studentRoster.length) return;

  const card = document.getElementById('activeStudentCard');
  if (!card) return;

  if (action === 'present') {
    presentCount++;
    card.style.transform = 'translateX(140px) rotate(12deg)';
    card.style.borderColor = '#10B981';
    card.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.4)';
  } else {
    absentCount++;
    card.style.transform = 'translateX(-140px) rotate(-12deg)';
    card.style.borderColor = '#F43F5E';
    card.style.boxShadow = '0 0 30px rgba(244, 63, 94, 0.4)';
  }

  card.style.opacity = '0';

  setTimeout(() => {
    currentStudentIndex++;
    renderCurrentStudentCard();
    updateAttendanceGauge();
  }, 280);
}

function renderCurrentStudentCard() {
  const stack = document.getElementById('simCardStack');
  if (!stack) return;

  if (currentStudentIndex >= studentRoster.length) {
    stack.innerHTML = `
      <div style="text-align:center;padding:36px 16px;background:#F8FAFC;border-radius:16px;border:1px dashed #CBD5E1">
        <div style="font-size:2rem;margin-bottom:8px">🎉</div>
        <div style="font-weight:800;font-size:1.1rem;color:#0F172A">Roster Completed!</div>
        <p style="font-size:0.875rem;color:#64748B;margin-top:4px">All students recorded in real time. Draft state locked.</p>
        <button id="btnResetAttendance" class="btn btn-secondary btn-sm" style="margin-top:16px">↺ Mark Another Class</button>
      </div>
    `;
    const newReset = document.getElementById('btnResetAttendance');
    if (newReset) newReset.addEventListener('click', resetAttendance);
    return;
  }

  const s = studentRoster[currentStudentIndex];
  stack.innerHTML = `
    <div class="swipe-student-card" id="activeStudentCard">
      <div style="display:flex;align-items:center;gap:14px">
        <div class="swipe-student-avatar">${s.initial}</div>
        <div>
          <div style="font-weight:800;font-size:1.05rem;color:#0F172A">${s.name}</div>
          <div style="font-size:0.75rem;color:#64748B;font-family:var(--font-mono)">${s.roll} · ${s.dept}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;background:#F8FAFC;padding:8px 12px;border-radius:10px;margin-top:12px">
        <span style="font-size:0.75rem;color:#64748B;font-weight:600">Student ${currentStudentIndex + 1} of ${studentRoster.length}</span>
        <span style="font-size:0.75rem;color:#10B981;font-weight:700">Swipe Right: Present</span>
      </div>
    </div>
  `;
}

function updateAttendanceGauge() {
  const totalMarked = presentCount + absentCount;
  const percentage = totalMarked === 0 ? 100 : Math.round((presentCount / totalMarked) * 100);

  const textEl = document.getElementById('simGaugeText');
  const barEl = document.getElementById('simGaugeBar');
  const statsEl = document.getElementById('simAttendanceStats');
  const alertEl = document.getElementById('simAttendanceAlert');

  if (textEl) textEl.textContent = `${percentage}%`;

  if (barEl) {
    // Circumference of 2 * pi * 24 = ~150.8
    const circumference = 150.8;
    const offset = circumference - (percentage / 100) * circumference;
    barEl.style.strokeDasharray = `${circumference}`;
    barEl.style.strokeDashoffset = `${offset}`;

    if (percentage >= 75) {
      barEl.style.stroke = '#10B981'; // Emerald
    } else if (percentage >= 60) {
      barEl.style.stroke = '#F59E0B'; // Amber
    } else {
      barEl.style.stroke = '#F43F5E'; // Coral
    }
  }

  if (statsEl) {
    statsEl.innerHTML = `
      <span style="color:#10B981;font-weight:700">✓ ${presentCount} Present</span> · 
      <span style="color:#F43F5E;font-weight:700">✗ ${absentCount} Absent</span>
    `;
  }

  if (alertEl) {
    if (percentage < 75 && totalMarked > 0) {
      alertEl.style.display = 'block';
      alertEl.innerHTML = `⚠️ <strong>Low Attendance Warning Triggered</strong> (< 75%). Automated notice drafted for absent students.`;
    } else {
      alertEl.style.display = 'none';
    }
  }
}

function resetAttendance() {
  currentStudentIndex = 0;
  presentCount = 0;
  absentCount = 0;
  renderCurrentStudentCard();
  updateAttendanceGauge();
}

/* ==========================================================================
   4. BILINGUAL RAG AI TUTOR DEMO
   ========================================================================== */
const aiKnowledgeBase = {
  trees: {
    user: "Can you explain Binary Search Trees from our lecture?",
    ai: "Based strictly on <strong>Lecture 4: Data Structures & Trees</strong> (Slides 12–16), a Binary Search Tree (BST) is a node-based tree data structure where each node satisfies the BST property: the left subtree contains only keys less than the node's key, and the right subtree contains only keys greater. In a balanced BST, search, insert, and delete operations take <code>O(log n)</code> time.",
    citation: "Lecture 4, Slide 14 · CS101",
    confidence: "99.8% Grounded"
  },
  urdu: {
    user: "کیا آپ الگورتھم کی وضاحت کر سکتے ہیں؟",
    ai: "استاد کی اپ لوڈ کردہ <strong>سلائیڈز ۲ (الگورتھم کی بنیادیں)</strong> کے مطابق، الگورتھم کسی بھی مسئلے کو حل کرنے کے لیے مرحلہ وار منظم ہدایات کا مجموعہ ہے۔ یہ ان پٹ لیتا ہے، مخصوص منطق کے تحت عمل کرتا ہے اور متوقع آؤٹ پٹ پیدا کرتا ہے۔",
    citation: "لیکچر ۲، سلائیڈ ۸ · تعارف الگورتھم",
    confidence: "99.4% Grounded"
  },
  copilot: {
    user: "What is my attendance percentage and upcoming homework deadline?",
    ai: "Hello Muhammad! Your overall campus attendance is <strong>100%</strong> (3/3 sessions attended). Your next deadline is <strong>Assignment 2: Operating Systems Memory Management</strong> due this Sunday at 11:59 PM.",
    citation: "Student Academic Record · Live Sync",
    confidence: "100% Live DB"
  },
  quiz: {
    user: "Generate 2 practice quiz questions from today's slides.",
    ai: "<strong>Question 1 (MCQ):</strong> What is the average time complexity of searching an element in a balanced Binary Search Tree?<br>A) O(1) &nbsp; B) O(log n) &nbsp; C) O(n) &nbsp; D) O(n²)<br><em>Correct Answer: B</em><br><br><strong>Question 2 (True/False):</strong> Poppler pdftotext extracts page boundaries natively from course PDFs.<br><em>Correct Answer: True</em>",
    citation: "Auto-Generated via Mistral RAG · Lecture 4",
    confidence: "100% Slide Verifiable"
  }
};

function initBilingualChatSim() {
  const chips = document.querySelectorAll('.chat-prompt-chip');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('btnChatSend');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.dataset.queryKey;
      if (aiKnowledgeBase[key]) {
        triggerChatMessage(aiKnowledgeBase[key]);
      }
    });
  });

  if (sendBtn && input) {
    sendBtn.addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) return;

      const customMsg = {
        user: val,
        ai: `I have searched the course lecture repository. Based on the uploaded syllabus documents, "${val}" is covered in Chapter 3. All answers are strictly grounded in your instructor's slides with zero external hallucination.`,
        citation: "Lecture Slide Grounded · Strict Fence",
        confidence: "99.2% Grounded"
      };

      triggerChatMessage(customMsg);
      input.value = '';
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });
  }
}

function triggerChatMessage(msgObj) {
  const container = document.getElementById('chatMessagesBox');
  if (!container) return;

  // Append user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble chat-bubble-user';
  userBubble.textContent = msgObj.user;
  container.appendChild(userBubble);
  container.scrollTop = container.scrollHeight;

  // Append typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'chat-bubble chat-bubble-ai';
  typingIndicator.id = 'chatTypingIndicator';
  typingIndicator.innerHTML = '<span style="opacity:0.6">PAI Class AI is retrieving lecture slides... ✨</span>';
  container.appendChild(typingIndicator);
  container.scrollTop = container.scrollHeight;

  // Simulate fast RAG response (< 600ms)
  setTimeout(() => {
    const typing = document.getElementById('chatTypingIndicator');
    if (typing) typing.remove();

    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble chat-bubble-ai';
    aiBubble.innerHTML = `
      <div>${msgObj.ai}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px">
        <span class="citation-pill">📄 ${msgObj.citation}</span>
        <span style="font-size:0.7rem;font-weight:700;color:#10B981">🛡️ ${msgObj.confidence}</span>
      </div>
    `;
    container.appendChild(aiBubble);
    container.scrollTop = container.scrollHeight;
  }, 500);
}

/* ==========================================================================
   5. PRESENTATION SLIDES GALLERY & LIGHTBOX (Slides 1 to 15)
   ========================================================================== */
const totalSlides = 15;
let currentSlideNumber = 1;

const slideDescriptions = [
  "Slide 1 — Welcome to PAI Class: The smart, fast, and easy way to run your school.",
  "Slide 2 — The Problem: Old school systems are digital file cabinets that store files but don't help.",
  "Slide 3 — The Active Helper: Safe AI 24/7, Fast Grading, and Instant Connected Workflows.",
  "Slide 4 — Before & After: The friction of the old way versus the speed of PAI Class.",
  "Slide 5 — Smart AI Importer: Adding thousands of students automatically with fuzzy column matching.",
  "Slide 6 — Administrator Portal: Instant campus-wide oversight and Executive AI assistant.",
  "Slide 7 — Smart Swipe Attendance: Swipe Right for Present, Swipe Left for Absent in seconds.",
  "Slide 8 — AI Pre-Grading Engine: OCR text extraction, similarity checks, and human-in-the-loop review.",
  "Slide 9 — Student Academic Health: Unified dashboard with real-time attendance percentage ring gauge.",
  "Slide 10 — Bilingual 24/7 AI Tutor: Speaks English and Urdu natively, strictly grounded in lecture slides.",
  "Slide 11 — Frictionless Absence Appeals: Students upload medical notes; teachers approve with 1 click.",
  "Slide 12 — Strict RAG Fence: Why PAI Class AI never hallucinates or makes things up.",
  "Slide 13 — Speed & Zero Clutter: Custom lightweight architecture without heavy web tool bloat.",
  "Slide 14 — Fully Connected Campus: Admin, Teacher, and Student working in perfect real-time harmony.",
  "Slide 15 — Finale & Slogan: Education without the friction. Ready to make your school smarter?"
];

function initDeckGallery() {
  const mainImg = document.getElementById('deckMainImg');
  const prevBtn = document.getElementById('deckPrevBtn');
  const nextBtn = document.getElementById('deckNextBtn');
  const counterEl = document.getElementById('deckSlideCounter');
  const descEl = document.getElementById('deckSlideDesc');
  const thumbsContainer = document.getElementById('deckThumbsScroller');

  const lightbox = document.getElementById('deckLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!mainImg || !thumbsContainer) return;

  // Generate thumbnail items
  thumbsContainer.innerHTML = '';
  for (let i = 1; i <= totalSlides; i++) {
    const thumbNum = i.toString().padStart(2, '0');
    const thumbDiv = document.createElement('div');
    thumbDiv.className = `deck-thumb ${i === 1 ? 'active' : ''}`;
    thumbDiv.dataset.slide = i;
    thumbDiv.innerHTML = `<img src="assets/slides/slide_${thumbNum}.png" alt="Slide ${i}">`;
    thumbDiv.addEventListener('click', () => setSlide(i));
    thumbsContainer.appendChild(thumbDiv);
  }

  function setSlide(num) {
    if (num < 1) num = totalSlides;
    if (num > totalSlides) num = 1;
    currentSlideNumber = num;

    const formattedNum = num.toString().padStart(2, '0');
    mainImg.src = `assets/slides/slide_${formattedNum}.png`;

    if (counterEl) counterEl.textContent = `${num} / ${totalSlides}`;
    if (descEl) descEl.textContent = slideDescriptions[num - 1] || `Slide ${num}`;

    // Update active thumb
    document.querySelectorAll('.deck-thumb').forEach(t => {
      if (parseInt(t.dataset.slide) === num) {
        t.classList.add('active');
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        t.classList.remove('active');
      }
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => setSlide(currentSlideNumber - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setSlide(currentSlideNumber + 1));

  // Lightbox opening
  mainImg.addEventListener('click', () => {
    if (lightbox && lightboxImg) {
      const formattedNum = currentSlideNumber.toString().padStart(2, '0');
      lightboxImg.src = `assets/slides/slide_${formattedNum}.png`;
      lightbox.classList.add('open');
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') setSlide(currentSlideNumber - 1);
    if (e.key === 'ArrowRight') setSlide(currentSlideNumber + 1);
    if (e.key === 'Escape' && lightbox) lightbox.classList.remove('open');
  });
}

/* ==========================================================================
   6. SCROLL-TRIGGERED REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const cards = document.querySelectorAll('.glass-card, .comparison-col-old, .comparison-col-new, .arch-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(card);
  });
}

/* ==========================================================================
   7. METRIC COUNT-UP ANIMATIONS
   ========================================================================== */
function initMetricCounters() {
  const metrics = document.querySelectorAll('.metric-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        // Trigger subtle glow flash
        entry.target.style.animation = 'floatTelemetry 2s ease';
      }
    });
  }, { threshold: 0.2 });

  const metricsSection = document.querySelector('.metrics-strip');
  if (metricsSection) observer.observe(metricsSection);
}

/* ==========================================================================
   8. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');

  if (btn && drawer) {
    btn.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => drawer.classList.remove('open'));
    });
  }
}
