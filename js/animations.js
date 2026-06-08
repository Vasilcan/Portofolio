/* === ANIMAȚII LA SCROLL (INTERSECTION OBSERVER) === */

document.addEventListener('DOMContentLoaded', () => {
  // Inițializează decalajele de timp (stagger) pentru elementele de tip grid
  initStaggerDelays();
  
  // Inițializează observatorul de scroll
  initScrollAnimations();
});

/**
 * Calculează și adaugă variabila CSS --delay pe elementele animate din grid-uri
 * pentru a crea efectul de apariție eșalonată (staggered).
 */
const initStaggerDelays = () => {
  // Selectăm containerele de tip grid unde dorim eșalonarea copiilor
  const containers = document.querySelectorAll('.skills-grid, .about-stats');
  
  containers.forEach(container => {
    const children = container.querySelectorAll('.animate-ready');
    children.forEach((child, index) => {
      // Stagger delay implicit de 150ms între elemente succesive
      const delay = index * 150;
      child.style.setProperty('--delay', `${delay}ms`);
    });
  });
};

/**
 * Folosește IntersectionObserver pentru a declanșa animația de fade-in
 * prin adăugarea clasei .animated pe elementele .animate-ready.
 */
const initScrollAnimations = () => {
  const animatedElements = document.querySelectorAll('.animate-ready');
  
  const observerOptions = {
    root: null, // Viewport-ul browserului
    rootMargin: '0px 0px -8% 0px', // Declanșează animația când elementul este aproape de viewport
    threshold: 0.1 // 10% din element trebuie să fie vizibil
  };
  
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        target.classList.add('animated');
        
        // Odată ce animația a rulat, nu mai monitorizăm elementul
        observer.unobserve(target);
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
};
