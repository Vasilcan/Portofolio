/* === NAVIGARE & INTERACTIVITATE NAVBAR === */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const langButtons = document.querySelectorAll('.lang-btn');

  /* === CLASA SCROLLED PE NAVBAR === */
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  // Execută la încărcarea inițială pentru cazul în care pagina este deja derulată
  handleScroll();

  /* === MENIU HAMBURGER MOBIL === */
  const toggleMobileMenu = () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    
    // Blocăm scroll-ul pe body când meniul este deschis
    if (navMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  hamburger.addEventListener('click', toggleMobileMenu);

  /* === SMOOTH SCROLL PENTRU LINK-URI === */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Închidem meniul mobil dacă este deschis
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';

        const navbarHeight = 68;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* === INTERSECTION OBSERVER PENTRU ACTIVE LINK === */
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-70px 0px -60% 0px', // Ajustat pentru înălțimea navbar-ului
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  /* === SWITCHER DE LIMBĂ === */
  langButtons.forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.getAttribute('data-lang');
      
      // Schimbă clasa active între butoane
      langButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Adaugă/elimină clasa .lang-en pe body
      if (lang === 'en') {
        document.body.classList.add('lang-en');
      } else {
        document.body.classList.remove('lang-en');
      }
    });
  });
});
