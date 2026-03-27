// ── Main logic to be run after components are loaded
function initializeMainLogic() {
    // ── Progress fill animation
    setTimeout(() => {
        const fill = document.getElementById('progressFill');
        if (fill) fill.style.width = '46%';
    }, 500);

    // ── Scroll Reveal
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));

    // ── Preload Hero Image
    const img = new Image();
    img.src = 'Inspo Asset/Hero section Png.png';

    // ── Navbar adaptive color on scroll
    initNavbarAdaptiveColor();

    // ── Glowing effect
    if (typeof initGlowingEffect !== 'undefined') {
        initGlowingEffect();
    }

    // ── Unique Testimonials Animation
    initUniqueTestimonials();

    console.log('Main logic initialized');
}

// ── Unique Testimonial Component Logic
function initUniqueTestimonials() {
    const pills = document.querySelectorAll('.unique-avatar-pill');
    const quotes = document.querySelectorAll('.unique-quote');
    const roles = document.querySelectorAll('.unique-role');
    let isAnimating = false;

    if (!pills.length || !quotes.length || !roles.length) return;

    pills.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (isAnimating || btn.classList.contains('active')) return;
            const index = btn.getAttribute('data-index');

            isAnimating = true;

            // Trigger exit animations immediately for active elements
            quotes.forEach(q => {
                if (q.classList.contains('active')) {
                    q.classList.remove('active');
                    q.classList.add('exiting');
                }
            });
            roles.forEach(r => {
                if (r.classList.contains('active')) {
                    r.classList.remove('active');
                    r.classList.add('exiting');
                }
            });

            // Delay arriving element until exiting is semi-complete
            setTimeout(() => {
                // Clear old states fully
                quotes.forEach(q => q.classList.remove('exiting'));
                roles.forEach(r => r.classList.remove('exiting'));
                pills.forEach(p => p.classList.remove('active'));

                // Activate new ones
                btn.classList.add('active');

                const targetQuote = document.querySelector(`.unique-quote[data-index="${index}"]`);
                if (targetQuote) targetQuote.classList.add('active');

                const targetRole = document.querySelector(`.unique-role[data-index="${index}"]`);
                if (targetRole) targetRole.classList.add('active');

                // Finish animation lock
                setTimeout(() => {
                    isAnimating = false;
                }, 400); // Wait for entrance

            }, 200); // 200ms delay between exit and entrance
        });
    });
}

// ── Navbar adaptive color based on background
function initNavbarAdaptiveColor() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const hero = document.getElementById('hero');
    if (!hero) return;

    function updateNavColor() {
        const navBottom = nav.getBoundingClientRect().bottom;
        const heroBottom = hero.getBoundingClientRect().bottom;

        // When the navbar has scrolled past the hero section, switch to dark text
        if (navBottom >= heroBottom - 40) {
            nav.classList.add('nav-dark');
        } else {
            nav.classList.remove('nav-dark');
        }
    }

    // Run on scroll with requestAnimationFrame for smoothness
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavColor();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    updateNavColor();
}

// Export for component loader if needed
window.initializeMainLogic = initializeMainLogic;
