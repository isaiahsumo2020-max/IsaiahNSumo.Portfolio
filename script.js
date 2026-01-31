
// =================================================================
// BEQUIZZY N. SUMO PORTFOLIO - COMPLETE PRODUCTION JAVASCRIPT
// Includes: Theme System, Navigation, Animations, Bequizzy AI + Mini Teaser
// Vanilla JS | ES6+ | Production Ready | GitHub Pages Optimized
// =================================================================

class PortfolioApp {
    constructor() {
        this.isDark = false;
        this.init();
    }

    init() {
        this.loadTheme();
        this.bindNavigationEvents();
        this.initSmoothScrolling();
        this.initScrollAnimations();
        this.initAIAssistant();
    }

    // 🌙 THEME SYSTEM (Light/Dark Mode)
    loadTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
        this.isDark = savedTheme === 'dark';
        document.documentElement.classList.toggle('dark', this.isDark);
        this.updateThemeToggle();
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        document.documentElement.classList.toggle('dark', this.isDark);
        localStorage.setItem('portfolio-theme', this.isDark ? 'dark' : 'light');
        this.updateThemeToggle();
    }

    updateThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            const sun = toggle.querySelector('.fa-sun');
            const moon = toggle.querySelector('.fa-moon');
            sun.classList.toggle('hidden', this.isDark);
            moon.classList.toggle('hidden', !this.isDark);
        }
    }

    // 📱 MOBILE NAVIGATION
    bindNavigationEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile menu
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileBtn.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }

        // Close mobile menu on nav link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const mobileMenu = document.getElementById('mobile-menu');
                const mobileBtn = document.getElementById('mobile-menu-btn');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }
    }

    // 🎯 SMOOTH SCROLLING
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    const offsetTop = target.offsetTop - 90;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                        const mobileBtn = document.getElementById('mobile-menu-btn');
                        const icon = mobileBtn.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }

    // ✨ SCROLL ANIMATIONS (Intersection Observer)
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('section[id], .skill-card, .service-card, .project-card, .research-interest, .experience-item').forEach(el => {
            el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
            observer.observe(el);
        });
    }

    // ✉️ CONTACT FORM HANDLER
    handleContactForm(e) {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you within 24-48 hours. 🚀');
            e.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // 🤖 INITIALIZE AI ASSISTANT
    initAIAssistant() {
        this.ai = new BequizzyAI();
    }
}

// 🧠 BEQUIZZY AI - Professional Personal Assistant Class
class BequizzyAI {
    constructor() {
        this.knowledgeBase = this.initKnowledgeBase();
        this.conversationHistory = [];
        this.isTyping = false;
        this.teaserCycle = null;
        this.init();
    }

    initKnowledgeBase() {
        return {
            about: {
                intro: "Bequizzy N. Sumo is an Information Technology student specializing in Networking, System Administration, and Cybersecurity Awareness from Liberia.",
                background: "He holds a Diploma and WAEC Certificate, and is currently pursuing university-level IT studies. Bequizzy is passionate about building secure digital solutions for communities.",
                affiliations: "Youth Internet Governance Forum (YouthIGF) Liberia participant and Global Encryption Day attendee."
            },
            skills: {
                technical: "Networking fundamentals (subnetting, routing, troubleshooting), Linux & Windows system administration, Cybersecurity awareness, Web development (HTML/CSS/JavaScript), Graphic design (Adobe tools).",
                services: "IT support, website design, cybersecurity training, desktop publishing."
            },
            projects: {
                list: [
                    "InfoCheck Liberia – Digital information verification platform",
                    "School Management Web Application (concept) – Educational platform",
                    "Bequizzy de Blogger – Motivational blogging platform",
                    "Desktop publishing and freelance projects"
                ]
            },
            experience: {
                current: "IT Personnel at Curtis Professional Security Service",
                previous: "Isaiah Tech Solution Group, TQC Tech Solutions Group, freelance tech support",
                summary: "3+ years combining IT support, web development, and cybersecurity awareness."
            },
            research: {
                thesis: "Addressing Cybersecurity Vulnerabilities Through Youth-Centered Awareness and National Policy Measures for a Safer Digital Future in Liberia.",
                interests: "Cybersecurity policy, youth digital literacy, national ICT development."
            },
            availability: {
                general: "Bequizzy balances academic commitments with professional projects. Best reached via email or the contact form for collaborations."
            }
        };
    }

