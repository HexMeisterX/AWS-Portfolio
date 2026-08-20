/**
 * AWS Harbour Table - Master Client-side JavaScript
 * Dynamic UI interactions, Testimonials carousel, Lightbox,
 * and Simulated Local Storage Authentication.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Features
  initNavigation();
  initThemeToggle();
  initBackToTop();
  initRevealAnimations();
  initTestimonials();
  initAuthSystem();
  initGalleryLightbox();
  initForms();
});

/* ==========================================================================
   1. NAVIGATION & RESPONSIVE MENU
   ========================================================================== */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Highlight active page link based on filename
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   2. DARK/LIGHT THEME SWITCHER
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (!themeToggle) return;

  // Check saved theme or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  // Bind toggle click event
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

/* ==========================================================================
   3. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');

  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length === 0) return;

  const revealOnScroll = () => {
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 120; // threshold

      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add('active');
      }
    }
  };

  window.addEventListener('scroll', revealOnScroll);
  // Trigger once initially to show visible content
  revealOnScroll();
}

/* ==========================================================================
   5. TESTIMONIALS CAROUSEL
   ========================================================================== */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-dots');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let carouselInterval;

  // Create indicator dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function startAutoplay() {
    carouselInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoplay() {
    clearInterval(carouselInterval);
    startAutoplay();
  }

  // Display first slide and start loop
  slides[0].classList.add('active');
  startAutoplay();
}

/* ==========================================================================
   6. SIMULATED AUTH SYSTEM & PROFILE STORAGE
   ========================================================================== */
function initAuthSystem() {
  // Navigation elements
  const loginNav = document.getElementById('nav-login-item');
  const profileNav = document.getElementById('nav-profile-item');
  const navUserText = document.getElementById('nav-user-text');
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Update Navigation link states
  if (currentUser) {
    if (loginNav) loginNav.style.display = 'none';
    if (profileNav) {
      profileNav.style.display = 'block';
      if (navUserText) {
        navUserText.textContent = `Welcome, ${currentUser.firstName}`;
      }
    }
  } else {
    if (loginNav) loginNav.style.display = 'block';
    if (profileNav) profileNav.style.display = 'none';
  }

  // Log Out Binding
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  }

  // Guard protected profile route
  const isProfilePage = window.location.pathname.includes('profile.html');
  if (isProfilePage && !currentUser) {
    window.location.href = 'login.html';
  }
}

/* ==========================================================================
   7. GALLERY FILTER & LIGHTBOX MODAL
   ========================================================================== */
function initGalleryLightbox() {
  // Gallery Filtering
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // Lightbox Modal Logic
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!lightbox) return;

  let currentImgIndex = 0;
  let activeGalleryList = [];

  // Gather list of visible gallery images
  function updateActiveGalleryList() {
    activeGalleryList = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  // Show Lightbox with targeted image
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      updateActiveGalleryList();
      currentImgIndex = activeGalleryList.indexOf(item);
      showImage(item);
      lightbox.classList.add('active');
    });
  });

  function showImage(itemElement) {
    const img = itemElement.querySelector('img');
    const title = itemElement.querySelector('h4').textContent;
    const cat = itemElement.querySelector('span').textContent;

    lightboxImg.src = img.src;
    lightboxCaption.textContent = `${title} (${cat})`;
  }

  function showNextImage() {
    currentImgIndex = (currentImgIndex + 1) % activeGalleryList.length;
    showImage(activeGalleryList[currentImgIndex]);
  }

  function showPrevImage() {
    currentImgIndex = (currentImgIndex - 1 + activeGalleryList.length) % activeGalleryList.length;
    showImage(activeGalleryList[currentImgIndex]);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
  }

  if (nextBtn) nextBtn.addEventListener('click', showNextImage);
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

  // Close lightbox on click outside image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });
}

/* ==========================================================================
   8. FORM VALIDATION, BOOKINGS, ORDERS & LOGINS
   ========================================================================== */
