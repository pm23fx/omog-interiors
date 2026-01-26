// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
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
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards and portfolio items
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .value-card, .process-step, .why-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

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