    init() {
        this.bindEvents();
        this.initMiniTeaser();
        this.showWidgetDelayed();
    }

    bindEvents() {
        // Main AI toggle button
        const toggleBtn = document.getElementById('ai-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleChat());
        }

        // Chat panel controls
        const chatPanel = document.getElementById('ai-chat-panel');
        const minimizeBtn = document.getElementById('ai-minimize-btn');
        const closeBtn = document.getElementById('ai-close-btn');
        const sendBtn = document.getElementById('ai-send-btn');
        const input = document.getElementById('ai-input');
        const quickBtns = document.querySelectorAll('.ai-quick-btn');
        const voiceBtn = document.getElementById('ai-voice-btn');

        if (minimizeBtn) minimizeBtn.addEventListener('click', () => this.minimizeChat());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeChat());
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        if (quickBtns) {
            quickBtns.forEach(btn => btn.addEventListener('click', (e) => this.handleQuickQuery(e.target.textContent)));
        }
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.showVoiceComingSoon());
        }

        // Navigation links in AI responses
        document.addEventListener('click', (e) => {
            if (e.target.matches('.ai-nav-link')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                this.minimizeChat();
            }
        });

        // Disclaimer modal
        const disclaimerContinue = document.getElementById('ai-disclaimer-continue');
        const disclaimerClose = document.getElementById('ai-disclaimer-close');
        if (disclaimerContinue) disclaimerContinue.addEventListener('click', () => {
            document.getElementById('ai-disclaimer-modal').classList.add('hidden');
        });
        if (disclaimerClose) disclaimerClose.addEventListener('click', () => {
            document.getElementById('ai-disclaimer-modal').classList.add('hidden');
        });
    }

    // 🔥 MINI AI TEASER SYSTEM (Pops every 10s for 40s)
    initMiniTeaser() {
        this.miniTeaser = document.getElementById('mini-ai-teaser');
        if (!this.miniTeaser) return;

        this.miniTeaser.addEventListener('click', () => {
            document.getElementById('ai-toggle-btn')?.click();
            this.miniTeaser.classList.add('hidden');
        });

        this.startTeaserCycle();
    }

    startTeaserCycle() {
        let showTimeout, hideTimeout;

        const showTeaser = () => {
            if (!this.miniTeaser) return;
            clearTimeout(hideTimeout);
            this.miniTeaser.classList.remove('hidden');
            this.miniTeaser.style.animation = 'miniAiSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            hideTimeout = setTimeout(() => {
                if (this.miniTeaser) {
                    this.miniTeaser.classList.add('hidden');
                    this.miniTeaser.style.animation = '';
                }
            }, 40000); // 40 seconds visible
        };

        const cycle = () => {
            clearTimeout(showTimeout);
            showTimeout = setTimeout(() => {
                const chatPanel = document.getElementById('ai-chat-panel');
                if (chatPanel && !chatPanel.classList.contains('hidden')) {
                    cycle(); // Restart if chat is open
                    return;
                }
                showTeaser();
            }, 10000); // 10 seconds interval
        };

        setTimeout(cycle, 3000); // Start after 3s page load
    }

    // 💬 CHAT INTERFACE
    toggleChat() {
        const panel = document.getElementById('ai-chat-panel');
        if (panel) {
            panel.classList.toggle('hidden');
            if (!panel.classList.contains('hidden')) {
                document.getElementById('ai-input').focus();
            }
        }
    }

    minimizeChat() {
        const panel = document.getElementById('ai-chat-panel');
        if (panel) panel.classList.add('hidden');
    }

    closeChat() {
        document.getElementById('bequizzy-ai-widget')?.classList.add('hidden');
        if (this.miniTeaser) this.miniTeaser.classList.add('hidden');
    }

    showWidgetDelayed() {
        setTimeout(() => {
            document.getElementById('bequizzy-ai-widget')?.classList.remove('hidden');
        }, 2000);
    }

    async sendMessage() {
        if (this.isTyping) return;
        
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';
        this.showTypingIndicator();

        const response = await this.generateResponse(message);
        this.removeTypingIndicator();
        this.addMessage(response, 'ai');
    }

    addMessage(text, sender) {
        const messages = document.getElementById('ai-messages');
        if (!messages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender === 'ai' ? 'ai-message-ai animate-fadeInUp' : 'ai-message-user animate-fadeInUp'}`;

        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="ai-avatar w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">
                    AI
                </div>
                <div class="bg-gradient-to-r from-purple-50/90 to-blue-50/90 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-200/50 dark:border-blue-500/30 rounded-2xl px-4 py-3 max-w-[85%]">
                    ${this.formatAIResponse(text)}
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="flex justify-end">
                    <div class="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-200/50 dark:border-purple-500/30 rounded-2xl px-4 py-3 max-w-[85%]">
                        <div class="text-sm text-gray-900 dark:text-white">${this.escapeHtml(text)}</div>
                    </div>
                </div>
            `;
        }

        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    formatAIResponse(text) {
        return text
            .replace(/#projects/gi, '<a href="#projects" class="ai-nav-link font-semibold text-blue-600 hover:text-blue-700 underline">Projects section</a>')
            .replace(/#contact/gi, '<a href="#contact" class="ai-nav-link font-semibold text-emerald-600 hover:text-emerald-700 underline">Contact section</a>')
            .replace(/#skills/gi, '<a href="#skills" class="ai-nav-link font-semibold text-purple-600 hover:text-purple-700 underline">Skills section</a>')
            .replace(/#about/gi, '<a href="#about" class="ai-nav-link font-semibold text-indigo-600 hover:text-indigo-700 underline">About section</a>')
            .replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messages = document.getElementById('ai-messages');
        if (!messages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai-typing flex items-center animate-fadeInUp';
        typingDiv.innerHTML = `
            <div class="ai-avatar w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">AI</div>
            <div class="bg-gradient-to-r from-purple-50/90 to-blue-50/90 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-200/50 dark:border-blue-500/30 rounded-2xl px-4 py-3 max-w-[85%] flex items-center space-x-2">
                <div class="typing-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">Bequizzy AI is typing...</span>
            </div>
        `;
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    removeTypingIndicator() {
        const typing = document.querySelector('.ai-typing');
        if (typing) typing.remove();
        this.isTyping = false;
    }

    // 🧠 AI KNOWLEDGE BASE RESPONSES
    async generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase().trim();

        // Who is Bequizzy?
        if (lowerMessage.includes('who') || lowerMessage.includes('bequizzy') || lowerMessage.includes('name')) {
            return `Bequizzy N. Sumo is an <strong>Information Technology student</strong> specializing in <strong>Networking</strong>, <strong>System Administration</strong>, and <strong>Cybersecurity Awareness</strong> based in Liberia.<br><br>
            He holds Diploma & WAEC certificates and participates in YouthIGF Liberia. Learn more in the #about section.`;
        }

        // Skills
        if (lowerMessage.includes('skill') || lowerMessage.includes('skills') || lowerMessage.includes('expertise')) {
            return `Bequizzy specializes in:<br>
            • <strong>Networking</strong> (subnetting, routing, troubleshooting)<br>
            • <strong>System Admin</strong> (Linux/Windows fundamentals)<br>
            • <strong>Cybersecurity</strong> awareness & policy<br>
            • <strong>Web Development</strong> (HTML/CSS/JS)<br>
            • <strong>Graphic Design</strong> (Adobe tools)<br><br>
            Detailed skills in #skills section.`;
        }

        // Projects
        if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio')) {
            return `Bequizzy's featured projects:<br>
            • <strong>InfoCheck Liberia</strong> – Information verification<br>
            • <strong>School Management App</strong> (concept)<br>
            • <strong>Bequizzy de Blogger</strong> – Blog platform<br><br>
            Explore all in #projects section.`;
        }

        // Experience
        if (lowerMessage.includes('experience') || lowerMessage.includes('job') || lowerMessage.includes('work')) {
            return `Bequizzy's experience (3+ years):<br>
            • <strong>Current:</strong> IT Personnel – Curtis Professional Security<br>
            • <strong>Previous:</strong> Isaiah Tech Solution Group, TQC Tech Solutions<br>
            • Freelance IT support & desktop publishing<br><br>
            Full timeline in #experience section.`;
        }

        // Research/Thesis
        if (lowerMessage.includes('research') || lowerMessage.includes('thesis') || lowerMessage.includes('study')) {
            return `Bequizzy's thesis research:<br>
            <strong>"Addressing Cybersecurity Vulnerabilities Through Youth-Centered Awareness and National Policy Measures for a Safer Digital Future in Liberia"</strong><br><br>
            Focus: Cybersecurity policy, youth digital literacy. See #research section.`;
        }

        // Contact/Availability
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
            return `To connect with Bequizzy, use the #contact form below.<br><br>
            He's available for IT consulting, web development, and cybersecurity discussions. Response within 24-48 hours.`;
        }

        // Default response
        return `Thank you for your interest! For specific details, please check the relevant sections or use the #contact form.<br><br>
        What would you like to know about Bequizzy? (skills, projects, research, availability)`;
    }

    handleQuickQuery(query) {
        const input = document.getElementById('ai-input');
        if (input) {
            input.value = query;
            this.sendMessage();
        }
    }

    showVoiceComingSoon() {
        this.addMessage('🎤 Voice input feature coming soon! Type your questions for now.', 'ai');
    }
}

// 🏁 INITIALIZE EVERYTHING
document.addEventListener('DOMContentLoaded', () => {
    // Inject critical CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }

        @keyframes miniAiSlideUp {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.9); }
            50% { opacity: 0.7; transform: translateX(-50%) translateY(-5px) scale(1.02); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }

        @keyframes typing {
            0%, 60%, 100% { transform: scale(1); }
            30% { transform: scale(1.2); }
        }
        .typing-dots { display: flex; gap: 4px; }
        .dot { width: 8px; height: 8px; background: #6b7280; border-radius: 50%; animation: typing 1.4s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        .ai-toggle-btn { box-shadow: 0 20px 25px -5px rgba(147, 51, 234, 0.4); }
        .mini-ai-teaser { animation: miniAiPulse 2s infinite; }
        @keyframes miniAiPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .mini-ai-teaser:hover { animation: none; }

        /* Mobile teaser positioning */
        @media (max-width: 768px) {
            #mini-ai-teaser {
                left: 50% !important;
                right: auto !important;
                transform: translateX(-50%) !important;
                bottom: -2rem !important;
                width: calc(100% - 2rem) !important;
                max-width: 280px;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);

    // Start portfolio
    new PortfolioApp();
});

// PWA Service Worker (Optional - GitHub Pages ready)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Silent fail
        });
    });
}






