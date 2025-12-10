document.addEventListener('DOMContentLoaded', () => {

    // --- "Cybernetic Flow Field" Animation ---
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Mouse Interaction
    let mouse = { x: 0, y: 0, active: false };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    // Configuration
    const particleCount = 2000; // Dense field
    const flowScale = 0.005;    // Scale of the noise (zoom level)
    const speed = 1.5;
    const fadeRate = 0.05;      // Trail length (lower = longer)

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = 0;
            this.vy = 0;
            this.history = [];
            this.maxHistory = 5;
            // Distinct colors: Cyan, Magenta, White mix
            this.hue = Math.random() > 0.5 ? 180 : 300;
        }

        update() {
            // Simple pseudo-noise flow direction
            // Angle based on position + time
            const angle = (Math.cos(this.x * flowScale) + Math.sin(this.y * flowScale)) * Math.PI;

            // Mouse Influence (Repel/Swirl)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            // Add Flow Velocity
            this.vx += Math.cos(angle) * 0.1;
            this.vy += Math.sin(angle) * 0.1;

            // Mouse Push
            if (dist < 300) {
                const force = (300 - dist) / 300;
                this.vx -= (dx / dist) * force * 0.5;
                this.vy -= (dy / dist) * force * 0.5;
            }

            // Cap Speed
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentSpeed > speed) {
                this.vx = (this.vx / currentSpeed) * speed;
                this.vy = (this.vy / currentSpeed) * speed;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Wrap around screen
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 0.8)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Init Particles
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        // Create Trail Effect
        // Instead of clearRect, we draw a semi-transparent black rectangle
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeRate})`;
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();


    // --- Advanced Scroll Reveal ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.project-card, .section-title, .hero-content > *');

    revealElements.forEach((el, index) => {
        el.classList.add('reveal-up');
        if (el.classList.contains('project-card')) {
            el.style.transitionDelay = `${(index % 3) * 100}ms`;
        }
        observer.observe(el);
    });
});
