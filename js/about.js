// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Function to animate numbers
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 20);
    }
    
    // Intersection Observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target;
                const target = parseInt(numberElement.getAttribute('data-count'));
                animateCounter(numberElement, target);
                statsObserver.unobserve(numberElement);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe all stat numbers
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Animate creator card on scroll
    const creatorCard = document.querySelector('.creator-card');
    const creatorQuote = document.querySelector('.creator-quote');
    
    const creatorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Add initial styles and observe
    if (creatorCard) {
        creatorCard.style.opacity = '0';
        creatorCard.style.transform = 'translateY(30px)';
        creatorCard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        creatorObserver.observe(creatorCard);
    }
    
    if (creatorQuote) {
        creatorQuote.style.opacity = '0';
        creatorQuote.style.transform = 'translateY(30px)';
        creatorQuote.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
        creatorObserver.observe(creatorQuote);
    }
    
    // Feature cards animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        featureObserver.observe(card);
    });
    
    // Mission/Vision cards animation
    const missionCards = document.querySelectorAll('.mission-card, .vision-card');
    missionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(' + (index === 0 ? '-30px' : '30px') + ')';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.1 });
        
        cardObserver.observe(card);
    });
    
    // Skill tags hover effect
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Social links animation
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(5deg) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0) scale(1)';
        });
    });
    
    // Photo placeholder fallback
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    if (photoPlaceholder) {
        // Add a nice animation for the placeholder
        photoPlaceholder.style.transition = 'all 0.5s ease';
        
        // Add pulsing animation to placeholder icon
        const icon = photoPlaceholder.querySelector('i');
        setInterval(() => {
            icon.style.transform = 'scale(1.1)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 500);
        }, 2000);
    }
    
    // CTA button hover effects
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(15deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(0)';
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Ctrl + A to scroll to about section (though we're already on about page)
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Ctrl + C to scroll to creator section
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            const creatorSection = document.querySelector('.creator-section');
            if (creatorSection) {
                creatorSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Add smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Log page view
    console.log('About page loaded successfully!');
    console.log('Creator: Arpit Sharma');
    console.log('Contact: arpit18sharma2002@gmail.com');
});

// Fix for creator photo loading issue
const creatorImage = document.getElementById('creatorImage');
const photoPlaceholder = document.getElementById('photoPlaceholder');

if (creatorImage) {
    // Hide placeholder initially
    if (photoPlaceholder) {
        photoPlaceholder.style.display = 'none';
    }
    
    // Check if image loads successfully
    creatorImage.onload = function() {
        console.log('Creator image loaded successfully');
        if (photoPlaceholder) {
            photoPlaceholder.style.display = 'none';
        }
        creatorImage.style.display = 'block';
    };
    
    creatorImage.onerror = function() {
        console.log('Creator image failed to load, showing placeholder');
        if (photoPlaceholder) {
            photoPlaceholder.style.display = 'flex';
        }
        creatorImage.style.display = 'none';
    };
    
    // Trigger error check if src is empty
    if (!creatorImage.src || creatorImage.src === window.location.href) {
        creatorImage.onerror();
    }
}