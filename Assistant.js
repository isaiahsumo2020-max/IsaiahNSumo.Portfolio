// =================================================================
// ISAIAH N. SUMO AI v7.1 - END CALL BUTTON + PERFECT VOICE CONTROL
// Natural conversation + End call stops EVERYTHING
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
        }, { threshold: 0.1 });

        document.querySelectorAll('section[id]').forEach(el => {
            el.classList.add('opacity-0', 'translate-y-10', 'transition-all');
            observer.observe(el);
        });
    }

    handleContactForm(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        setTimeout(() => {
            alert('Thank you! Message sent successfully. 🚀');
            e.target.reset();
            btn.innerHTML = original;
            btn.disabled = false;
        }, 1500);
    }

    initAIAssistant() { new IsaiahAI(); }
}

// 🌟 ISAIAH AI v7.1 - PERFECT END CALL + NATURAL CONVERSATION
class IsaiahAI {
    constructor() {
        this.isListening = false;
        this.isProcessing = false;
        this.conversationCount = 0;
        this.synthesis = window.speechSynthesis;
        this.personalityQuotes = [
            "Success is where preparation meets opportunity - Isaiah N. Sumo",
            "Every great network starts with one strong connection",
            "Cybersecurity: Protecting today, securing tomorrow",
            "Code is poetry, networks are symphonies"
        ];
        this.initSpeech();
        this.bindEvents();
        this.createEndCallButton(); // ✅ NEW: End Call Button
        this.startTeaser();
    }

    // ✅ NEW: Creates visible END CALL button
    createEndCallButton() {
        if (document.getElementById('end-call-btn')) return;

        const endCallBtn = document.createElement('button');
        endCallBtn.id = 'end-call-btn';
        endCallBtn.innerHTML = '<i class="fas fa-phone-slash mr-2"></i>End Call';
        endCallBtn.className = 'fixed top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold transition-all duration-200 flex items-center hidden md:flex';
        endCallBtn.style.zIndex = '9999';
        
        endCallBtn.addEventListener('click', () => {
            this.stopVoiceCompletely();
        });

        document.body.appendChild(endCallBtn);
    }

    initSpeech() {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new Speech();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateStatus('🎙️ Listening...');
                this.showEndCallButton(); // ✅ Show End Call during listening
            };

            this.recognition.onresult = (event) => {
                if (this.isProcessing) return;
                
                const finalTranscript = Array.from(event.results)
                    .filter(r => r.isFinal)
                    .map(r => r[0].transcript)
                    .join(' ').trim();

                if (finalTranscript && finalTranscript.length > 2) {
                    this.handleInput(finalTranscript);
                }
            };

            this.recognition.onspeechend = () => {
                if (this.isListening && !this.isProcessing) {
                    setTimeout(() => this.recognition?.start(), 600);
                }
            };

            this.recognition.onerror = () => {
                if (this.isListening && !this.isProcessing) {
                    setTimeout(() => this.recognition?.start(), 800);
                }
            };