// // PORTFOLIO - PRODUCTION READY JAVASCRIPT
// // Modular structure prepared for future AI assistant integration
// // Author: Bequizzy N. Sumo Portfolio System

// class PortfolioApp {
//     constructor() {
//         this.init();
//     }


//     // 🌙 Theme Management (Light/Dark Mode)
//     loadTheme() {
//         const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
//         const isDark = savedTheme === 'dark';
        
//         document.documentElement.classList.toggle('dark', isDark);
//         this.updateThemeToggle(isDark);
//     }

//     bindEvents() {
//         // Theme toggle
//         document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
//         // Mobile menu
//         document.getElementById('mobile-menu-btn').addEventListener('click', () => this.toggleMobileMenu());
//         document.querySelectorAll('.nav-link').forEach(link => {
//             link.addEventListener('click', () => this.closeMobileMenu());
//         });
        
//         // Contact form
//         document.getElementById('contact-form').addEventListener('submit', (e) => this.handleContactForm(e));
        
//         // Smooth scroll for nav links
//         document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//             anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
//         });
//     }

//     toggleTheme() {
//         const isDark = document.documentElement.classList.toggle('dark');
//         localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
//         this.updateThemeToggle(isDark);
//     }

//     updateThemeToggle(isDark) {
//         const toggle = document.getElementById('theme-toggle');
//         toggle.querySelector('.fa-sun').classList.toggle('hidden', isDark);
//         toggle.querySelector('.fa-moon').classList.toggle('hidden', !isDark);
//     }

