document.addEventListener('DOMContentLoaded', () => {
    const siteHeader = document.getElementById('siteHeader');
    const scrollProgress = document.getElementById('scrollProgress');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mainContent = document.getElementById('main');
    const siteFooter = document.querySelector('.site-footer');
    const brand = document.querySelector('.brand');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scrollTicking = false;

    const updateScroll = () => {
        const scrollTop = window.scrollY;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        siteHeader.classList.toggle('is-scrolled', scrollTop > 24);
        scrollProgress.style.transform = `scaleX(${scrollable > 0 ? scrollTop / scrollable : 0})`;
        scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(updateScroll);
            scrollTicking = true;
        }
    }, { passive: true });
    updateScroll();

    const setMenu = (open, returnFocus = false) => {
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
        mobileMenu.setAttribute('aria-hidden', String(!open));
        mobileMenu.inert = !open;
        mobileMenu.classList.toggle('is-open', open);
        document.body.classList.toggle('menu-open', open);
        mainContent.inert = open;
        siteFooter.inert = open;

        if (open) {
            mobileMenu.querySelector('a').focus();
        } else if (returnFocus) {
            menuToggle.focus();
        }
    };

    menuToggle.addEventListener('click', () => {
        setMenu(menuToggle.getAttribute('aria-expanded') !== 'true', true);
    });

    document.addEventListener('keydown', (event) => {
        const menuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        if (event.key === 'Escape' && menuOpen) {
            setMenu(false, true);
        }
        if (event.key === 'Tab' && menuOpen) {
            const focusable = [brand, menuToggle, ...mobileMenu.querySelectorAll('a')];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    window.matchMedia('(min-width: 981px)').addEventListener('change', (event) => {
        if (event.matches && menuToggle.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', () => {
            if (menuToggle.getAttribute('aria-expanded') === 'true') {
                setMenu(false);
            }
        });
    });

    const revealElements = document.querySelectorAll('.reveal');
    if (!reducedMotion && 'IntersectionObserver' in window) {
        revealElements.forEach((element) => element.classList.add('will-reveal'));
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -45px 0px' });
        revealElements.forEach((element) => revealObserver.observe(element));
    }

    const navLinks = document.querySelectorAll('.desktop-nav a');
    const sections = document.querySelectorAll('main section[id]');
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    const active = link.getAttribute('href') === `#${id}`;
                    link.classList.toggle('is-active', active);
                    if (active) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-22% 0px -62% 0px', threshold: 0 });
        sections.forEach((section) => sectionObserver.observe(section));
    }

    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card[data-category]');
    const compactGrid = document.querySelector('.compact-grid');
    const projectCount = document.getElementById('projectCount');

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            let visibleCount = 0;

            filterButtons.forEach((item) => {
                const active = item === button;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-pressed', String(active));
            });

            projectCards.forEach((card) => {
                const categories = card.dataset.category.split(' ');
                const visible = filter === 'all' || categories.includes(filter);
                card.hidden = !visible;
                if (visible) visibleCount += 1;
            });

            compactGrid.hidden = ![...compactGrid.children].some((card) => !card.hidden);
            projectCount.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? '' : 's'}`;
        });
    });

    document.querySelectorAll('.case-details').forEach((details) => {
        details.addEventListener('toggle', () => {
            if (!details.open) return;
            const iframe = details.querySelector('iframe[data-src]');
            if (iframe) {
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
            }
        });
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCount = document.getElementById('lightboxCount');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = [...document.querySelectorAll('.gallery-item')];
    let currentImage = 0;

    const showImage = (index) => {
        currentImage = (index + galleryItems.length) % galleryItems.length;
        const item = galleryItems[currentImage];
        const image = item.querySelector('img');
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightboxCaption.textContent = item.dataset.caption;
        lightboxCount.textContent = `${String(currentImage + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
    };

    const openLightbox = (index) => {
        showImage(index);
        lightbox.showModal();
        document.body.classList.add('lightbox-open');
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', () => lightbox.close());
    lightboxPrev.addEventListener('click', () => showImage(currentImage - 1));
    lightboxNext.addEventListener('click', () => showImage(currentImage + 1));
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('close', () => {
        document.body.classList.remove('lightbox-open');
    });
    document.addEventListener('keydown', (event) => {
        if (!lightbox.open) return;
        if (event.key === 'ArrowLeft') showImage(currentImage - 1);
        if (event.key === 'ArrowRight') showImage(currentImage + 1);
    });

    const toast = document.getElementById('toast');
    let toastTimer;
    const showToast = (message) => {
        window.clearTimeout(toastTimer);
        toast.textContent = message;
        toast.classList.add('is-visible');
        toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
    };

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const message = document.getElementById('formMessage').value.trim();
        if (!name || !email || !message) return;

        const subject = encodeURIComponent(`Portfolio contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:Caseycapilitangt@gmail.com?subject=${subject}&body=${body}`;
        showToast('Opening your email app…');
    });

    const copyEmail = document.getElementById('copyEmail');
    copyEmail.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('Caseycapilitangt@gmail.com');
            showToast('Email address copied.');
        } catch {
            showToast('Email: Caseycapilitangt@gmail.com');
        }
    });
});
