/* === FILTRARE PROIECTE & PANOURI DETALII === */

document.addEventListener('DOMContentLoaded', () => {
  // Inițializează sistemul de filtrare a proiectelor
  initProjectsFilter();
  
  // Inițializează panourile expandabile cu detalii
  initDetailsExpander();
});

/**
 * Configurează butoanele de filtru, sincronizarea cu URL-ul (hash/query)
 * și animațiile de ascundere/afișare a proiectelor.
 */
const initProjectsFilter = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  const filterProjects = (category) => {
    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        // Pentru afișare: resetăm display flex
        card.style.display = 'flex';
        // Permitem browserului un cadru de randare pentru a simți clasa de tranzitie
        requestAnimationFrame(() => {
          card.classList.remove('fade-out');
          card.classList.add('fade-in');
        });
      } else {
        // Pentru ascundere: aplicăm fade-out
        card.classList.remove('fade-in');
        card.classList.add('fade-out');
        // Ascundem elementul din layout-ul grid după terminarea tranziției (250ms)
        setTimeout(() => {
          if (card.classList.contains('fade-out')) {
            card.style.display = 'none';
          }
        }, 250);
      }
    });
  };
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');
      
      // Schimbă clasa active pe butoane
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Rulează filtrarea
      filterProjects(category);
      
      // Sincronizează starea filtrului cu URL hash fără a forța derularea paginii
      window.history.pushState(null, null, `#proiecte?filter=${category}`);
    });
  });
  
  // Funcție de detectare a filtrului activ din URL
  const applyFilterFromURL = () => {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    
    let targetFilter = 'all';
    
    // 1. Verificăm hash-ul: #proiecte?filter=categorie
    if (hash && hash.includes('filter=')) {
      const match = hash.split('filter=');
      if (match.length > 1) {
        targetFilter = match[1];
      }
    } 
    // 2. Verificăm query parameters (fallback): ?filter=categorie
    else if (urlParams.has('filter')) {
      targetFilter = urlParams.get('filter');
    }
    
    // Activăm butonul corespunzător dacă este o categorie validă
    const validFilters = ['all', 'frontend', 'backend', 'ai', 'fullstack'];
    if (validFilters.includes(targetFilter)) {
      const activeBtn = document.querySelector(`.filter-btn[data-filter="${targetFilter}"]`);
      if (activeBtn && !activeBtn.classList.contains('active')) {
        // Simulează click-ul pe buton
        activeBtn.classList.add('active');
        // Elimină clasa active de pe restul butoanelor
        filterButtons.forEach(b => {
          if (b !== activeBtn) b.classList.remove('active');
        });
        filterProjects(targetFilter);
      }
    }
  };
  
  // Verifică starea la încărcare
  applyFilterFromURL();
  
  // Ascultă butoanele înapoi/înainte din browser
  window.addEventListener('popstate', applyFilterFromURL);
};

/**
 * Configurează expandarea detaliilor pentru cardurile de tip proiect.
 */
const initDetailsExpander = () => {
  const toggleButtons = document.querySelectorAll('.details-toggle-btn');
  
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      const details = card.querySelector('.project-details');
      
      if (details) {
        details.classList.toggle('show');
        if (details.classList.contains('show')) {
          btn.textContent = 'Detalii ▲';
        } else {
          btn.textContent = 'Detalii ▼';
        }
      }
    });
  });
};
