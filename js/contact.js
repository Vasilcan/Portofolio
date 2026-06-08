/* === VALIDARE CONTACT & SCROLL TO TOP === */

document.addEventListener('DOMContentLoaded', () => {
  // Inițializează formularul de contact
  initContactForm();
  
  // Inițializează butonul de scroll to top din footer
  initScrollTop();
});

/**
 * Gestionează validarea câmpurilor, stările de eroare și simularea trimiterii.
 */
const initContactForm = () => {
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  if (!form) return;
  
  // Curăță eroarea de pe un câmp
  const clearError = (input) => {
    input.classList.remove('input-error');
    const errorMsg = input.parentNode.querySelector('.input-error-msg');
    if (errorMsg) {
      errorMsg.remove();
    }
  };
  
  // Afișează un mesaj de eroare dedicat sub câmp
  const showError = (input, message) => {
    clearError(input);
    input.classList.add('input-error');
    
    const errorSpan = document.createElement('span');
    errorSpan.className = 'input-error-msg';
    errorSpan.textContent = message;
    input.parentNode.appendChild(errorSpan);
  };
  
  // Elimină eroarea la introducere text
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    // Resetare mesaje status general
    formStatus.className = '';
    formStatus.textContent = '';
    
    // 1. Validare Nume complet
    if (!name.value.trim()) {
      showError(name, 'Te rog introdu numele tău complet.');
      isValid = false;
    } else {
      clearError(name);
    }
    
    // 2. Validare Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError(email, 'Te rog introdu adresa ta de email.');
      isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      showError(email, 'Te rog introdu o adresă de email validă (exemplu: nume@domeniu.com).');
      isValid = false;
    } else {
      clearError(email);
    }
    
    // 3. Validare Subiect
    if (!subject.value.trim()) {
      showError(subject, 'Te rog adaugă un subiect pentru mesaj.');
      isValid = false;
    } else {
      clearError(subject);
    }
    
    // 4. Validare Mesaj (minim 20 caractere)
    if (!message.value.trim()) {
      showError(message, 'Te rog scrie un mesaj.');
      isValid = false;
    } else if (message.value.trim().length < 20) {
      showError(message, `Mesajul este prea scurt. Te rog scrie cel puțin 20 de caractere (momentan are ${message.value.trim().length}).`);
      isValid = false;
    } else {
      clearError(message);
    }
    
    // Trimite formularul dacă toate validările trec
    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Dezactivează butonul și încarcă spinner-ul
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-block; width:12px; height:12px; border:2px solid #ffffff; border-radius:50%; border-top-color:transparent; animation: spin-btn 0.6s linear infinite; margin-right:8px; vertical-align:middle;"></span>
        Se trimite...
      `;
      
      /* 
       * TODO: Înlocuiește cu endpoint Formspree:
       * Exemplu: https://formspree.io/f/YOUR_ID
       */
      
      // Simulare trimitere timp de 1500ms
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        
        // Afișează banner-ul de succes
        formStatus.className = 'success';
        formStatus.textContent = 'Mesajul a fost trimis! Îți voi răspunde în curând.';
        
        // Resetează valorile din formular
        form.reset();
        
        // Șterge automat statusul de succes după 4 secunde
        setTimeout(() => {
          formStatus.className = '';
          formStatus.textContent = '';
        }, 4000);
        
      }, 1500);
    }
  });
};

/**
 * Configurează derularea fluidă la începutul paginii.
 */
const initScrollTop = () => {
  const scrollTopBtn = document.getElementById('scroll-top');
  if (!scrollTopBtn) return;
  
  // Controlăm vizibilitatea în funcție de înălțimea derulată
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.pointerEvents = 'all';
      scrollTopBtn.style.transform = 'translateY(0)';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.pointerEvents = 'none';
      scrollTopBtn.style.transform = 'translateY(10px)';
    }
  });
  
  // Stări inițiale ascunse
  scrollTopBtn.style.opacity = '0';
  scrollTopBtn.style.pointerEvents = 'none';
  scrollTopBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};
