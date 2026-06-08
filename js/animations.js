/* === GLOBAL ANIMATIONS & FINAL POLISH === */

document.addEventListener('DOMContentLoaded', () => {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Initialize scroll progress bar
  initScrollProgress();
  
  if (prefersReducedMotion) {
    // If user prefers reduced motion, skip animations but make sure text is fully typed
    // and elements are immediately visible (handled by CSS, but let's make sure text is visible)
    const typewriterEl = document.getElementById('typewriter-text');
    // If it's already in the DOM, it will display statically.
    return;
  }
  
  // Initialize standard scroll animations (Intersection Observer)
  initScrollAnimations();
  
  // Initialize stats counters
  initCounterAnimations();
  
  // Initialize custom cursors
  initCustomCursors();
  
  // Initialize typewriter effect
  initTypewriter();
  
  // Initialize hero parallax
  initHeroParallax();
});

/**
 * Scroll Progress Bar
 */
const initScrollProgress = () => {
  const progressEl = document.getElementById('scroll-progress');
  if (!progressEl) return;
  
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressEl.style.width = `${scrollPercent}%`;
  };
  
  window.addEventListener('scroll', updateProgress);
  updateProgress();
};

/**
 * Scroll Animations (Intersection Observer)
 */
const initScrollAnimations = () => {
  const animatedElements = document.querySelectorAll('.animate-ready');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.15
  };
  
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const delay = target.getAttribute('data-delay');
        if (delay !== null) {
          target.style.transitionDelay = `${delay}ms`;
        }
        target.classList.add('animated');
        observer.unobserve(target);
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  animatedElements.forEach(element => {
    observer.observe(element);
  });
};

/**
 * Counter Animation
 */
const initCounterAnimations = () => {
  const statsSection = document.querySelector('.about-stats');
  if (!statsSection) return;
  
  const animateCounter = (element, targetStr, duration = 1500) => {
    const isPlus = targetStr.includes('+');
    const isAni = targetStr.includes('ani') || targetStr.includes('Ani');
    const targetVal = parseInt(targetStr.replace(/[^0-9]/g, ''), 10) || 0;
    
    let startTime = null;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const currentVal = Math.floor(easedProgress * targetVal);
      
      let textToDisplay = currentVal.toString();
      if (isPlus) textToDisplay += '+';
      if (isAni) textToDisplay += ' ani';
      
      element.textContent = textToDisplay;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = targetStr;
      }
    };
    
    requestAnimationFrame(step);
  };
  
  const observerOptions = {
    threshold: 0.15
  };
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(statNum => {
          const target = statNum.getAttribute('data-target') || statNum.textContent;
          animateCounter(statNum, target);
        });
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  observer.observe(statsSection);
};

/**
 * Custom Cursors (lerped movement)
 */
const initCustomCursors = () => {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;
  
  // Guard against touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    return;
  }
  
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let hasMoved = false;
  
  // Initially hide them until mouse moves
  cursor.style.opacity = '0';
  follower.style.opacity = '0';
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!hasMoved) {
      hasMoved = true;
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
      followerX = mouseX;
      followerY = mouseY;
    }
    
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });
  
  const updateFollower = () => {
    if (hasMoved) {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(updateFollower);
  };
  requestAnimationFrame(updateFollower);
  
  // Hover effect scaling
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .filter-btn, .details-toggle-btn, [role="button"]');
    if (target) {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, .filter-btn, .details-toggle-btn, [role="button"]');
    if (target) {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    }
  });
  
  // Hide cursor on leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    if (hasMoved) {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    }
  });
};

/**
 * Typewriter Effect
 */
const initTypewriter = () => {
  const typewriterEl = document.getElementById('typewriter-text');
  if (!typewriterEl) return;
  
  const fullText = typewriterEl.textContent.trim();
  typewriterEl.textContent = '';
  typewriterEl.style.opacity = '1'; // Make sure container is visible
  
  // Create blinking cursor span
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'typewriter-cursor';
  cursorSpan.textContent = '|';
  
  // Dynamic blinking cursor styles injection
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes typewriter-blink {
      50% { opacity: 0; }
    }
    .typewriter-cursor {
      color: var(--accent-magenta);
      font-weight: bold;
      margin-left: 2px;
      display: inline-block;
      animation: typewriter-blink 0.75s step-start infinite;
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => {
    typewriterEl.appendChild(cursorSpan);
    let i = 0;
    const speed = 25; // 25ms per character typing speed
    
    const type = () => {
      if (i < fullText.length) {
        cursorSpan.before(fullText.charAt(i));
        i++;
        setTimeout(type, speed);
      } else {
        // Disappear cursor after 2 seconds (2000ms)
        setTimeout(() => {
          cursorSpan.style.transition = 'opacity 0.3s ease';
          cursorSpan.style.opacity = '0';
          setTimeout(() => cursorSpan.remove(), 300);
        }, 2000);
      }
    };
    
    type();
  }, 800);
};

/**
 * Hero Parallax (Desktop mouse move shift)
 */
const initHeroParallax = () => {
  const hero = document.getElementById('hero');
  const heroContainer = hero ? hero.querySelector('.hero-container') : null;
  if (!hero || !heroContainer) return;
  
  // Add smooth transitions for transforms
  heroContainer.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  
  document.addEventListener('mousemove', (e) => {
    // Check viewport dimensions and input pointer
    if (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches) {
      heroContainer.style.transform = 'none';
      return;
    }
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Normalized distance from center (-0.5 to 0.5)
    const normX = (e.clientX / width) - 0.5;
    const normY = (e.clientY / height) - 0.5;
    
    // Max translation offset is ±12px (factor 0.02 * window dims approx)
    const moveX = normX * 24; // Range: [-12px, 12px]
    const moveY = normY * 24; // Range: [-12px, 12px]
    
    heroContainer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
  
  // Reset when mouse leaves hero section
  hero.addEventListener('mouseleave', () => {
    heroContainer.style.transform = 'translate3d(0px, 0px, 0)';
  });
};
