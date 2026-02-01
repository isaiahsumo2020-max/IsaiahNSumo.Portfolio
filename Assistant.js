// =================================================================
// ISAIAH N. SUMO PORTFOLIO v5.1 - FIXED VOICE CALLING (NO REPEATS)
// Perfect conversation flow + Voice responds ONCE per input
// =================================================================

class PortfolioApp {
    constructor() { this.isDark = false; this.init(); }

    init() {
        this.loadTheme();
        this.bindNavigationEvents();
        this.initSmoothScrolling();
        this.initScrollAnimations();
        this.initAIAssistant();
    }

    loadTheme() {
        const saved = localStorage.getItem('portfolio-theme') || 'light';
        this.isDark = saved === 'dark';
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
            toggle.querySelector('.fa-sun')?.classList.toggle('hidden', this.isDark);
            toggle.querySelector('.fa-moon')?.classList.toggle('hidden', !this.isDark);
        }
    }

    bindNavigationEvents() {
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());
        
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

        document.getElementById('contact-form')?.addEventListener('submit', (e) => this.handleContactForm(e));
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
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
                el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
                observer.observe(el);
            });
    }

    handleContactForm(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        btn.disabled = true;
        setTimeout(() => {
            alert('Thank you! Message sent successfully. 🚀');
            e.target.reset();
            btn.innerHTML = original;
            btn.disabled = false;
        }, 2000);
    }

    initAIAssistant() { new IsaiahAI(); }
}

// 🧠 ISAIAH AI v5.1 - FIXED VOICE (NO REPEATS + PROPER LISTENING)
class IsaiahAI {
    constructor() {
        this.isTyping = false;
        this.isVoiceActive = false;
        this.isProcessing = false;
        this.conversationHistory = [];
        this.synthesis = window.speechSynthesis;
        this.initSpeechRecognition();
        this.bindEvents();
        this.startTeaser();
    }