function initForms() {
  // A helper function to show field error state
  function showError(inputElement, errorMessage) {
    const formGroup = inputElement.closest('.form-group');
    if (!formGroup) return;
    let errorDiv = formGroup.querySelector('.form-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.classList.add('form-error');
      formGroup.appendChild(errorDiv);
    }
    errorDiv.textContent = errorMessage;
    errorDiv.style.display = 'block';
    inputElement.style.borderColor = '#EF4444';
  }

  function clearError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (!formGroup) return;
    const errorDiv = formGroup.querySelector('.form-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
    inputElement.style.borderColor = '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* --- REGISTER FORM --- */
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const firstNameInput = document.getElementById('reg-firstname');
      const lastNameInput = document.getElementById('reg-lastname');
      const emailInput = document.getElementById('reg-email');
      const passwordInput = document.getElementById('reg-password');
      const termsInput = document.getElementById('reg-terms');

      let isValid = true;

      // Clear previous errors
      [firstNameInput, lastNameInput, emailInput, passwordInput].forEach(clearError);

      if (!firstNameInput.value.trim()) {
        showError(firstNameInput, 'First name is required');
        isValid = false;
      }
      if (!lastNameInput.value.trim()) {
        showError(lastNameInput, 'Last name is required');
        isValid = false;
      }
      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        showError(emailInput, 'Provide a valid email address');
        isValid = false;
      }
      if (passwordInput.value.length < 6) {
        showError(passwordInput, 'Password must be at least 6 characters');
        isValid = false;
      }
      if (termsInput && !termsInput.checked) {
        alert('You must agree to the Terms & Conditions');
        isValid = false;
      }

      if (!isValid) return;

      // Register account in Local Storage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.some(u => u.email.toLowerCase() === emailInput.value.toLowerCase());

      if (userExists) {
        showError(emailInput, 'An account with this email already exists');
        return;
      }

      const newUser = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        bookings: [],
        orders: []
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto Log In
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      window.location.href = 'profile.html';
    });
  }

  /* --- LOGIN FORM --- */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');
      const rememberInput = document.getElementById('login-remember');

      let isValid = true;
      [emailInput, passwordInput].forEach(clearError);

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        showError(emailInput, 'Provide a valid email address');
        isValid = false;
      }
      if (!passwordInput.value) {
        showError(passwordInput, 'Password is required');
        isValid = false;
      }

      if (!isValid) return;

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const matchedUser = users.find(u => u.email.toLowerCase() === emailInput.value.trim().toLowerCase() && u.password === passwordInput.value);

      if (!matchedUser) {
        showError(emailInput, 'Invalid email or password');
        showError(passwordInput, 'Invalid email or password');
        return;
      }

      // Save session
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      
      if (rememberInput && rememberInput.checked) {
        localStorage.setItem('rememberedUserEmail', matchedUser.email);
      } else {
        localStorage.removeItem('rememberedUserEmail');
      }

      window.location.href = 'profile.html';
    });

    // Populate email if remembered
    const rememberedEmail = localStorage.getItem('rememberedUserEmail');
    if (rememberedEmail) {
      document.getElementById('login-email').value = rememberedEmail;
      const rememberCheckbox = document.getElementById('login-remember');
      if (rememberCheckbox) rememberCheckbox.checked = true;
    }
  }

  /* --- EDIT PROFILE DASHBOARD FORM --- */
  const editProfileForm = document.getElementById('edit-profile-form');
  const toggleEditBtn = document.getElementById('toggle-edit-btn');
  const profileViewCard = document.getElementById('profile-view-card');
  const profileEditCard = document.getElementById('profile-edit-card');

  if (toggleEditBtn && profileViewCard && profileEditCard) {
    toggleEditBtn.addEventListener('click', () => {
      profileViewCard.style.display = 'none';
      profileEditCard.style.display = 'block';

      // Prefill fields
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      document.getElementById('edit-firstname').value = currentUser.firstName;
      document.getElementById('edit-lastname').value = currentUser.lastName;
      document.getElementById('edit-phone').value = currentUser.phone || '';
    });

    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => {
        profileViewCard.style.display = 'block';
        profileEditCard.style.display = 'none';
      });
    }

    if (editProfileForm) {
      editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('edit-firstname').value.trim();
        const lastName = document.getElementById('edit-lastname').value.trim();
        const phone = document.getElementById('edit-phone').value.trim();

        if (!firstName || !lastName) {
          alert('First name and last name are required');
          return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Update active session
        currentUser.firstName = firstName;
        currentUser.lastName = lastName;
        currentUser.phone = phone;

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update database array
        const userIndex = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (userIndex !== -1) {
          users[userIndex].firstName = firstName;
          users[userIndex].lastName = lastName;
          users[userIndex].phone = phone;
          localStorage.setItem('users', JSON.stringify(users));
        }

        window.location.reload();
      });
    }
  }

  /* --- MOCK BOOKINGS HISTORY DISPLAY --- */
  const isProfilePage = window.location.pathname.includes('profile.html');
  if (isProfilePage) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const bookingList = document.getElementById('booking-history-list');
    const orderList = document.getElementById('order-history-list');

    if (currentUser) {
      // Set Name & Email
      const profileNameElements = document.querySelectorAll('.user-full-name');
      const profileEmailElement = document.getElementById('user-email-text');
      const profilePhoneElement = document.getElementById('user-phone-text');

      profileNameElements.forEach(el => el.textContent = `${currentUser.firstName} ${currentUser.lastName}`);
      if (profileEmailElement) profileEmailElement.textContent = currentUser.email;
      if (profilePhoneElement) profilePhoneElement.textContent = currentUser.phone || 'Not set';

      // Load Bookings
      if (bookingList) {
        if (!currentUser.bookings || currentUser.bookings.length === 0) {
          bookingList.innerHTML = '<p class="text-center" style="color: var(--text-secondary);">No reservation history found. <a href="booking.html" style="color: var(--color-gold);">Book a table now!</a></p>';
        } else {
          bookingList.innerHTML = currentUser.bookings.map(b => `
            <div class="history-item">
              <div class="history-details">
                <span class="history-date">${b.date} at ${b.time}</span>
                <span class="history-desc">Guests: ${b.guests} | Seating: ${b.seating} | Ref: ${b.ref}</span>
              </div>
              <span class="history-status status-confirmed">Confirmed</span>
            </div>
          `).join('');
        }
      }

      // Load Orders
      if (orderList) {
        if (!currentUser.orders || currentUser.orders.length === 0) {
          orderList.innerHTML = '<p class="text-center" style="color: var(--text-secondary);">No order history found. <a href="order.html" style="color: var(--color-gold);">Order online now!</a></p>';
        } else {
          orderList.innerHTML = currentUser.orders.map(o => `
            <div class="history-item">
              <div class="history-details">
                <span class="history-date">${o.date} (${o.type})</span>
                <span class="history-desc">Items: ${o.item} (Qty: ${o.quantity}) | Ref: ${o.ref}</span>
              </div>
              <span class="history-status status-pending">Pending</span>
            </div>
          `).join('');
        }
      }
    }
  }

  /* --- TABLE RESERVATION FORM --- */
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Auto fill name/email if user is logged in
    if (currentUser) {
      document.getElementById('book-name').value = `${currentUser.firstName} ${currentUser.lastName}`;
      document.getElementById('book-email').value = currentUser.email;
      if (currentUser.phone) {
        document.getElementById('book-phone').value = currentUser.phone;
      }
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('book-name').value.trim();
      const email = document.getElementById('book-email').value.trim();
      const phone = document.getElementById('book-phone').value.trim();
      const date = document.getElementById('book-date').value;
      const time = document.getElementById('book-time').value;
      const guests = document.getElementById('book-guests').value;
      const seating = document.getElementById('book-seating').value;
      const requests = document.getElementById('book-requests').value.trim();

      // Simple Validation
      if (!name || !email || !phone || !date || !time || !guests) {
        alert('All basic fields are required');
        return;
      }

      const bookingRef = 'HTB' + Math.floor(1000 + Math.random() * 9000);
      const newBooking = {
        name,
        email,
        phone,
        date,
        time,
        guests,
        seating,
        requests,
        ref: bookingRef
      };

      // Save to active session bookings list if logged in
      if (currentUser) {
        currentUser.bookings = currentUser.bookings || [];
        currentUser.bookings.unshift(newBooking); // Add to beginning
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Sync with primary users list
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (userIndex !== -1) {
          users[userIndex].bookings = currentUser.bookings;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }

      // Redirect to Confirmation with variables
      window.location.href = `confirmation.html?type=booking&ref=${bookingRef}&date=${date}&time=${time}&guests=${guests}`;
    });
  }

  /* --- ONLINE ORDER FORM --- */
  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
      document.getElementById('order-name').value = `${currentUser.firstName} ${currentUser.lastName}`;
      document.getElementById('order-email').value = currentUser.email;
      if (currentUser.phone) {
        document.getElementById('order-phone').value = currentUser.phone;
      }
    }

    // Prefill menu item selection if passed in query string (e.g. from Menu quick add)
    const urlParams = new URLSearchParams(window.location.search);
    const selectedItem = urlParams.get('item');
    if (selectedItem) {
      const itemDropdown = document.getElementById('order-item');
      if (itemDropdown) {
        // Match selection by value/text
        for (let i = 0; i < itemDropdown.options.length; i++) {
          if (itemDropdown.options[i].value.toLowerCase().includes(selectedItem.toLowerCase())) {
            itemDropdown.selectedIndex = i;
            break;
          }
        }
      }
    }

    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('order-name').value.trim();
      const phone = document.getElementById('order-phone').value.trim();
      const email = document.getElementById('order-email').value.trim();
      const orderType = document.querySelector('input[name="order-type"]:checked').value;
      const item = document.getElementById('order-item').value;
      const quantity = document.getElementById('order-qty').value;
      const instructions = document.getElementById('order-instructions').value.trim();
      const time = document.getElementById('order-time').value;

      if (!name || !phone || !email || !item || !time) {
        alert('All fields are required');
        return;
      }

      const orderRef = 'HTO' + Math.floor(1000 + Math.random() * 9000);
      const currentDate = new Date().toLocaleDateString('en-ZA');

      const newOrder = {
        name,
        phone,
        email,
        type: orderType,
        item,
        quantity,
        instructions,
        time,
        date: currentDate,
        ref: orderRef
      };

      // Save to user history if logged in
      if (currentUser) {
        currentUser.orders = currentUser.orders || [];
        currentUser.orders.unshift(newOrder);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Sync with primary users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (userIndex !== -1) {
          users[userIndex].orders = currentUser.orders;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }

      window.location.href = `confirmation.html?type=order&ref=${orderRef}&time=${time}&type_desc=${orderType}&item=${encodeURIComponent(item)}&qty=${quantity}`;
    });
  }

  /* --- CONTACT FORM VALIDATION --- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const subject = document.getElementById('contact-subject');
      const message = document.getElementById('contact-message');

      let isValid = true;
      [name, email, subject, message].forEach(clearError);

      if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
      }
      if (!email.value.trim() || !validateEmail(email.value)) {
        showError(email, 'Provide a valid email address');
        isValid = false;
      }
      if (!subject.value.trim()) {
        showError(subject, 'Subject is required');
        isValid = false;
      }
      if (!message.value.trim()) {
        showError(message, 'Message cannot be empty');
        isValid = false;
      }

      if (!isValid) return;

      // Visual feedback success
      alert('Thank you for contacting Harbour Table. Your message has been sent successfully. We will get back to you soon.');
      contactForm.reset();
    });
  }

  /* --- NEWSLETTER SUBMIT --- */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input && input.value.trim() && validateEmail(input.value.trim())) {
        alert('Thank you for subscribing to our newsletter! Enjoy exclusive updates.');
        input.value = '';
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }
}
