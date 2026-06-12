// Mobile Menu Toggle Function
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lightweight analytics helper (works with or without gtag)
function trackEvent(eventName, params = {}) {
    try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: eventName,
            ...params
        });

        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }
    } catch (e) {
        // No-op to avoid breaking UX if tracking is unavailable
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (nav && !nav.contains(event.target)) {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (menuToggle) {
            menuToggle.classList.remove('active');
        }
    }
});

// Close menu when clicking a link
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            const navMenu = document.getElementById('navMenu');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
        });
    });

    trackEvent('page_view', {
        page_path: window.location.pathname,
        page_title: document.title
    });
});

// Global CTA + WhatsApp click tracking
document.addEventListener('click', function (event) {
    const target = event.target.closest('a,button');
    if (!target) return;

    const href = target.getAttribute('href') || '';
    const text = (target.textContent || '').trim().toLowerCase();

    if (href.includes('wa.me')) {
        trackEvent('whatsapp_click', {
            page_path: window.location.pathname,
            cta_text: target.textContent.trim()
        });
        return;
    }

    if (
        href.includes('booking.html') ||
        href === '/booking' ||
        href.startsWith('/booking?') ||
        href.startsWith('/booking#') ||
        text.includes('book free consultation') ||
        text.includes('schedule a consultation')
    ) {
        trackEvent('book_cta_click', {
            page_path: window.location.pathname,
            cta_text: target.textContent.trim()
        });
    }
});

// Form submission tracking
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function () {
            trackEvent('form_submit', {
                page_path: window.location.pathname,
                form_id: form.id || 'unknown_form'
            });
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (!header) return;
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Premium motion, counters, and gallery controls
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('page-ready');

    document.querySelectorAll('img').forEach((img) => {
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        if (!img.closest('.hero') && !img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });

    const animatedElements = document.querySelectorAll([
        '.section-header',
        '.service-card',
        '.portfolio-item',
        '.value-card',
        '.process-step',
        '.why-item',
        '.contact-card',
        '.booking-card',
        '.consultation-step',
        '.consultation-type-card',
        '.preparation-card',
        '.category-card',
        '.testimonial-card',
        '.ceo-content',
        '.about-content',
        '.location-card',
        '.faq-item'
    ].join(','));

    animatedElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
        if (prefersReducedMotion) {
            el.classList.add('is-visible');
        } else {
            observer.observe(el);
        }
    });

    initCounters();
    initPortfolioFilters();
    initParallax();
});

function initCounters() {
    const counters = document.querySelectorAll('.stat-item h2');
    if (!counters.length) return;

    const runCounter = (counter) => {
        if (counter.dataset.counted === 'true') return;
        counter.dataset.counted = 'true';

        const original = counter.textContent.trim();
        const match = original.match(/(\d+)/);
        if (!match || prefersReducedMotion) {
            counter.classList.add('counter-done');
            return;
        }

        const target = Number(match[1]);
        const suffix = original.replace(match[1], '');
        const duration = 1200;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = `${Math.round(target * eased)}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                counter.textContent = original;
                counter.classList.add('counter-done');
            }
        };

        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.45 });

    counters.forEach((counter) => counterObserver.observe(counter));
}

function detectPortfolioCategory(item) {
    const text = `${item.textContent} ${item.querySelector('img')?.alt || ''}`.toLowerCase();
    if (item.classList.contains('instagram-item')) return 'featured';
    if (text.includes('kitchen') || text.includes('dining')) return 'kitchen';
    if (text.includes('bedroom') || text.includes('suite') || text.includes('wardrobe')) return 'bedroom';
    if (text.includes('office') || text.includes('commercial')) return 'commercial';
    if (text.includes('bathroom') || text.includes('spa')) return 'bathroom';
    return 'living';
}

function initPortfolioFilters() {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid || grid.dataset.filtersReady === 'true') return;

    const items = Array.from(grid.querySelectorAll('.portfolio-item'));
    if (items.length < 6) return;

    const categories = [
        ['all', 'All Projects'],
        ['living', 'Living'],
        ['bedroom', 'Bedrooms'],
        ['kitchen', 'Kitchen & Dining'],
        ['bathroom', 'Bathrooms'],
        ['commercial', 'Commercial'],
        ['featured', 'Instagram']
    ];

    items.forEach((item) => {
        item.dataset.category = item.dataset.category || detectPortfolioCategory(item);
    });

    const bar = document.createElement('div');
    bar.className = 'portfolio-filter-bar';
    bar.setAttribute('aria-label', 'Filter portfolio projects');

    categories.forEach(([id, label], index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `portfolio-filter-btn${index === 0 ? ' is-active' : ''}`;
        button.textContent = label;
        button.dataset.filter = id;
        button.addEventListener('click', () => {
            bar.querySelectorAll('.portfolio-filter-btn').forEach((btn) => btn.classList.remove('is-active'));
            button.classList.add('is-active');

            items.forEach((item) => {
                const show = id === 'all' || item.dataset.category === id;
                item.classList.toggle('is-hidden', !show);
            });

            trackEvent('portfolio_filter_click', {
                page_path: window.location.pathname,
                filter: id
            });
        });
        bar.appendChild(button);
    });

    grid.parentNode.insertBefore(bar, grid);
    grid.dataset.filtersReady = 'true';
}

function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero || prefersReducedMotion) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const offset = Math.min(window.scrollY * 0.12, 80);
            hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
            ticking = false;
        });
    }, { passive: true });
}

/* =============================
   PORTFOLIO LIGHTBOX SYSTEM
============================= */

// Lightbox functionality
let currentLightboxIndex = 0;
let portfolioItems = [];

function openLightbox(element) {
    portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    const lightbox = document.getElementById('lightbox');
    const img = element.querySelector('img');
    const title = element.querySelector('.portfolio-overlay h3').textContent;
    const description = element.querySelector('.portfolio-overlay p').textContent;

    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-title').textContent = title;
    document.getElementById('lightbox-description').textContent = description;

    currentLightboxIndex = portfolioItems.indexOf(element);
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    trackEvent('portfolio_lightbox_open', {
        page_path: window.location.pathname,
        item_title: title
    });
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function changeLightboxImage(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex >= portfolioItems.length) {
        currentLightboxIndex = 0;
    }
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = portfolioItems.length - 1;
    }

    const currentItem = portfolioItems[currentLightboxIndex];
    const img = currentItem.querySelector('img');
    const title = currentItem.querySelector('.portfolio-overlay h3').textContent;
    const description = currentItem.querySelector('.portfolio-overlay p').textContent;

    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-title').textContent = title;
    document.getElementById('lightbox-description').textContent = description;
}

// Close lightbox with Escape key and navigate with arrow keys
document.addEventListener('keydown', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'flex') {
        if (event.key === 'Escape') {
            closeLightbox();
        }
        if (event.key === 'ArrowLeft') {
            changeLightboxImage(-1);
        }
        if (event.key === 'ArrowRight') {
            changeLightboxImage(1);
        }
    }
});

// Close lightbox when clicking outside the image
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }
});
