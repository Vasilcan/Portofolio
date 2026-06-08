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
  const switchLanguage = (lang) => {
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    
    // Adaugă/elimină clasa .lang-en pe body pentru compatibilitate cu stilurile CSS
    if (lang === 'en') {
      document.body.classList.add('lang-en');
    } else {
      document.body.classList.remove('lang-en');
    }
    
    // Actualizează toate textele cu data-ro / data-en
    document.querySelectorAll('[data-ro]').forEach(el => {
      el.textContent = lang === 'en' ? el.dataset.en : el.dataset.ro;
    });
    
    // Actualizează placeholder-urile
    document.querySelectorAll('[data-placeholder-ro]').forEach(el => {
      el.placeholder = lang === 'en' ? el.dataset.placeholderEn : el.dataset.placeholderRo;
    });
    
    // Actualizează aria-labels
    document.querySelectorAll('[data-aria-ro]').forEach(el => {
      el.setAttribute('aria-label', lang === 'en' ? el.dataset.ariaEn : el.dataset.ariaRo);
    });
    
    // Actualizează titlul și meta description
    document.title = lang === 'en' ? "Vasilcan Darius — Developer & IE Student" : "Vasilcan Darius — Developer & Student IE";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', lang === 'en' 
        ? "Personal portfolio - Vasilcan Darius, Economic Informatics student and Developer. Discover my projects, skills, and professional journey." 
        : "Portofoliu personal - Vasilcan Darius, student la Informatică Economică și Developer. Descoperă proiectele, abilitățile și parcursul meu profesional."
      );
    }
    
    // Actualizează butoanele de detalii pentru proiecte
    document.querySelectorAll('.details-toggle-btn').forEach(btn => {
      const card = btn.closest('.project-card');
      const details = card.querySelector('.project-details');
      const isShow = details && details.classList.contains('show');
      if (isShow) {
        btn.textContent = lang === 'en' ? 'Details ▲' : 'Detalii ▲';
      } else {
        btn.textContent = lang === 'en' ? 'Details ▼' : 'Detalii ▼';
      }
    });
    
    // Sincronizează clasa active pe butoanele din navbar
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Reset contact form status & errors on language change
    const form = document.getElementById('contact-form');
    if (form) {
      form.reset();
      const formStatus = document.getElementById('form-status');
      if (formStatus) {
        formStatus.className = '';
        formStatus.textContent = '';
      }
      form.querySelectorAll('.input-error').forEach(input => {
        input.classList.remove('input-error');
      });
      form.querySelectorAll('.input-error-msg').forEach(msg => {
        msg.remove();
      });
    }
    
    // Salvează preferința
    localStorage.setItem('portfolio-lang', lang);
  };

  // La load: aplică limba salvată
  const savedLang = localStorage.getItem('portfolio-lang') || 'ro';
  switchLanguage(savedLang);

  // Butoane navbar
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.getAttribute('data-lang'));
    });
  });
});
