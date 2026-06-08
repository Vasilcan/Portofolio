/* === GITHUB STATS & CONTOARE ANIMATE === */

document.addEventListener('DOMContentLoaded', () => {
  // Inițializează datele live de pe GitHub
  fetchGitHubStats();
  
  // Inițializează bannerul de disponibilitate
  initAvailabilityBanner();
});

/* === OBTINERE DATE LIVE GITHUB === */
const fetchGitHubStats = async () => {
  const username = 'Vasilcan'; // Numele de utilizator GitHub al lui Darius
  
  try {
    // 1. Fetch detalii profil (număr total de depozite publice)
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) throw new Error('Eroare la preluarea profilului GitHub');
    const userData = await userResponse.json();
    
    // Actualizăm valoarea țintă pentru animația proiectelor
    const projectsElement = document.getElementById('github-projects');
    if (projectsElement && userData.public_repos !== undefined) {
      projectsElement.setAttribute('data-target', userData.public_repos);
      // Actualizăm textul în timp real în caz că animația s-a încheiat deja sau urmează să ruleze
      projectsElement.textContent = `${userData.public_repos}+`;
    }
    
    // 2. Fetch depozite publice (stele totale, limbaje utilizate, ultima activitate)
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!reposResponse.ok) throw new Error('Eroare la preluarea depozitelor GitHub');
    const reposData = await reposResponse.json();
    
    if (Array.isArray(reposData) && reposData.length > 0) {
      // Afișăm containerul cu statistici suplimentare
      const extraStatsContainer = document.getElementById('github-extra-stats');
      if (extraStatsContainer) {
        extraStatsContainer.style.display = 'block';
      }
      
      // Calculează suma stelelor
      const totalStars = reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      if (totalStars > 0) {
        const starsItem = document.getElementById('github-stars-item');
        const starsVal = document.getElementById('github-stars');
        if (starsItem && starsVal) {
          starsVal.textContent = totalStars;
          starsItem.style.display = 'inline-flex';
        }
      }
      
      // Compilează limbajele (top 3 cele mai utilizate în depozite)
      const languagesMap = {};
      reposData.forEach(repo => {
        if (repo.language) {
          languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
        }
      });
      
      const sortedLanguages = Object.entries(languagesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
        
      if (sortedLanguages.length > 0) {
        const languagesItem = document.getElementById('github-languages-item');
        const languagesVal = document.getElementById('github-languages');
        if (languagesItem && languagesVal) {
          languagesVal.textContent = sortedLanguages.join(', ');
          languagesItem.style.display = 'inline-flex';
        }
      }
      
      // Calculează zilele trecute de la ultimul commit (updated_at sau pushed_at)
      let latestDate = new Date(0);
      reposData.forEach(repo => {
        const updateDate = new Date(repo.pushed_at || repo.updated_at);
        if (updateDate > latestDate) {
          latestDate = updateDate;
        }
      });
      
      const diffTime = Math.abs(new Date() - latestDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      const activityItem = document.getElementById('github-activity-item');
      const activeDaysVal = document.getElementById('github-active-days');
      if (activityItem && activeDaysVal) {
        let activeText = '';
        if (diffDays === 0) {
          activeText = 'activ astăzi';
        } else if (diffDays === 1) {
          activeText = 'activ ieri';
        } else {
          activeText = `activ acum ${diffDays} zile`;
        }
        activeDaysVal.textContent = activeText;
        activityItem.style.display = 'inline-flex';
      }
    }
  } catch (error) {
    // Fallback silențios cu console.warn pentru a nu afecta UI-ul utilizatorului
    console.warn('Activitate GitHub live: fallback la valori implicite din cauza limitării sau lipsei API-ului.', error.message);
  }
};

/* === BANNER DYNAMIC DE DISPONIBILITATE === */
const initAvailabilityBanner = () => {
  // Verifică dacă bannerul a fost închis anterior în sesiunea curentă
  if (sessionStorage.getItem('availability-banner-dismissed') === 'true') {
    return;
  }
  
  // Încarcă bannerul după 3 secunde
  setTimeout(() => {
    const banner = document.createElement('div');
    banner.id = 'availability-cta';
    
    banner.innerHTML = `
      <span class="pulse-dot"></span>
      <span>Disponibil pentru proiecte</span>
      <a href="#contact" class="cta-link">→ Contact</a>
      <button type="button" class="close-btn" aria-label="Închide">&times;</button>
    `;
    
    document.body.appendChild(banner);
    
    // Declanșează tranziția de fade-in
    requestAnimationFrame(() => {
      banner.classList.add('show');
    });
    
    // Ascultă click-ul de închidere
    const closeBtn = banner.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      banner.classList.remove('show');
      setTimeout(() => {
        banner.remove();
      }, 500);
      sessionStorage.setItem('availability-banner-dismissed', 'true');
    });
    
    // Scroll către contact din banner
    const ctaLink = banner.querySelector('.cta-link');
    ctaLink.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const navbarHeight = 68;
        const targetPosition = contactSection.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }, 3000);
};
