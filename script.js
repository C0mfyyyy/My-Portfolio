/* ========================================
   Casey Chaw Capilitan — Portfolio Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // === Custom Cursor ===
    const cursorDot = document.getElementById('cursorDot');
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX - 4 + 'px';
            cursorDot.style.top = e.clientY - 4 + 'px';
            cursorDot.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('active');
        });

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .gallery-item, .tag');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
        });
    }

    // === Navigation Scroll Effect ===
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // === Mobile Menu Toggle ===
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // === Scroll Reveal ===
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // === Gallery Lightbox ===
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImgIndex = 0;
    const galleryImages = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        galleryImages.push(img.src);

        item.addEventListener('click', () => {
            currentImgIndex = index;
            openLightbox(img.src, img.alt);
        });
    });

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImgIndex];
    }

    function showNext() {
        currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImgIndex];
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // === Contact Form ===
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const message = document.getElementById('formMessage').value.trim();

        if (!name || !email || !message) return;

        // Open mailto link with form data
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.open(`mailto:Caseycapilitangt@gmail.com?subject=${subject}&body=${body}`);

        showToast('Opening your email client...');
        contactForm.reset();
    });

    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // === Smooth scroll for nav links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === Active nav link highlight ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + id) {
                        link.style.color = 'var(--color-accent)';
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });

    sections.forEach(section => sectionObserver.observe(section));

});