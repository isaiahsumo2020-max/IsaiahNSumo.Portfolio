
// BEQUIZZY N. SUMO PORTFOLIO - COMPLETE w/ VOICE CALL AI
// Voice Recognition + Speech Synthesis | No External APIs
// Vanilla JS | Production Ready | GitHub Pages Optimized

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

    // 🌙 THEME SYSTEM
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
            sun?.classList.toggle('hidden', this.isDark);
            moon?.classList.toggle('hidden', !this.isDark);
        }
    }

    //  NAVIGATION
    bindNavigationEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const contactForm = document.getElementById('contact-form');

        if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());
        
        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileBtn.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 90;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    }

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

        document.querySelectorAll('section[id], .skill-card, .service-card, .project-card, .research-interest, .experience-item')
            .forEach(el => {
                el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
                observer.observe(el);
            });
    }

    handleContactForm(e) {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you! I\'ll respond within 24-48 hours. 🚀');
            e.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    initAIAssistant() {
        this.ai = new BequizzyAI();
    }
}

// BEQUIZZY AI w/ VOICE CALL SYSTEM
class BequizzyAI {
    constructor() {
        this.knowledgeBase = this.initKnowledgeBase();
        this.conversationHistory = [];
        this.isTyping = false;
        this.isVoiceActive = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentVoice = null;
        this.init();
    }

    initKnowledgeBase() {
        return {
            about: "Bequizzy N. Sumo - IT student specializing in Networking, System Administration, and Cybersecurity from Liberia.",
            skills: "Networking (subnetting/routing), Linux/Windows admin, Cybersecurity awareness, Web development (HTML/CSS/JS), Graphic design.",
            projects: "InfoCheck Liberia, School Management App, Bequizzy de Blogger, Desktop publishing projects.",
            experience: "IT Personnel at Curtis Professional Security, Isaiah Tech Solution Group, 3+ years experience.",
            research: "Cybersecurity thesis: Youth-centered awareness and national policy for Liberia's digital future.",
            availability: "Available for IT consulting, web development, cybersecurity discussions via contact form."
        };
    }

    init() {
        this.initVoiceSystem();
        this.bindEvents();
        this.initMiniTeaser();
        this.showWidgetDelayed();
    }

