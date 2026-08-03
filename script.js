/* ==========================================================================
   AuraCare JS - Preloader, Interactivity, Carousel & Forms Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Disable scrolling while loading
    document.body.style.overflow = 'hidden';

    /* --------------------------------------------------------------------------
       1. PRELOADER & HERO ENTRANCE TIMER
       -------------------------------------------------------------------------- */
    const preloader = document.getElementById('preloader');
    
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            
            // Re-enable scrolling after loading
            document.body.style.overflow = '';
            
            // Trigger animation for elements in the hero section immediately
            triggerHeroAnimations();
        }
    }, 2500); // 2.5 Seconds loader timer

    function triggerHeroAnimations() {
        const heroElements = document.querySelectorAll('#home .fade-in-element');
        heroElements.forEach(el => {
            el.classList.add('visible');
        });
    }

    /* --------------------------------------------------------------------------
       2. SCROLL HEADER BLUR & STICKY STATUS
       -------------------------------------------------------------------------- */
    const header = document.getElementById('header');
    
    function checkHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll(); // Run once at launch

    /* --------------------------------------------------------------------------
       3. MOBILE NAVIGATION DRAWER & hamburger TRANSITIONS
       -------------------------------------------------------------------------- */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerClose = document.getElementById('drawer-close');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        menuToggle.classList.add('open');
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock main scroll
    }

    function closeDrawer() {
        menuToggle.classList.remove('open');
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock main scroll
    }

    menuToggle.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer upon clicking any navigation link
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    /* --------------------------------------------------------------------------
       4. SCROLL INTERSECTION OBSERVING FOR ANIMATIONS & STATS COUNTING
       -------------------------------------------------------------------------- */
    const animatedElements = document.querySelectorAll('.fade-in-element:not(#home .fade-in-element)');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    // Fade-in observer
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                elementObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        elementObserver.observe(element);
    });

    // Stats counter observer
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateNumbers();
                statsAnimated = true;
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    if (statNumbers.length > 0) {
        // Observe parent section containing numbers
        const statsSection = document.querySelector('.stats-section');
        statsObserver.observe(statsSection);
    }

    // Number counting animator
    function animateNumbers() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds animation
            const stepTime = 30; // speed threshold
            const step = target / (duration / stepTime);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }

    /* --------------------------------------------------------------------------
       5. ACTIVE SCROLL LINK SELECTION FOR DESKTOP NAVIGATION
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNavLink() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) + 10);
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    /* --------------------------------------------------------------------------
       6. TESTIMONIALS SLIDER / CAROUSEL SYSTEM
       -------------------------------------------------------------------------- */
    const carousel = document.getElementById('testimonials-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-card');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let slideInterval;

        // Populate slider dots indicator
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            
            // Translate slide wrapper
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Set active dot
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        // Autoplay logic
        function startAutoplay() {
            slideInterval = setInterval(nextSlide, 7000); // Slide every 7 seconds
        }

        function resetAutoplay() {
            clearInterval(slideInterval);
            startAutoplay();
        }

        startAutoplay();

        // Support swipe / drag navigation for mobile/tablet screens
        let startX = 0;
        let endX = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const threshold = 50; // min swipe distance in px
            if (startX - endX > threshold) {
                // Swiped Left
                nextSlide();
                resetAutoplay();
            } else if (endX - startX > threshold) {
                // Swiped Right
                prevSlide();
                resetAutoplay();
            }
        }
    }

    /* --------------------------------------------------------------------------
       7. FORM VALIDATION & TOAST FEEDBACK NOTIFICATION
       -------------------------------------------------------------------------- */
    const appointmentForm = document.getElementById('appointment-form');
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toast-close');
    let toastTimeout;

    if (appointmentForm) {
        // Elements to validate
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const phoneInput = document.getElementById('form-phone');
        const serviceInput = document.getElementById('form-service');
        const dateInput = document.getElementById('form-date');

        // Set minimum date to today to prevent booking in the past
        const today = new Date().toISOString().split('T')[0];
        if (dateInput) {
            dateInput.min = today;
        }

        // Real-time validation helper triggers
        const inputs = [nameInput, emailInput, phoneInput, serviceInput, dateInput];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => {
                    // Remove invalid status when typing/selecting again
                    const parent = input.closest('.form-group');
                    if (parent && parent.classList.contains('invalid')) {
                        validateField(input);
                    }
                });
            }
        });

        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            
            // Validate all inputs
            inputs.forEach(input => {
                if (input && !validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Mock submission animation/loading could go here
                showToast();
                appointmentForm.reset();
                // Clear validation statuses
                inputs.forEach(input => {
                    if (input) {
                        input.closest('.form-group').classList.remove('invalid');
                    }
                });
            } else {
                // Scroll smoothly to first invalid field
                const firstInvalid = appointmentForm.querySelector('.form-group.invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });

        // Individual field validator
        function validateField(input) {
            const parent = input.closest('.form-group');
            if (!parent) return true;

            const value = input.value.trim();
            let isValid = true;

            if (input.required && !value) {
                isValid = false;
            } else if (input.type === 'email' && value) {
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                isValid = emailPattern.test(value);
            } else if (input.type === 'tel' && value) {
                // Accepts basic phone characters/lengths: e.g. +1 (555) 000-0000 or general numbers
                const phonePattern = /^[+]?[0-9\s\-()]{7,18}$/;
                isValid = phonePattern.test(value);
            }

            if (!isValid) {
                parent.classList.add('invalid');
            } else {
                parent.classList.remove('invalid');
            }

            return isValid;
        }

        // Toast Feedback System
        function showToast() {
            clearTimeout(toastTimeout);
            toast.classList.add('show');
            
            // Auto dismiss toast after 6 seconds
            toastTimeout = setTimeout(hideToast, 6000);
        }

        function hideToast() {
            toast.classList.remove('show');
        }

        if (toastClose) {
            toastClose.addEventListener('click', hideToast);
        }
    }
});
