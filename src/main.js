// 
// Shivam Singhal - main.js Interactivity
// Custom Cursor, Particle Canvas, Scroll Indicators, Project tilt effects Style Transitions
//

import { 
    initHeroGlobe, 
    initFloatingArchitecture 
} from './three-scene.js';

document.addEventListener('DOMContentLoaded', () => {

    // ── 3D Scene Initialization ───────────────────────────────────────────────
    initHeroGlobe('hero-globe-canvas');
    initFloatingArchitecture('contact-canvas');

    const preloader = document.getElementById('preloader');
    const bootTerminal = document.getElementById('boot-terminal');
    if (preloader && bootTerminal) {
        document.body.style.overflow = 'hidden';
        const bootSequence = [
            "Initializing kernel modules...",
            "Loading neural engines...",
            "Bootstrapping DOM matrices...",
            "Mapping hardware IoT protocols...",
            "Bypassing mainframe security...",
            "Welcome to Shivam.OS (v1.0.0)",
            "Authentication: SUCCESS",
            "Launching interface..."
        ];

        let bootIteration = 0;
        function printBootLine() {
            if (bootIteration < bootSequence.length) {
                const line = document.createElement('div');
                line.className = 'boot-line';
                line.innerHTML = `[ <span style="color:#00bbf9">OK</span> ] ${bootSequence[bootIteration]}`;
                bootTerminal.appendChild(line);
                bootIteration++;
                setTimeout(printBootLine, Math.random() * 150 + 100);
            } else {
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    document.body.style.overflow = 'auto';
                    setTimeout(() => preloader.remove(), 1000);
                }, 400);
            }
        }
        setTimeout(printBootLine, 200);
    }

    // 1. --- Custom Cursor Logic ---
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        // Smooth lagging effect
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect for interactive elements
    const links = document.querySelectorAll('a, .btn, .bento-box, .project-card, .social-icon');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (cursor) {
                cursor.style.width = '50px';
                cursor.style.height = '50px';
                cursor.style.borderColor = 'var(--accent-secondary)';
                cursor.style.backgroundColor = 'rgba(0, 245, 212, 0.05)';
            }
        });
        link.addEventListener('mouseleave', () => {
            if (cursor) {
                cursor.style.width = '30px';
                cursor.style.height = '30px';
                cursor.style.borderColor = 'rgba(255,255,255,0.5)';
                cursor.style.backgroundColor = 'transparent';
            }
        });
    });
    // Move Orbs with mouse (Ambient Motion)
    const orbs = document.querySelectorAll('.glow-orb');
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.05;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.05;
        orbs.forEach((orb, index) => {
            const factor = (index + 1) * 0.4;
            orb.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
        });
    });

    // 2. --- Particle Canvas Background ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 2;
                this.alpha = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(138, 43, 226, ${this.alpha})`;
                ctx.fill();
                ctx.restore();
            }
        }

        const particleCount = 60;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Mouse interaction for canvas
        let mouseX = -1000;
        let mouseY = -1000;
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            // Connect neighboring particles
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();
                p1.draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < 120) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        const opacity = (1 - distance / 120) * 0.15;
                        ctx.strokeStyle = `rgba(0, 245, 212, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                        ctx.restore();
                    }
                }

                // Interactive Mouse Constellation Engine
                const distMouse = Math.hypot(p1.x - mouseX, p1.y - mouseY);
                if (distMouse < 200) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouseX, mouseY);
                    const opacityMouse = (1 - distMouse / 200) * 0.4;
                    ctx.strokeStyle = `rgba(138, 43, 226, ${opacityMouse})`;
                    ctx.lineWidth = 1;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#8a2be2';
                    ctx.stroke();
                    ctx.restore();
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // 3. --- Active State Update on Scroll ---
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));

    // 5. --- Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }
    });

    // 4. --- Smooth Entrance Scroll Effects with Stagger ---
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';

                // Trigger number counter if it has the class
                const numEl = entry.target.querySelector('.count-up');
                if (numEl && !numEl.classList.contains('counted')) {
                    numEl.classList.add('counted');
                    let startTimestamp = null;
                    const duration = 2000;
                    const endVal = parseInt(numEl.getAttribute('data-count'));

                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                        numEl.innerHTML = Math.floor(progress * endVal);
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            numEl.innerHTML = endVal;
                        }
                    };
                    window.requestAnimationFrame(step);
                }
            }
        });
    }, { threshold: 0.1 });

    const cardEntries = document.querySelectorAll('.project-card, .bento-box, .about-text');
    cardEntries.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(30px)';
        // add subtle stagger depending on natural order
        card.style.transition = `all 0.6s cubic-bezier(0.25, 1, 0.5, 1) ${Math.min(index * 0.1, 0.4)}s`;
        fadeObserver.observe(card);
    });

    // 5. --- Subtle Tilting & Spotlight Hover Grid ---
    const tiltContainers = document.querySelectorAll('.project-card, .bento-box');
    tiltContainers.forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xRotation = -5 * ((y - rect.height / 2) / (rect.height / 2));
            const yRotation = 5 * ((x - rect.width / 2) / (rect.width / 2));

            box.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) translateY(-5px)`;

            // Spotlight tracking Custom properties
            box.style.setProperty('--mouse-x', `${x}px`);
            box.style.setProperty('--mouse-y', `${y}px`);
        });

        box.addEventListener('mouseleave', () => {
            box.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // 6. --- Typewriter Effect for Hero Title ---
    const typewriter = document.getElementById('typewriter');
    if (typewriter) {
        const phrases = ["I craft high-impact systems.", "I build smart applications.", "I design Clean Architectures."];
        let i = 0;
        let letterCount = 0;
        let currentPhrase = "";
        let isDeleting = false;

        function typeLoop() {
            currentPhrase = phrases[i];
            typewriter.innerHTML = isDeleting
                ? currentPhrase.substring(0, letterCount--)
                : currentPhrase.substring(0, letterCount++);

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && letterCount === currentPhrase.length + 1) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && letterCount === 0) {
                isDeleting = false;
                i = (i + 1) % phrases.length;
                typeSpeed = 500; // Pause before next
            }

            setTimeout(typeLoop, typeSpeed);
        }

        setTimeout(typeLoop, 1000);
    }

    // 7. --- Copy email to clipboard on Contact Actions ---
    const emailBtn = document.querySelector('.btn-primary.btn-glow');
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText('shivamsinghal24@gmail.com').then(() => {
                const originalText = emailBtn.innerHTML;
                emailBtn.innerHTML = '<i class="fa-solid fa-check"></i> Email Copied!';
                emailBtn.style.background = 'linear-gradient(135deg, var(--accent-secondary), #00bbf9)';
                setTimeout(() => {
                    emailBtn.innerHTML = originalText;
                    emailBtn.style.background = 'linear-gradient(135deg, var(--accent-primary), var(--accent-subtle))';
                }, 2500);
            });
        });
    }

    // 8. --- Magnetic Buttons ---
    const magneticButtons = document.querySelectorAll('.btn');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            btn.classList.add('btn-magnetic');
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            setTimeout(() => btn.classList.remove('btn-magnetic'), 300); // Wait for transition before removing
        });
    });

    // 9. --- Hacker Text Scramble Effect ---
    const scrambleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
    const scramblers = document.querySelectorAll('.section-title, .project-card-title, .bento-label, .nav-item, .contact-title');
    scramblers.forEach(el => {
        // Prevent nesting child scrambling by targeting exact element structure or ignore if empty
        const originalText = el.innerText;
        el.dataset.value = originalText;

        el.addEventListener('mouseenter', () => {
            let iterations = 0;
            const val = el.dataset.value;
            const interval = setInterval(() => {
                el.innerText = val.split("").map((letter, index) => {
                    if (index < iterations) {
                        return val[index];
                    }
                    if (val[index] === ' ' || val[index] === '\n') return val[index];
                    return scrambleLetters[Math.floor(Math.random() * scrambleLetters.length)];
                }).join("");

                if (iterations >= val.length) {
                    clearInterval(interval);
                }
                iterations += 1;
            }, 30);
        });
    });

    // 10. --- Terminal Easter Egg Console ---
    const termInput = document.getElementById('terminal-input');
    const termHistory = document.getElementById('terminal-history');
    if (termInput && termHistory) {
        const commands = {
            'help': 'Available commands: help, whoami, projects, contact, clear, skills, sudo, hire, matrix',
            'whoami': 'Full Stack Developer & AI enthusiast.',
            'projects': 'Accessing Projects Portfolio...\n1. AI Interview Prep Platform\n2. Trekr (iOS/Swift)\n3. Weather Monitoring IoT',
            'contact': 'Let\'s connect! Email: shivamsinghal24@gmail.com | LinkedIn: /in/shivam-singhal-538369191/',
            'skills': 'Java, SpringBoot, C++, Swift, Next.js, Supabase, AI Integrations, Hardware IoT',
            'sudo': 'Permission denied: Recruiter level permissions required.',
            'hire': 'Validating hire status... SUCCESS. Candidate is a strong match. Processing offer letter protocols...',
        };

        document.querySelector('.terminal-container').addEventListener('click', () => {
            termInput.focus();
        });

        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = termInput.value.trim().toLowerCase();

                // Add user command to history
                const cmdLine = document.createElement('div');
                cmdLine.className = 'terminal-line';
                cmdLine.innerHTML = `<span class="term-prompt">guest@shivam:~$</span> <span class="term-cmd">${val}</span>`;
                termHistory.appendChild(cmdLine);

                if (val === 'clear') {
                    termHistory.innerHTML = '';
                } else if (val === 'matrix') {
                    const isMatrix = document.documentElement.getAttribute('data-theme') === 'matrix';
                    const outLine = document.createElement('div');
                    outLine.className = 'terminal-line output';

                    if (isMatrix) {
                        const base = localStorage.getItem('theme') || 'dark';
                        if (base === 'light') document.documentElement.setAttribute('data-theme', 'light');
                        else document.documentElement.removeAttribute('data-theme');
                        outLine.innerText = 'Matrix simulation terminated... standard operating procedures restored.';
                    } else {
                        document.documentElement.setAttribute('data-theme', 'matrix');
                        outLine.innerText = 'Wake up, Neo... Visualizing simulation. (Type "matrix" again to exit)';
                    }
                    termHistory.appendChild(outLine);
                } else if (val !== '') {
                    // Output response
                    const outLine = document.createElement('div');
                    outLine.className = 'terminal-line output';
                    const output = commands[val] || `Command not found: ${val}. Type 'help' for available commands.`;
                    outLine.innerText = output;
                    termHistory.appendChild(outLine);
                }

                termInput.value = '';
                termHistory.scrollTop = termHistory.scrollHeight;
            }
        });
    }

    // 11. --- Experience Tab Switcher ---
    const expTabs = document.querySelectorAll('.exp-tab');
    const expPanels = document.querySelectorAll('.exp-panel');

    expTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            expTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            expPanels.forEach(panel => {
                if (panel.id === `exp-${target}`) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // 12. --- Navbar scroll state ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 13. --- Hamburger Menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('mobile-open');
        });
        // Close mobile menu on nav link click
        navLinks.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('mobile-open');
            });
        });
    }

    // 14. --- Back to Top ---
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 15. --- What I'm Building Modal ---
    const buildingTrigger = document.getElementById('building-modal-trigger');
    const previewModal = document.getElementById('previewModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    if (buildingTrigger && previewModal) {
        // Open Modal
        buildingTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            previewModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        // Close Modal via X button
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                previewModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close Modal via outside click overlay
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                previewModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }

    // 16. --- Theme Toggle (Light/Dark Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');

            if (theme === 'light') {
                // Switch to Dark
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                // Switch to Light
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

});

// --- Final Mobile Responsiveness & Touch Support ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Prevent scroll when menu open
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Disable custom cursor on touch devices for accessibility
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
        document.body.classList.add('is-touch');
        const cursor = document.querySelector('.cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        if (cursor) cursor.style.display = 'none';
        if (cursorDot) cursorDot.style.display = 'none';
    }
});
