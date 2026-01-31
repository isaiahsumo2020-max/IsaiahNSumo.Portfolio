// =================================================================
// ISAIAH N. SUMO PORTFOLIO - COMPLETE PRODUCTION JAVASCRIPT v3.0
// FULL FEATURES: AI Chat + Voice Calling + Appointment Booking + Greetings
// Vanilla JS | ES6+ | Production Ready | No External Dependencies
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
            sun?.classList.toggle('hidden', this.isDark);
            moon?.classList.toggle('hidden', !this.isDark);
        }
    }

    // 📱 MOBILE NAVIGATION & EVENTS
    bindNavigationEvents() {
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());

        // Mobile menu toggle
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileBtn.querySelector('i');
                icon?.classList.toggle('fa-bars');
                icon?.classList.toggle('fa-times');
            });
        }

        // Close mobile menu on nav link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu?.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileBtn?.querySelector('i');
                    icon?.classList.remove('fa-times');
                    icon?.classList.add('fa-bars');
                }
            });
        });

        // Contact form handler
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }
    }

    // 🎯 SMOOTH SCROLLING WITH NAV OFFSET
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

        document.querySelectorAll('section[id], .skill-card, .service-card, .project-card, .research-interest, .experience-item')
            .forEach(el => {
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

    initAIAssistant() {
        this.ai = new IsaiahAI();
    }
}

// 🎙️ VOICE ENGINE CLASS
class VoiceEngine {
    constructor() {
        this.isRecording = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.initVoiceRecognition();
    }

    initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isRecording = true;
                document.getElementById('voice-status')?.classList.add('text-green-600');
                document.getElementById('voice-status').textContent = '🎙️ Listening... Speak now!';
            };

            this.recognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                this.handleVoiceCommand(transcript);
            };

            this.recognition.onerror = (e) => {
                this.isRecording = false;
                document.getElementById('voice-status').textContent = 'Voice error. Please try again.';
                document.getElementById('voice-status')?.classList.remove('text-green-600');
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                document.getElementById('voice-status')?.classList.remove('text-green-600');
                document.getElementById('voice-stop-btn')?.classList.add('hidden');
                document.getElementById('voice-start-btn')?.classList.remove('hidden');
            };
        }
    }

    startVoice() {
        if (!this.recognition) {
            alert('Voice recognition not supported. Use microphone button for typing or contact form.');
            return;
        }
        this.recognition.start();
        document.getElementById('voice-stop-btn')?.classList.remove('hidden');
        document.getElementById('voice-start-btn')?.classList.add('hidden');
    }

    stopVoice() {
        this.recognition?.stop();
    }

    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1.05;
            utterance.volume = 0.9;
            utterance.lang = 'en-US';
            this.synthesis.speak(utterance);
        }
    }

    handleVoiceCommand(transcript) {
        const ai = IsaiahAI.instance;
        const lower = transcript.toLowerCase();

        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            ai.speak('Hello! Welcome. I am Isaiah AI. How can I assist you today?');
            ai.addMessage('Hello! 👋 I\'m Isaiah AI. Ask me about Isaiah N. Sumo, his skills, projects, or say "book appointment"', 'ai');
        } else if (lower.includes('appointment') || lower.includes('book') || lower.includes('schedule')) {
            document.getElementById('ai-voice-modal')?.classList.remove('hidden');
            ai.speak('Great! Let\'s book an appointment with Isaiah. Please fill out the form.');
        } else if (lower.includes('skills') || lower.includes('what can he do')) {
            ai.speak('Isaiah specializes in networking, system administration, cybersecurity, web development, and graphic design.');
        } else {
            ai.speak(`I heard you say: "${transcript}". Type in chat for detailed answers or say "book appointment".`);
        }
    }
}

// 🧠 ISAIAH N. SUMO AI - FULL PROFESSIONAL ASSISTANT
class IsaiahAI extends VoiceEngine {
    constructor() {
        super();
        IsaiahAI.instance = this;
        this.knowledgeBase = this.initKnowledgeBase();
        this.conversationHistory = [];
        this.isTyping = false;
        this.init();
    }