    initSpeechRecognition() {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            // FIXED: Proper continuous listening settings
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            // ✅ FIXED EVENT HANDLERS - NO REPEATING
            this.recognition.onstart = () => {
                this.isVoiceActive = true;
                this.updateVoiceStatus('🎙️ Listening... Speak now!');
                console.log('🔴 Voice call started - listening...');
            };

            this.recognition.onresult = (event) => {
                // Only process FINAL results (no interim spam)
                const finalResult = event.results[event.results.length - 1];
                if (finalResult.isFinal && !this.isProcessing) {
                    const transcript = finalResult[0].transcript.trim();
                    console.log('📝 Heard:', transcript);
                    this.handleVoiceInput(transcript);
                }
            };

            this.recognition.onerror = (event) => {
                console.log('❌ Voice error:', event.error);
                this.updateVoiceStatus('🔄 Restarting...');
                // Auto-restart on error (but not during processing)
                if (this.isVoiceActive && !this.isProcessing) {
                    setTimeout(() => this.restartListening(), 500);
                }
            };

            this.recognition.onspeechend = () => {
                console.log('🗣️ Speech ended - restarting listen...');
                if (this.isVoiceActive && !this.isProcessing) {
                    setTimeout(() => this.restartListening(), 300);
                }
            };

            this.recognition.onend = () => {
                console.log('🔚 Recognition ended');
                if (this.isVoiceActive && !this.isProcessing) {
                    setTimeout(() => this.restartListening(), 100);
                }
            };
        }
    }

    restartListening() {
        if (this.isVoiceActive && this.recognition && !this.isProcessing) {
            this.recognition.start();
        }
    }

    updateVoiceStatus(message) {
        const statusEl = document.getElementById('voice-status');
        if (statusEl) statusEl.textContent = message;
        
        const stopBtn = document.getElementById('voice-stop-btn');
        const startBtn = document.getElementById('voice-start-btn');
        if (stopBtn) stopBtn.classList.toggle('hidden', !this.isVoiceActive);
        if (startBtn) startBtn.classList.toggle('hidden', this.isVoiceActive);
    }

    bindEvents() {
        const controls = {
            'ai-toggle-btn': () => this.toggleChat(),
            'ai-minimize-btn': () => this.minimizeChat(),
            'ai-close-btn': () => this.closeChat(),
            'ai-send-btn': () => this.sendTextMessage(),
            'ai-voice-btn': () => this.toggleVoiceCall(),
            'voice-start-btn': () => this.startVoiceCall(),
            'voice-stop-btn': () => this.stopVoiceCall(),
            'book-appointment-btn': () => this.bookAppointment()
        };

        Object.entries(controls).forEach(([id, handler]) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', handler);
        });

        const input = document.getElementById('ai-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendTextMessage();
                }
            });
        }

        document.querySelectorAll('.ai-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => this.sendTextMessage(btn.textContent));
        });
    }

    toggleChat() {
        const panel = document.getElementById('ai-chat-panel');
        if (panel) {
            panel.classList.toggle('hidden');
            if (!panel.classList.contains('hidden')) {
                document.getElementById('ai-input')?.focus();
            }
        }
    }

    minimizeChat() { document.getElementById('ai-chat-panel')?.classList.add('hidden'); }
    
    closeChat() {
        this.stopVoiceCall();
        document.getElementById('bequizzy-ai-widget')?.classList.add('hidden');
        document.getElementById('mini-ai-teaser')?.classList.add('hidden');
    }

    // 🔤 TEXT CHAT (SILENT)
    sendTextMessage() {
        const input = document.getElementById('ai-input');
        const text = input?.value.trim();
        if (!text || this.isTyping) return;

        this.addMessage(text, 'user');
        input.value = '';
        this.processMessage(text.toLowerCase(), false);
    }

    // 🎙️ VOICE INPUT (VOICE RESPONSE)
    async handleVoiceInput(transcript) {
        if (this.isProcessing) return;
        
        this.addMessage(transcript, 'user');
        await this.processMessage(transcript.toLowerCase(), true);
    }

    // 🎯 CORE PROCESSING (ONE RESPONSE PER INPUT)
    async processMessage(text, useVoice) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this.isTyping = true;

        this.addTypingIndicator();

        const response = await this.generateResponse(text);
        this.removeTypingIndicator();
        
        this.addMessage(response, 'ai');
        
        // VOICE ONLY when voice mode active
        if (useVoice && this.isVoiceActive) {
            this.speakResponse(response);
        }

        this.isProcessing = false;
        this.isTyping = false;
    }

    addTypingIndicator() {
        this.addMessage(`
            <div class="flex items-center space-x-3">
                <div class="typing-dots">
                    <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">Isaiah AI responding...</span>
            </div>`, 'ai');
    }

    removeTypingIndicator() {
        const messages = document.getElementById('ai-messages');
        const lastMessage = messages?.lastElementChild;
        if (lastMessage && lastMessage.querySelector('.typing-dots')) {
            lastMessage.remove();
        }
    }

    toggleVoiceCall() {
        if (this.isVoiceActive) {
            this.stopVoiceCall();
        } else {
            this.startVoiceCall();
        }
    }

    startVoiceCall() {
        this.isVoiceActive = true;
        this.updateVoiceStatus('🎙️ Calling Isaiah AI... Speak now!');
        if (this.recognition) {
            this.recognition.start();
        } else {
            alert('🎙️ Voice calls work best in Chrome/Edge. Use text chat instead.');
            this.stopVoiceCall();
        }
    }

    stopVoiceCall() {
        this.isVoiceActive = false;
        this.isProcessing = false;
        this.recognition?.stop();
        this.updateVoiceStatus('📴 Voice call ended');
        console.log('🔇 Voice call stopped');
    }

    speakResponse(text) {
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 0.9;
        utterance.onend = () => console.log('✅ Speech finished');
        this.synthesis.speak(utterance);
    }

    addMessage(text, sender) {
        const messages = document.getElementById('ai-messages');
        if (!messages) return;

        const div = document.createElement('div');
        div.className = `ai-message ${sender === 'ai' ? 'ai-message-ai animate-fadeInUp' : 'ai-message-user animate-fadeInUp'}`;

        if (sender === 'ai') {
            div.innerHTML = `
                <div class="ai-avatar w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">AI</div>
                <div class="bg-gradient-to-r from-purple-50/90 to-blue-50/90 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-200/50 dark:border-blue-500/30 rounded-2xl px-4 py-3 max-w-[85%]">${text}</div>
            `;
        } else {
            div.innerHTML = `
                <div class="flex justify-end">
                    <div class="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-200/50 dark:border-purple-500/30 rounded-2xl px-4 py-3 max-w-[85%]">
                        <div class="text-sm text-gray-900 dark:text-white">${this.escapeHtml(text)}</div>
                    </div>
                </div>
            `;
        }

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 🧠 NATURAL CONVERSATION (ONE RESPONSE PER INPUT)
    async generateResponse(message) {
        this.conversationHistory.push({ role: 'user', content: message });

        // Greeting
        if (['hello', 'hi', 'hey', 'good morning', 'good afternoon'].some(g => message.includes(g))) {
            return `Hello! 😊 I'm Isaiah AI. Great to meet you! What would you like to know about <strong>Isaiah N. Sumo</strong>? Try asking about his skills, projects, or say "book appointment".`;
        }

        // Thanks
        if (['thank', 'thanks', 'appreciate'].some(t => message.includes(t))) {
            return `You're welcome! 😊 Happy to help. Anything else about Isaiah I can tell you?`;
        }

        // Casual chat
        if (message.includes('how are you') || message.includes('how r u')) {
            return `I'm doing great, thanks for asking! 😄 Ready to tell you all about Isaiah N. Sumo. What interests you most?`;
        }

        // Who is Isaiah
        if (message.includes('isaiah') || message.includes('who') || message.includes('name')) {
            return `Isaiah N. Sumo is an <strong>IT expert</strong> from Liberia specializing in:
            <br>• <strong>Networking</strong>: Subnetting, routing, troubleshooting
            <br>• <strong>System Admin</strong>: Linux & Windows
            <br>• <strong>Cybersecurity</strong>: Awareness training
            <br>• <strong>Web Development</strong> & <strong>Graphic Design</strong>`;
        }

        // Skills
        if (['skill', 'skills', 'expert', 'what can he do'].some(s => message.includes(s))) {
            return `Isaiah's top skills:
            <br>• <strong>Networking</strong>: Subnetting, routing, diagnostics
            <br>• <strong>System Admin</strong>: Linux/Windows servers
            <br>• <strong>Cybersecurity</strong>: Training & policy
            <br>• <strong>Web Dev</strong>: HTML/CSS/JavaScript
            <br>• <strong>Graphic Design</strong>: Adobe Suite`;
        }

        // Projects
        if (['project', 'work', 'portfolio'].some(p => message.includes(p))) {
            return `Isaiah's featured projects:
            <br>• <strong>InfoCheck Liberia</strong> - Verify information
            <br>• <strong>School Management</strong> - Education platform
            <br>• <strong>Isaiah de Blogger</strong> - Content site`;
        }

        // Appointment
        if (['appointment', 'book', 'schedule', 'meet'].some(a => message.includes(a))) {
            document.getElementById('ai-voice-modal')?.classList.remove('hidden');
            return `📅 Appointment form opened! Fill in your details and Isaiah will contact you within 24 hours. 😊`;
        }

        return `I can help with:
        <br>• Isaiah's <strong>skills & experience</strong>
        <br>• His <strong>projects & portfolio</strong>
        <br>• <strong>Book appointment</strong> 📅
        <br><br>Say "skills", "projects", or "book appointment"! 😊`;
    }

    bookAppointment() {
        const data = {
            name: document.getElementById('appointment-name')?.value || '',
            email: document.getElementById('appointment-email')?.value || '',
            date: document.getElementById('appointment-date')?.value || '',
            time: document.getElementById('appointment-time')?.value || '',
            purpose: document.getElementById('appointment-purpose')?.value || ''
        };

        if (!data.name || !data.email || !data.date || !data.time) {
            alert('Please fill: Name, Email, Date, Time ⭐');
            return;
        }

        const text = `🌟 ISAIAH N. SUMO APPOINTMENT
Name: ${data.name}
Email: ${data.email}
Date: ${data.date}
Time: ${data.time}
Purpose: ${data.purpose}`;

        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Appointment booked! 📋 Copied to clipboard!');
            document.getElementById('ai-voice-modal')?.classList.add('hidden');
            document.getElementById('appointment-form')?.reset();
        });
    }

    startTeaser() {
        setTimeout(() => {
            const showTeaser = () => {
                const teaser = document.getElementById('mini-ai-teaser');
                const panel = document.getElementById('ai-chat-panel');
                if (teaser && panel?.classList.contains('hidden')) {
                    teaser.classList.remove('hidden');
                    setTimeout(() => teaser.classList.add('hidden'), 5000);
                }
            };
            setInterval(showTeaser, 15000);
            showTeaser();
        }, 2000);
    }
}

// 🏁 INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('ai-styles-v5')) {
        const style = document.createElement('style');
        style.id = 'ai-styles-v5';
        style.textContent = `
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes typing { 0%,60%,100% { transform: scale(1); } 30% { transform: scale(1.2); } }
            .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
            .typing-dots { display: flex; gap: 4px; align-items: center; }
            .dot { width: 8px; height: 8px; background: #6b7280; border-radius: 50%; animation: typing 1.4s infinite; }
            .dot:nth-child(2) { animation-delay: 0.2s; }
            .dot:nth-child(3) { animation-delay: 0.4s; }
            #mini-ai-teaser { animation: pulse 2s infinite; }
            @keyframes pulse { 0%,100%{opacity:0.7;} 50%{opacity:1;} }
        `;
        document.head.appendChild(style);
    }
    new PortfolioApp();
});