            // ✅ NEW: Catch recognition end to hide End Call button
            this.recognition.onend = () => {
                if (!this.isListening) {
                    this.hideEndCallButton();
                }
            };
        }
    }

    // ✅ NEW: PERFECT End Call - Stops EVERYTHING
    stopVoiceCompletely() {
        console.log('🔴 END CALL - Stopping everything');
        
        // Stop speech synthesis (AI talking)
        this.synthesis.cancel();
        
        // Stop speech recognition (listening)
        this.isListening = false;
        this.isProcessing = false;
        if (this.recognition) {
            this.recognition.stop();
        }
        
        // Update status
        this.updateStatus('📴 Call ended');
        
        // Hide End Call button
        this.hideEndCallButton();
        
        // Add goodbye message
        this.addMessage('👋 Call ended. Click microphone to start a new conversation!', 'ai');
    }

    showEndCallButton() {
        const btn = document.getElementById('end-call-btn');
        if (btn) {
            btn.classList.remove('hidden');
            btn.style.display = 'flex';
        }
    }

    hideEndCallButton() {
        const btn = document.getElementById('end-call-btn');
        if (btn) {
            btn.classList.add('hidden');
            btn.style.display = 'none';
        }
    }

    bindEvents() {
        const controls = {
            'ai-toggle-btn': () => this.toggleChat(),
            'ai-minimize-btn': () => this.minimizeChat(),
            'ai-close-btn': () => this.closeChat(),
            'ai-send-btn': () => this.sendText(),
            'ai-voice-btn': () => this.toggleVoice(),
            'voice-start-btn': () => this.startVoice(),
            'voice-stop-btn': () => this.stopVoiceCompletely(), // ✅ Uses complete stop
            'book-appointment-btn': () => this.bookAppointment()
        };

        Object.entries(controls).forEach(([id, fn]) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', fn.bind(this));
        });

        const input = document.getElementById('ai-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendText();
                }
            });
        }

        document.querySelectorAll('button[data-ai-action], .ai-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.aiAction || btn.textContent?.trim().toLowerCase();
                this.sendText(action);
            });
        });
    }

    toggleChat() {
        const panel = document.getElementById('ai-chat-panel');
        panel?.classList.toggle('hidden');
        if (!panel?.classList.contains('hidden')) document.getElementById('ai-input')?.focus();
    }

    minimizeChat() { document.getElementById('ai-chat-panel')?.classList.add('hidden'); }
    
    closeChat() {
        this.stopVoiceCompletely();
        document.getElementById('bequizzy-ai-widget')?.classList.add('hidden');
        document.getElementById('mini-ai-teaser')?.classList.add('hidden');
    }

    toggleVoice() { this.isListening ? this.stopVoiceCompletely() : this.startVoice(); }

    startVoice() {
        this.isListening = true;
        this.updateStatus('🎙️ Isaiah AI here! Talk to me...');
        this.recognition?.start();
    }

    stopVoice() {
        this.isListening = false;
        this.isProcessing = false;
        this.recognition?.stop();
        this.updateStatus('📴 Voice off');
        this.hideEndCallButton();
    }

    updateStatus(msg) {
        const statusEl = document.getElementById('voice-status');
        if (statusEl) statusEl.textContent = msg;
    }

    handleInput(transcript) {
        if (this.isProcessing) return;
        this.conversationCount++;
        this.addMessage(transcript, 'user');
        this.processInput(transcript.toLowerCase());
    }

    sendText(override = null) {
        const input = document.getElementById('ai-input');
        const text = override || input?.value?.trim();
        if (!text || this.isProcessing) return;

        this.conversationCount++;
        this.addMessage(text, 'user');
        if (input && !override) input.value = '';
        this.processInput(text.toLowerCase());
    }

    async processInput(text) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        this.showTyping();
        await new Promise(r => setTimeout(r, 1200));
        
        const response = this.getNaturalResponse(text);
        this.removeTyping();
        this.addMessage(response, 'ai');
        
        if (this.isListening) {
            setTimeout(() => this.speak(response), 300);
        }
        
        this.isProcessing = false;
    }

    showTyping() {
        this.addMessage(`
            <div class="flex items-center gap-3 p-3">
                <div class="typing-dots">
                    <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                </div>
                <span>Isaiah AI thinking...</span>
            </div>`, 'ai');
    }

    removeTyping() {
        const messages = document.getElementById('ai-messages');
        const typing = messages?.querySelector('.typing-dots');
        typing?.closest('.ai-message')?.remove();
    }

    getNaturalResponse(message) {
        const turn = this.conversationCount;
        
        if (turn === 1 || message.match(/hi|hello|hey|good morning|good afternoon/i)) {
            return `Hey there! 😊 Welcome! I'm Isaiah AI, here to chat about the amazing <strong>Isaiah N. Sumo</strong>. 
            <br><br>"Success is where preparation meets opportunity" ✨ - Isaiah N. Sumo
            <br><br>How did you hear about Isaiah? LinkedIn, referral, or just browsing?`;
        }

        if (message.includes('how are you') || message.includes('how r u')) {
            return `I'm fantastic, thanks for asking! 😄 Always excited to talk about Isaiah. 
            <br><br>By the way, what's your story? What brings you to Isaiah's world today?`;
        }

        if (message.includes('isaiah') || message.includes('who') || message.includes('about')) {
            return `Isaiah N. Sumo is an incredible IT expert from Liberia! 🌍
            <br>• <strong>Networking wizard</strong> - makes complex networks simple
            <br>• <strong>Cybersecurity advocate</strong> - keeps data safe
            <br>• <strong>Web developer</strong> - builds beautiful sites
            <br><br>What's most interesting to you about his work?`;
        }

        if (message.includes('skill') || message.includes('skills') || message.includes('expertise')) {
            return `Isaiah's superpowers! 💪
            <br>• <strong>NETWORKING:</strong> Subnetting, routing, troubleshooting like a boss
            <br>• <strong>SYSTEMS:</strong> Linux & Windows server master
            <br>• <strong>CYBERSECURITY:</strong> Training & awareness expert
            <br>• <strong>WEB DEV:</strong> Modern responsive websites
            <br>• <strong>DESIGN:</strong> Adobe Creative Suite professional
            
            <br><br>Which area excites you most? Want to see his projects?`;
        }

        if (message.includes('project') || message.includes('projects') || message.includes('work')) {
            return `Isaiah's game-changing projects! 🎯
            <br>• <strong>InfoCheck Liberia</strong> - Fighting fake news in Liberia
            <br>• <strong>School Management System</strong> - Revolutionizing education
            <br>• <strong>Isaiah de Blogger</strong> - His personal content empire
            
            <br><br>"Every great network starts with one strong connection" - Isaiah
            <br><br>Which project sounds coolest to you?`;
        }

        if (message.includes('appointment') || message.includes('book') || message.includes('meet') || message.includes('contact')) {
            document.getElementById('ai-voice-modal')?.classList.remove('hidden');
            return `Perfect choice! 📅 I've opened Isaiah's appointment form. 
            <br>He responds within 24 hours and loves connecting with people like you!
            <br><br>What's this meeting about?`;
        }

        if (message.includes('nice') || message.includes('cool') || message.includes('awesome') || message.includes('great')) {
            return `I know, right? 😎 Isaiah's work is 🔥! 
            <br><br>Want to dive deeper into his skills, see his projects, or book time to chat with him directly?`;
        }

        if (message.includes('thank') || message.includes('thanks')) {
            return `My pleasure! 😊 Isaiah's story is worth sharing. 
            <br><br>Before you go, anything else you're curious about? His latest project maybe?`;
        }

        if (message.includes('linkedin') || message.includes('referral') || message.includes('found') || message.includes('hear')) {
            return `Awesome! 🙌 Love hearing Isaiah's network is growing. 
            <br><br>Quick question: What caught your attention about Isaiah first? His tech skills or something else?`;
        }

        if (message.includes('fun') || message.includes('joke') || message.includes('haha')) {
            return `😄 Glad you're having fun! Isaiah says: "Code is poetry, networks are symphonies!" 
            <br><br>Want the serious stuff now? Skills, projects, or book time with him?`;
        }

        return `Happy to help! 😊 Here's what I know best about Isaiah:
        <br>• Say <strong>"skills"</strong> - See his expertise
        <br>• Say <strong>"projects"</strong> - His amazing work
        <br>• Say <strong>"book appointment"</strong> - Connect directly
        
        <br><br>Or tell me - what's got you excited about Isaiah today? ✨`;
    }

    addMessage(text, sender) {
        const messages = document.getElementById('ai-messages');
        if (!messages) return;

        const div = document.createElement('div');
        div.className = `ai-message ${sender === 'ai' ? 'ai-message-ai' : 'ai-message-user'} fade-in mb-4`;

        if (sender === 'ai') {
            div.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
                    <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border rounded-2xl p-4 max-w-[85%] leading-relaxed">${text}</div>
                </div>`;
        } else {
            div.innerHTML = `
                <div class="flex justify-end">
                    <div class="bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-600/30 border rounded-2xl p-4 max-w-[85%]">
                        <span class="text-sm text-gray-900 dark:text-white">${this.escapeHtml(text)}</span>
                    </div>
                </div>`;
        }

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    speak(text) {
        if (!this.isListening) return; // Don't speak if call ended
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '');
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.92;
        utterance.pitch = 1.05;
        utterance.volume = 0.9;
        this.synthesis.speak(utterance);
    }

    bookAppointment() {
        const fields = ['appointment-name', 'appointment-email', 'appointment-date', 'appointment-time'];
        const data = {};
        fields.forEach(id => data[id.replace('appointment-', '')] = document.getElementById(id)?.value || '');

        if (fields.some(id => !data[id.replace('appointment-', '')])) {
            alert('Please fill all fields! 😊');
            return;
        }

        const text = ` ISAIAH N. SUMO - APPOINTMENT REQUEST
Name: ${data.name}
Email: ${data.email}
Date: ${data.date}
Time: ${data.time}`;

        navigator.clipboard.writeText(text).then(() => {
            alert('🎉 Appointment booked! Details copied to clipboard. Isaiah will connect soon!');
            document.getElementById('ai-voice-modal')?.classList.add('hidden');
            document.getElementById('appointment-form')?.reset();
        });
    }

    startTeaser() {
        setTimeout(() => {
            const showTeaser = () => {
                const teaser = document.getElementById('mini-ai-teaser');
                if (teaser && document.getElementById('ai-chat-panel')?.classList.contains('hidden')) {
                    teaser.classList.remove('hidden');
                    setTimeout(() => teaser.classList.add('hidden'), 5000);
                }
            };
            setInterval(showTeaser, 15000);
            showTeaser();
        }, 2000);
    }
}




// ✅ ADD THESE TO YOUR script.js (IsaiahAI class or globally)

// 1. CLOSE MODAL FUNCTION
function closeAppointmentModal() {
    document.getElementById('ai-voice-modal').classList.add('hidden');
    document.getElementById('appointment-form')?.reset();
}

// 2. BOOK APPOINTMENT WITH SET BUTTON
function bookIsaiahAppointment() {
    const fields = ['appointment-name', 'appointment-email', 'appointment-date', 'appointment-time'];
    const data = {};
    
    fields.forEach(id => {
        data[id.replace('appointment-', '')] = document.getElementById(id)?.value || '';
    });

    if (!data.name || !data.email || !data.date || !data.time) {
        alert('Please fill all required fields! 😊');
        return;
    }

    const purpose = document.getElementById('appointment-purpose')?.value || 'General discussion';
    const text = `🌟 ISAIAH N. SUMO APPOINTMENT
Date: ${data.date} | Time: ${data.time}
Name: ${data.name} | Email: ${data.email}
Purpose: ${purpose}`;

    navigator.clipboard.writeText(text).then(() => {
        closeAppointmentModal();
        alert('🎉 Appointment booked! Details copied to clipboard. Isaiah will contact you soon!');
    }).catch(() => {
        closeAppointmentModal();
        alert('✅ Saved! ' + text);
    });
}



// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('isaiah-ai-styles')) {
        const style = document.createElement('style');
        style.id = 'isaiah-ai-styles';
        style.textContent = `
            @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .fade-in { animation: fade-in 0.5s ease-out; }
            @keyframes typing { 0%,60%,100% { transform: scale(1); } 30% { transform: scale(1.2); } }
            .typing-dots { display: flex; gap: 4px; align-items: center; }
            .dot { width: 8px; height: 8px; background: #6b7280; border-radius: 50%; animation: typing 1.4s infinite; }
            .dot:nth-child(2) { animation-delay: 0.2s; }
            .dot:nth-child(3) { animation-delay: 0.4s; }
            #end-call-btn:hover { transform: scale(1.05) !important; box-shadow: 0 10px 25px rgba(239,68,68,0.4) !important; }
        `;
        document.head.appendChild(style);
    }
    new PortfolioApp();
});