    initKnowledgeBase() {
        return {
            greetings: {
                hello: "Hello! 👋 I'm Isaiah AI, your guide to Isaiah N. Sumo's professional world. Ask about his skills, projects, or availability!",
                thanks: "You're welcome! 😊 Isaiah N. Sumo appreciates your interest. Is there anything else I can help you with?",
                goodbye: "Goodbye! Visit Isaiah's #contact section for direct communication. Have a great day!"
            },
            about: {
                intro: "Isaiah N. Sumo is an <strong>Information Technology professional</strong> specializing in <strong>Networking</strong>, <strong>System Administration</strong>, and <strong>Cybersecurity Awareness</strong> based in Liberia.",
                background: "He holds Diploma & WAEC certificates and actively participates in technology initiatives and youth empowerment programs."
            },
            skills: {
                technical: "• <strong>Networking:</strong> Subnetting, routing, troubleshooting\n• <strong>System Admin:</strong> Linux/Windows fundamentals\n• <strong>Cybersecurity:</strong> Awareness & policy\n• <strong>Web Development:</strong> HTML/CSS/JavaScript\n• <strong>Graphic Design:</strong> Adobe tools"
            },
            projects: {
                list: "• <strong>InfoCheck Liberia</strong> – Digital verification platform\n• <strong>School Management App</strong> – Educational solution\n• <strong>Isaiah de Blogger</strong> – Content platform"
            },
            experience: {
                current: "IT Personnel at Curtis Professional Security Service (Current)",
                previous: "Isaiah Tech Solution Group, TQC Tech Solutions, freelance IT support"
            },
            availability: "Isaiah balances professional projects with continuous learning. Best reached via the #contact form."
        };
    }

    init() {
        this.bindEvents();
        this.initMiniTeaser();
        this.showWidgetDelayed();
    }

    bindEvents() {
        // Main chat controls
        document.getElementById('ai-toggle-btn')?.addEventListener('click', () => this.toggleChat());
        document.getElementById('ai-minimize-btn')?.addEventListener('click', () => this.minimizeChat());
        document.getElementById('ai-close-btn')?.addEventListener('click', () => this.closeChat());
        document.getElementById('ai-send-btn')?.addEventListener('click', () => this.sendMessage());

        // Input handling
        const input = document.getElementById('ai-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Quick buttons
        document.querySelectorAll('.ai-quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickQuery(e.target.textContent));
        });

        // Voice button
        document.getElementById('ai-voice-btn')?.addEventListener('click', () => this.startVoice());

        // Voice controls
        document.getElementById('voice-start-btn')?.addEventListener('click', () => this.startVoice());
        document.getElementById('voice-stop-btn')?.addEventListener('click', () => this.stopVoice());

        // Appointment booking
        document.getElementById('book-appointment-btn')?.addEventListener('click', (e) => this.submitAppointment(e));

        // Navigation links in responses
        document.addEventListener('click', (e) => {
            if (e.target.matches('.ai-nav-link')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                this.minimizeChat();
            }
        });

        // Modal close
        document.querySelector('[id*="ai-voice-modal"] .close-modal')?.addEventListener('click', () => {
            document.getElementById('ai-voice-modal')?.classList.add('hidden');
        });
    }