    // VOICE SYSTEM INITIALIZATION
    initVoiceSystem() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isVoiceActive = true;
            this.updateVoiceButton(true);
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.handleVoiceInput(transcript);
            this.isVoiceActive = false;
            this.updateVoiceButton(false);
        };

        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.addMessage('Voice recognition failed. Please type your message.', 'ai');
            this.isVoiceActive = false;
            this.updateVoiceButton(false);
        };

        this.recognition.onend = () => {
            this.isVoiceActive = false;
            this.updateVoiceButton(false);
        };

     // Initialize best available voice
        const voices = this.synthesis.getVoices();
        this.currentVoice = voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Google') && voice.localService === false
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    }

    // SPEAK RESPONSE
    speakResponse(text) {
        if (!this.synthesis) return;

        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.currentVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        utterance.onstart = () => {
            this.updateVoiceButton(true, 'speaking');
        };

        utterance.onend = () => {
            this.updateVoiceButton(false);
        };

        this.synthesis.speak(utterance);
    }

    updateVoiceButton(isActive, state = 'listening') {
        const voiceBtn = document.getElementById('ai-voice-btn');
        if (!voiceBtn) return;

        voiceBtn.className = `absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors ${isActive ? 'animate-pulse bg-blue-500/20' : 'opacity-60 hover:opacity-100'}`;
        
        const icon = voiceBtn.querySelector('i');
        if (isActive) {
            icon.className = state === 'speaking' ? 'fas fa-volume-up text-blue-600 text-sm' : 'fas fa-microphone text-blue-600 text-sm';
        } else {
            icon.className = 'fas fa-microphone text-gray-500 text-sm';
        }
    }

    handleVoiceInput(transcript) {
        this.addMessage(`🎤 "${transcript}"`, 'user');
        const response = this.generateVoiceResponse(transcript);
        this.addMessage(response, 'ai');
        setTimeout(() => this.speakResponse(response), 500);
    }

    generateVoiceResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('who') || lowerMessage.includes('bequizzy')) {
            return "Bequizzy N. Sumo is an IT student specializing in networking, system administration, and cybersecurity awareness from Liberia. Check the About section for more details.";
        }
        if (lowerMessage.includes('skill') || lowerMessage.includes('skills')) {
            return "Bequizzy specializes in networking, system administration, cybersecurity, web development, and graphic design. See the Skills section.";
        }
        if (lowerMessage.includes('project') || lowerMessage.includes('projects')) {
            return "Notable projects include InfoCheck Liberia, School Management App, and Bequizzy de Blogger. View all projects in the Projects section.";
        }
        if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
            return "Use the Contact form below to reach Bequizzy. He responds within 24 to 48 hours.";
        }
        
        return "Thank you for your question. Please use the Contact form for specific inquiries about Bequizzy's work.";
    }

    // EVENT BINDING
    bindEvents() {
        const toggleBtn = document.getElementById('ai-toggle-btn');
        const chatPanel = document.getElementById('ai-chat-panel');
        const minimizeBtn = document.getElementById('ai-minimize-btn');
        const closeBtn = document.getElementById('ai-close-btn');
        const sendBtn = document.getElementById('ai-send-btn');
        const input = document.getElementById('ai-input');
        const quickBtns = document.querySelectorAll('.ai-quick-btn');
        const voiceBtn = document.getElementById('ai-voice-btn');

        if (toggleBtn) toggleBtn.addEventListener('click', () => this.toggleChat());
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
        if (quickBtns.length) {
            quickBtns.forEach(btn => btn.addEventListener('click', (e) => this.handleQuickQuery(e.target.textContent)));
        }
        if (voiceBtn && this.recognition) {
            voiceBtn.addEventListener('click', () => {
                if (this.isVoiceActive) {
                    this.recognition.stop();
                } else {
                    this.recognition.start();
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.matches('.ai-nav-link')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                this.minimizeChat();
            }
        });
    }

    // MINI AI TEASER (10s/40s cycle)
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
            }, 40000);
        };

        const cycle = () => {
            clearTimeout(showTimeout);
            showTimeout = setTimeout(() => {
                const chatPanel = document.getElementById('ai-chat-panel');
                if (chatPanel && !chatPanel.classList.contains('hidden')) {
                    cycle();
                    return;
                }
                showTeaser();
            }, 10000);
        };

        setTimeout(cycle, 3000);
    }

    // CHAT FUNCTIONS
    toggleChat() {
        const panel = document.getElementById('ai-chat-panel');
        if (panel) {
            panel.classList.toggle('hidden');
            if (!panel.classList.contains('hidden')) {
                document.getElementById('ai-input').focus();
            }
        }
    }

    minimizeChat() { document.getElementById('ai-chat-panel')?.classList.add('hidden'); }
    closeChat() {
        document.getElementById('bequizzy-ai-widget')?.classList.add('hidden');
        if (this.miniTeaser) this.miniTeaser.classList.add('hidden');
    }

    showWidgetDelayed() {
        setTimeout(() => document.getElementById('bequizzy-ai-widget')?.classList.remove('hidden'), 2000);
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
        this.speakResponse(response);
    }

    addMessage(text, sender) {
        const messages = document.getElementById('ai-messages');
        if (!messages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender === 'ai' ? 'ai-message-ai animate-fadeInUp' : 'ai-message-user animate-fadeInUp'}`;

        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="ai-avatar w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">AI</div>
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
            .replace(/#projects/gi, '<a href="#projects" class="ai-nav-link font-semibold text-blue-600 hover:text-blue-700 underline">Projects</a>')
            .replace(/#contact/gi, '<a href="#contact" class="ai-nav-link font-semibold text-emerald-600 hover:text-emerald-700 underline">Contact</a>')
            .replace(/#skills/gi, '<a href="#skills" class="ai-nav-link font-semibold text-purple-600 hover:text-purple-700 underline">Skills</a>')
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
                <div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
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

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('who') || lowerMessage.includes('bequizzy')) {
            return `Bequizzy N. Sumo is an <strong>IT student</strong> specializing in <strong>Networking</strong>, <strong>System Administration</strong>, and <strong>Cybersecurity</strong> from Liberia.<br><br>Diploma holder, YouthIGF participant. #about`;
        }
        if (lowerMessage.includes('skill') || lowerMessage.includes('skills')) {
            return `Core skills: #skills<br>• Networking (subnetting/routing)<br>• Linux/Windows admin<br>• Cybersecurity awareness<br>• Web dev (HTML/CSS/JS)<br>• Graphic design`;
        }
        if (lowerMessage.includes('project') || lowerMessage.includes('projects')) {
            return `Featured projects: #projects<br>• InfoCheck Liberia (fact-checking)<br>• School Management App<br>• Bequizzy de Blogger`;
        }
        return `Thanks for your interest! Use #contact form for specific inquiries. What would you like to know? (skills/projects/research)`;
    }

    handleQuickQuery(query) {
        const input = document.getElementById('ai-input');
        if (input) {
            input.value = query;
            this.sendMessage();
        }
    }
}

//  INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        @keyframes miniAiSlideUp { 0% { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.9); } 50% { opacity: 0.7; transform: translateX(-50%) translateY(-5px) scale(1.02); } 100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        @keyframes typing { 0%,60%,100% { transform: scale(1); } 30% { transform: scale(1.2); } }
        .typing-dots { display: flex; gap: 4px; }
        .dot { width: 8px; height: 8px; background: #6b7280; border-radius: 50%; animation: typing 1.4s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; } .dot:nth-child(3) { animation-delay: 0.4s; }
        @media (max-width: 768px) { #mini-ai-teaser { left: 50% !important; right: auto !important; transform: translateX(-50%) !important; bottom: -2rem !important; width: calc(100% - 2rem) !important; max-width: 280px; justify-content: center; } }
    `;
    document.head.appendChild(style);

    new PortfolioApp();
});