//     // 📱 Mobile Menu
//     toggleMobileMenu() {
//         const menu = document.getElementById('mobile-menu');
//         const btn = document.getElementById('mobile-menu-btn');
        
//         menu.classList.toggle('hidden');
//         btn.querySelector('i').classList.toggle('fa-bars');
//         btn.querySelector('i').classList.toggle('fa-times');
//     }

//     closeMobileMenu() {
//         const menu = document.getElementById('mobile-menu');
//         const btn = document.getElementById('mobile-menu-btn');
//         menu.classList.add('hidden');
//         btn.querySelector('i').classList.remove('fa-times');
//         btn.querySelector('i').classList.add('fa-bars');
//     }

//     // 🎯 Smooth Scrolling with Offset
//     initSmoothScroll() {
//         document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//             anchor.addEventListener('click', function (e) {
//                 e.preventDefault();
//                 const target = document.querySelector(this.getAttribute('href'));
//                 if (target) {
//                     const offsetTop = target.offsetTop - 80; // Account for sticky nav
//                     window.scrollTo({
//                         top: offsetTop,
//                         behavior: 'smooth'
//                     });
//                 }
//             });
//         });
//     }

//     handleAnchorClick(e) {
//         e.preventDefault();
//         const href = this.getAttribute('href');
//         const target = document.querySelector(href);
//         if (target) {
//             const offsetTop = target.offsetTop - 80;
//             window.scrollTo({
//                 top: offsetTop,
//                 behavior: 'smooth'
//             });
//             this.closeMobileMenu();
//         }
//     }