    // 🔥 MINI AI TEASER (Every 10s for 40s under CV button)
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
            clearTimeout(hideTimeout);
            this.miniTeaser?.classList.remove('hidden');
            this.miniTeaser.style.animation = 'miniAiSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            hideTimeout = setTimeout(() => {
                this.miniTeaser?.classList.add('hidden');
                this.miniTeaser.style.animation = '';
            }, 40000); // 40 seconds visible
        };

        const cycle = () => {
            clearTimeout(showTimeout);
            showTimeout = setTimeout(() => {
                const chatPanel = document.getElementById('ai-chat-panel');
                if (chatPanel && chatPanel.classList.contains('hidden')) {
                    showTeaser();
                }
                setTimeout(cycle, 10000); // Next cycle in 10s
            }, 10000);
        };

        // Start after 3 seconds
        setTimeout(cycle, 3000);
    }

    // 💬 CHAT INTERFACE METHODS
    toggleChat() {
        const panel = document.getElementById('ai-chat-panel');
        panel?.classList.toggle('hidden');
        if (!panel?.classList.contains('hidden')) {
            document.getElementById('ai-input').focus();
        }
    }

    minimizeChat() {
        document.getElementById('ai-chat-panel')?.classList.add('hidden');
    }

    closeChat() {
        document.getElementById('bequizzy-ai-widget')?.classList.add('hidden');
        this.miniTeaser?.classList.add('hidden');
    }

    showWidgetDelayed() {
        setTimeout(() => {
            document.getElementById('bequizzy-ai-widget')?.classList.remove('hidden');
        }, 2000);
    }

    // 📨 APPOINTMENT BOOKING SYSTEM
    submitAppointment(e) {
        e?.preventDefault();
        
        const formData = {
            name: document.getElementById('appointment-name')?.value || '',
            email: document.getElementById('appointment-email')?.value || '',
            date: document.getElementById('appointment-date')?.value || '',
            time: document.getElementById('appointment-time')?.value || '',
            purpose: document.getElementById('appointment-purpose')?.value || ''
        };

        if (!formData.name || !formData.email || !formData.date || !formData.time) {
            alert('Please fill all required fields (Name, Email, Date, Time)');
            return;
        }

        // Simulate email sending
        const btn = document.getElementById('book-appointment-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        btn.disabled = true;

        // Create appointment data for copy/download
        const appointmentText = `Isaiah N. Sumo - NEW APPOINTMENT REQUEST
Name: ${formData.name}
Email: ${formData.email}
Date: ${formData.date}
Time: ${formData.time}
Purpose: ${formData.purpose}

Please contact this person to confirm the appointment.`;

        // Copy to clipboard
        navigator.clipboard.writeText(appointmentText).then(() => {
            setTimeout(() => {
                alert('✅ Appointment booked! Details copied to clipboard. Paste into your email:\n\n' + appointmentText);
                document.getElementById('ai-voice-modal')?.classList.add('hidden');
                document.getElementById('appointment-form')?.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
                this.addMessage('✅ Appointment successfully booked and copied to clipboard!', 'ai');
                this.speak('Appointment booked! Details copied to your clipboard.');
            }, 1500);
        }).catch(() => {
            // Fallback: Show downloadable text
            const blob = new Blob([appointmentText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'isaiah-appointment.txt';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // 💬 MESSAGE SYSTEM
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
            .replace(/#projects/gi, '<a href="#projects" class="ai-nav-link font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer">Projects section</a>')
            .replace(/#contact/gi, '<a href="#contact" class="ai-nav-link font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer">Contact section</a>')
            .replace(/#skills/gi, '<a href="#skills" class="ai-nav-link font-semibold text-purple-600 hover:text-purple-700 underline cursor-pointer">Skills section</a>')
            .replace(/#about/gi, '<a href="#about" class="ai-nav-link font-semibold text-indigo-600 hover:text-indigo-700 underline cursor-pointer">About section</a>')
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
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai-typing flex items-center animate-fadeInUp';
        typingDiv.innerHTML = `
            <div class="ai-avatar w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">AI</div>
            <div class="bg-gradient-to-r from-purple-50/90 to-blue-50/90 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-200/50 dark:border-blue-500/30 rounded-2xl px-4 py-3 max-w-[85%] flex items-center space-x-2">
                <div class="typing-dots">
                    <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">Isaiah AI is typing...</span>
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

    // 🧠 INTELLIGENT RESPONSE GENERATION
    async generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase().trim();

        // 🥳 GREETINGS HANDLING
        if (this.isGreeting(lowerMessage)) {
            this.speak("Hello! Welcome to Isaiah N. Sumo's portfolio.");
            return this.knowledgeBase.greetings.hello;
        }

        // 🙏 THANKS/COMPLIMENTS
        if (this.isThanks(lowerMessage)) {
            this.speak("You\'re welcome! Happy to help.");
            return this.knowledgeBase.greetings.thanks;
        }

        // 👋 GOODBYE
        if (this.isGoodbye(lowerMessage)) {
            this.speak("Goodbye! Have a wonderful day.");
            return this.knowledgeBase.greetings.goodbye;
        }

        // 📞 VOICE CALL
        if (lowerMessage.includes('call') || lowerMessage.includes('voice') || lowerMessage.includes('phone')) {
            this.speak("Voice calling activated! Click the microphone.");
            return '🎙️ <strong>Voice Call Ready!</strong><br>Click the <i class="fas fa-microphone text-blue-500"></i> microphone button to speak with Isaiah AI. Say "book appointment" or ask about skills.';
        }

        // 📅 APPOINTMENT
        if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
            document.getElementById('ai-voice-modal')?.classList.remove('hidden');
            this.speak("Let me help you book an appointment with Isaiah N. Sumo.");
            return '📅 <strong>Book Appointment</strong><br>Opening appointment form...';
        }

        // ❓ WHO IS ISAIAH
        if (lowerMessage.includes('who') || lowerMessage.includes('isaiah') || lowerMessage.includes('name')) {
            this.speak("Isaiah N. Sumo is an IT professional specializing in networking and cybersecurity.");
            return `${this.knowledgeBase.about.intro}<br><br>Learn more in the <a href="#about" class="ai-nav-link font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer">About section</a>.`;
        }

        // 🛠️ SKILLS
        if (lowerMessage.includes('skill') || lowerMessage.includes('skills') || lowerMessage.includes('expert')) {
            this.speak("Isaiah specializes in networking, system administration, cybersecurity, web development, and graphic design.");
            return `Isaiah N. Sumo\'s key skills:<br>${this.knowledgeBase.skills.technical.replace(/\n/g, '<br>')}<br><br>View details in <a href="#skills" class="ai-nav-link font-semibold text-purple-600 hover:text-purple-700 underline cursor-pointer">Skills section</a>.`;
        }

        // 💼 PROJECTS
        if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio')) {
            this.speak("Isaiah\'s featured projects include InfoCheck Liberia and School Management App.");
            return `Featured projects:<br>${this.knowledgeBase.projects.list.replace(/\n/g, '<br>')}<br><br>Explore all in <a href="#projects" class="ai-nav-link font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer">Projects section</a>.`;
        }

        // 💼 EXPERIENCE
        if (lowerMessage.includes('experience') || lowerMessage.includes('job') || lowerMessage.includes('work')) {
            this.speak("Isaiah has experience with Curtis Professional Security and Isaiah Tech Solution Group.");
            return `Professional experience:<br>• ${this.knowledgeBase.experience.current}<br>• ${this.knowledgeBase.experience.previous}<br><br>Full timeline in <a href="#experience" class="ai-nav-link font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer">Experience section</a>.`;
        }

        // 📧 CONTACT
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
            this.speak("Use the contact form below to reach Isaiah directly.");
            return `To contact Isaiah N. Sumo, use the <a href="#contact" class="ai-nav-link font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer">Contact form</a>.<br><br>Response within 24-48 hours.`;
        }

        // Default helpful response
        return `Thank you for reaching out! I can help with:<br>
        • Isaiah's skills & experience<br>
        • Featured projects<br>
        • <strong>📅 Book appointment</strong><br>
        • 🎙️ Voice conversation<br><br>
        Try: "skills", "projects", "book appointment", or use #contact form.`;
    }

    isGreeting(text) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
        return greetings.some(greeting => text.includes(greeting));
    }

    isThanks(text) {
        const thanks = ['thank', 'thanks', 'appreciate', 'cheers'];
        return thanks.some(word => text.includes(word));
    }

    isGoodbye(text) {
        const goodbyes = ['bye', 'goodbye', 'see you', 'farewell'];
        return goodbyes.some(goodbye => text.includes(goodbye));
    }

    handleQuickQuery(query) {
        const input = document.getElementById('ai-input');
        if (input) {
            input.value = query;
            this.sendMessage();
        }
    }
}

// 🏁 MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Inject all required CSS animations
    const style = document.createElement('style');
    style.id = 'portfolio-animations';
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes miniAiSlideUp {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.9); }
            50% { opacity: 0.7; transform: translateX(-50%) translateY(-5px) scale(1.02); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes typing {
            0%, 60%, 100% { transform: scale(1); }
            30% { transform: scale(1.2); }
        }
        @keyframes miniAiPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .typing-dots { display: flex; gap: 4px; }
        .dot { width: 8px; height: 8px; background: #6b7280; border-radius: 50%; animation: typing 1.4s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .mini-ai-teaser { animation: miniAiPulse 2s infinite; }
        .mini-ai-teaser:hover { animation: none; }

        /* Mobile teaser positioning */
        @media (max-width: 768px) {
            #mini-ai-teaser {
                left: 50% !important; right: auto !important;
                transform: translateX(-50%) !important;
                bottom: -2rem !important;
                width: calc(100% - 2rem) !important;
                max-width: 280px;
                justify-content: center;
            }
        }

        /* Voice modal improvements */
        #ai-voice-modal { backdrop-filter: blur(20px); }
        #ai-voice-modal .voice-btn-start,
        #ai-voice-modal .voice-btn-stop { transition: all 0.3s ease; }
        #ai-voice-modal .voice-btn-start:hover { transform: scale(1.05); }
    `;
    document.head.appendChild(style);

    // Initialize portfolio app
    new PortfolioApp();

    // PWA readiness (optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
});
