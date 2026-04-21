// Background Particle Effects (Subtle Digital nodes)
const canvas = document.getElementById('particles-canvas');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        // Also need to re-evaluate particle amount on resize, but this is simple version
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            // Cyberpunk / Blue-cyan colors for tech theme
            this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(112, 0, 255, 0.3)';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > width || this.x < 0) this.speedX *= -1;
            if (this.y > height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const numParticles = Math.min(100, Math.floor(width * height / 10000));
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Draw connecting lines between close particles
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 - distance/1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
}

// Contact Modal Logic
const contactBtn = document.getElementById('contact-btn');
const contactModal = document.getElementById('contact-modal');
const closeModal = document.getElementById('close-modal');

if (contactBtn && contactModal) {
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    const close = () => {
        contactModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    closeModal.addEventListener('click', close);

    // Close on overlay click
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            close();
        }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            close();
        }
    });
}

// Notify Me Form Logic
const notifyForm = document.getElementById('notify-form');
const notifySuccess = document.getElementById('notify-success');

if (notifyForm && notifySuccess) {
    notifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = notifyForm.querySelector('input').value;
        const submitBtn = notifyForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        if (email) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch("https://formspree.io/f/xaqlaqwy", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: email })
                });
                
                if (response.ok) {
                    notifyForm.classList.add('hidden');
                    notifySuccess.classList.remove('hidden');
                    // Hide the text label above the form too
                    const label = document.querySelector('.notify-text');
                    if (label) label.classList.add('hidden');
                } else {
                    alert("Oops! There was a problem submitting the form. Please try again.");
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                alert("Oops! There was a problem submitting the form. Please check your connection.");
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    });
}

// Language Switcher Toggle Logic
document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('.lang-btn');
    if (langBtn) {
        const lang = langBtn.getAttribute('data-lang');
        localStorage.setItem('preferredLang', lang);
        
        const currentPath = window.location.pathname;
        const isQuotePage = currentPath.includes('quote.html');
        const isQuoteFrPage = currentPath.includes('quote-fr.html');
        const isFrPage = currentPath.includes('fr.html') || currentPath.endsWith('/fr');
        
        if (lang === 'fr') {
            if (isQuotePage) {
                window.location.href = 'quote-fr.html';
            } else if (!isFrPage && !isQuoteFrPage) {
                window.location.href = 'fr.html';
            }
        } else if (lang === 'en') {
            if (isQuoteFrPage) {
                window.location.href = 'quote.html';
            } else if (isFrPage) {
                window.location.href = 'index.html';
            }
        }
    }
});