//     // 👁️ Intersection Observer for Animations
//     initIntersectionObserver() {
//         const observerOptions = {
//             threshold: 0.1,
//             rootMargin: '0px 0px -50px 0px'
//         };

//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('animate-fadeInUp', 'opacity-100');
//                     entry.target.classList.remove('opacity-0', 'translate-y-10');
//                 }
//             });
//         }, observerOptions);

//         // Observe all sections and cards
//         document.querySelectorAll('section, .skill-card, .service-card, .project-card, .research-interest, .experience-item').forEach(el => {
//             el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
//             observer.observe(el);
//         });
//     }

//     // ✉️ Contact Form Handler
//     handleContactForm(e) {
//         e.preventDefault();
        
//         // Simulate form submission
//         const submitBtn = e.target.querySelector('button[type="submit"]');
//         const originalText = submitBtn.innerHTML;
        
//         submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
//         submitBtn.disabled = true;
        
//         // Simulate API call
//         setTimeout(() => {
//             alert('Thank you for your message! I\'ll get back to you within 24-48 hours. 🚀');
//             e.target.reset();
//             submitBtn.innerHTML = originalText;
//             submitBtn.disabled = false;
//         }, 2000);
//     }

//     // 🤖 FUTURE AI ASSISTANT INTEGRATION (PLACEHOLDER)
//     // This method is prepared for Personal AI Assistant integration
//     initAIAssistant() {
//         console.log('🎯 AI Assistant integration point - Ready for future implementation');
//         console.log('📋 Features to implement:');
//         console.log('   - Chat widget');
//         console.log('   - Voice activation');
//         console.log('   - Context-aware responses');
//         console.log('   - Portfolio data API');
//         console.log('   - Real-time project updates');
//     }
// }

// // 🏁 Initialize Portfolio App when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     new PortfolioApp();
// });

// // PWA Ready - Service Worker Placeholder
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js').catch(() => {
//             // Service worker registration failed - continue normally
//         });
//     });
// }
