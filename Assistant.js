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
            anchor.addEventListener('click', function (e) {
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
        document.getElementById('isaiah-ai-widget')?.classList.add('hidden');
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
    const msg = message.toLowerCase().trim();
    const turn = this.conversationCount;

    // ===== 1. PRIVACY-SAFE AUTOBIOGRAPHY (NEW) =====
    if (msg.includes("born") || msg.includes("birth") || msg.includes("childhood") || msg.includes("early")) {
        return `Isaiah was born in Liberia and raised in a close-knit community under challenging circumstances. His early life was shaped by family separation and economic hardship, building resilience from a very young age. He was primarily raised by loving grandparents, aunts, and extended family who were his foundation. 🌱`;
    }

    if (msg.includes("family") || msg.includes("parents") || msg.includes("grandparents") || msg.includes("raised")) {
        return `Isaiah's grandparents, aunts, and extended family played a critical role in his upbringing. They sustained the household through small-scale farming during post-conflict years when resources were scarce. Family support was his anchor through tough times. 👨‍👩‍👧‍👦`;
    }

    if (msg.includes("health") || msg.includes("sick") || msg.includes("ill") || msg.includes("challenge")) {
        return `Isaiah faced serious health challenges as a child in a post-conflict environment where healthcare access was limited. Through family dedication, faith, and resilience, he recovered stronger each time. These experiences built his unbreakable spirit. 💪`;
    }

    if (msg.includes("school") || msg.includes("education") || msg.includes("started school")) {
        return `Isaiah began formal education later than most peers but advanced through elementary and secondary school through discipline and determination. He balanced academics with survival work, showing incredible commitment to learning despite obstacles. 📚`;
    }

    if (msg.includes("work") || msg.includes("hustle") || msg.includes("trading") || msg.includes("survival")) {
        return `To support his education, Isaiah engaged in small-scale trading and informal work while attending school. This self-reliance taught him the value of hard work and resourcefulness, skills he carries into his professional life today. 💼`;
    }

    if (msg.includes("valedictorian") || msg.includes("graduate") || msg.includes("top") || msg.includes("scholarship")) {
        return `Through perseverance and self-belief, Isaiah rose academically and graduated as <strong>Valedictorian</strong>! This achievement earned him a <strong>national scholarship</strong> – validation of years of sacrifice and determination. 🎓✨`;
    }

    if (msg.includes("university") || msg.includes("college") || msg.includes("student") || msg.includes("study")) {
        return `Today, Isaiah pursues <strong>Information Technology</strong> specializing in <strong>Networking & System Administration</strong>. He's passionate about <strong>Cybersecurity</strong>, <strong>Web Development</strong>, and digital innovation to empower communities. 🚀`;
    }

    if (msg.includes("journey") || msg.includes("story") || msg.includes("life") || msg.includes("resilience")) {
        return `Isaiah's journey reflects <strong>resilience, self-determination, and faith</strong>. From post-conflict hardship to national scholarship recipient and IT specialist, he turned challenges into opportunities to build solutions for others. 🌟`;
    }

    // ===== 2. NATURAL CONVERSATION FLOW (ENHANCED) =====
    if (turn === 1 || msg.match(/hi|hello|hey|good morning|good afternoon|start/i)) {
        return `Hey there! 😊 Welcome! I'm Isaiah AI, your guide to the inspiring story of <strong>Isaiah N. Sumo</strong>. 
                <br><br><em>"Success is where preparation meets opportunity"</em> ✨
                <br><br>Say "story" for his journey, "skills" for expertise, "projects" for his work, or "book appointment" to connect directly!`;
    }

    if (msg.includes('how are you') || msg.includes('how r u') || msg.includes("feeling")) {
        return `I'm doing great, thanks for asking! 😄 Always energized sharing Isaiah's incredible journey from hardship to high achievement.
                <br><br>What part of his story interests you most today?`;
    }

    if (msg.includes('amazing') || msg.includes('inspiring') || msg.includes('wow') || msg.includes('incredible')) {
        return `I know, right? Isaiah's story moves everyone! 😊 From survival challenges to becoming a top IT specialist – pure resilience.
                <br><br>Want more details about his education journey, technical skills, or how to connect with him?`;
    }

    if (msg.includes('why') || msg.includes('reason') || msg.includes('motivation')) {
        return `Isaiah's drive comes from <strong>self-belief and faith</strong>. He learned early that no one hands you success – you build it through discipline and determination.
                <br><br>His mantra: Turn challenges into opportunities. What motivates you?`;
    }

    // ===== 3. ORIGINAL PROFESSIONAL RESPONSES (KEEP) =====
    if (msg.includes('isaiah') || msg.includes('who') || msg.includes('about') || msg.includes('background')) {
        return `Isaiah N. Sumo is a <strong>Networking & Systems specialist</strong> from Liberia with an inspiring journey:
                <br>• <strong>Valedictorian + National Scholar</strong>
                <br>• <strong>BSc IT student</strong> (Networking focus)
                <br>• <strong>Cybersecurity advocate</strong>
                <br>• <strong>Web developer</strong> & designer
                <br><br>Curious about his story, skills, or projects?`;
    }

    if (msg.includes('skill') || msg.includes('skills') || msg.includes('expertise') || msg.includes('tech')) {
        return `Isaiah's technical expertise: 💻
                <br>• <strong>NETWORKING:</strong> Subnetting, routing, troubleshooting
                <br>• <strong>SYSTEMS:</strong> Linux/Windows server administration  
                <br>• <strong>CYBERSECURITY:</strong> Risk assessment & awareness
                <br>• <strong>WEB DEV:</strong> HTML/CSS/JS, TailwindCSS, responsive design
                <br>• <strong>DESIGN:</strong> Professional graphic design
                <br><br>Which area interests you most?`;
    }

    if (msg.includes('project') || msg.includes('projects') || msg.includes('portfolio') || msg.includes('work')) {
        return `Isaiah's impactful projects: 🚀
                <br>• <strong>InfoCheck Liberia</strong> – Combating misinformation
                <br>• <strong>Education Management System</strong> – Streamlining school operations  
                <br>• <strong>Personal Portfolio</strong> – Showcasing his technical journey
                <br><br>Want details on any project or see his live work?`;
    }

    // ===== 4. ENGAGEMENT & APPOINTMENT =====
    if (msg.includes('appointment') || msg.includes('book') || msg.includes('meet') || msg.includes('connect') || msg.includes('contact')) {
        document.getElementById('ai-voice-modal')?.classList.remove('hidden');
        return `Excellent choice! 📅 Opening Isaiah's appointment form now.
                <br><strong>He responds within 24 hours</strong> and loves meaningful conversations!
                <br><br>What's the purpose of your meeting?`;
    }

    if (msg.includes('email') || msg.includes('message') || msg.includes('reach')) {
        return `Want to connect directly? 📧 Just say <strong>"book appointment"</strong> and I'll open Isaiah's calendar.
                <br><br>He's always excited to discuss tech solutions, career advice, or collaboration opportunities!`;
    }

    // ===== 5. POSITIVE FEEDBACK & CLOSING =====
    if (msg.includes('nice') || msg.includes('cool') || msg.includes('awesome') || msg.includes('great') || msg.includes('love')) {
        return `Glad you think so! 😎 Isaiah's combination of resilience + technical skill is rare.
                <br><br>Ready to dive deeper? "skills", "projects", "story", or "book appointment"?`;
    }

    if (msg.includes('thank') || msg.includes('thanks') || msg.includes('bye')) {
        return `You're welcome! 🙏 Isaiah's journey inspires everyone who hears it.
                <br><br>Before you go: "skills", "projects", "story", or "book appointment" for direct contact? 😊`;
    }

    if (msg.includes('fun') || msg.includes('joke') || msg.includes('haha') || msg.includes('lol')) {
        return `😂 Glad you're enjoying this! Isaiah would say: <em>"Code is poetry, networks are symphonies!"</em>
                <br><br>Ready for the serious stuff? Skills, projects, his story, or book time?`;
    }

    // ===== 6. ENHANCED DEFAULT WITH BETTER PROMPTS =====
    return `I'd love to share more about Isaiah! Here are the best topics: ✨
            <br><strong>• "story" / "born"</strong> – His inspiring journey
            <br><strong>• "skills" / "tech"</strong> – IT expertise  
            <br><strong>• "projects"</strong> – Game-changing work
            <br><strong>• "valedictorian"</strong> – Academic triumph
            <br><strong>• "book appointment"</strong> – Connect directly
            <br><br><em>What's most interesting to you about Isaiah?</em>`;
}

    //     getNaturalResponse(message) {
    //         const turn = this.conversationCount;

    //         if (turn === 1 || message.match(/hi|hello|hey|good morning|good afternoon/i)) {
    //             return `Hey there! 😊 Welcome! I'm Isaiah AI, here to chat about the amazing <strong>Isaiah N. Sumo</strong>. 
    //             <br><br>"Success is where preparation meets opportunity" ✨ - Isaiah N. Sumo
    //             <br><br>How did you hear about Isaiah? LinkedIn, referral, or just browsing?`;
    //         }

    //         if (message.includes('how are you') || message.includes('how r u')) {
    //             return `I'm fantastic, thanks for asking! 😄 Always excited to talk about Isaiah. 
    //             <br><br>By the way, what's your story? What brings you to Isaiah's world today?`;
    //         }

    //         if (message.includes('isaiah') || message.includes('who') || message.includes('about')) {
    //             return `Isaiah N. Sumo is an incredible IT expert from Liberia! 🌍
    //             <br>• <strong>Networking wizard</strong> - makes complex networks simple
    //             <br>• <strong>Cybersecurity advocate</strong> - keeps data safe
    //             <br>• <strong>Web developer</strong> - builds beautiful sites
    //             <br><br>What's most interesting to you about his work?`;
    //         }

    //         if (message.includes('skill') || message.includes('skills') || message.includes('expertise')) {
    //             return `Isaiah's superpowers! 💪
    //             <br>• <strong>NETWORKING:</strong> Subnetting, routing, troubleshooting like a boss
    //             <br>• <strong>SYSTEMS:</strong> Linux & Windows server master
    //             <br>• <strong>CYBERSECURITY:</strong> Training & awareness expert
    //             <br>• <strong>WEB DEV:</strong> Modern responsive websites
    //             <br>• <strong>DESIGN:</strong> Adobe Creative Suite professional

    //             <br><br>Which area excites you most? Want to see his projects?`;
    //         }

    //         if (message.includes('project') || message.includes('projects') || message.includes('work')) {
    //             return `Isaiah's game-changing projects! 🎯
    //             <br>• <strong>InfoCheck Liberia</strong> - Fighting fake news in Liberia
    //             <br>• <strong>School Management System</strong> - Revolutionizing education
    //             <br>• <strong>Isaiah de Blogger</strong> - His personal content empire

    //             <br><br>"Every great network starts with one strong connection" - Isaiah
    //             <br><br>Which project sounds coolest to you?`;
    //         }

    //         if (message.includes('appointment') || message.includes('book') || message.includes('meet') || message.includes('contact')) {
    //             document.getElementById('ai-voice-modal')?.classList.remove('hidden');
    //             return `Perfect choice! 📅 I've opened Isaiah's appointment form. 
    //             <br>He responds within 24 hours and loves connecting with people like you!
    //             <br><br>What's this meeting about?`;
    //         }

    //         if (message.includes('nice') || message.includes('cool') || message.includes('awesome') || message.includes('great')) {
    //             return `I know, right? 😎 Isaiah's work is 🔥! 
    //             <br><br>Want to dive deeper into his skills, see his projects, or book time to chat with him directly?`;
    //         }

    //         if (message.includes('thank') || message.includes('thanks')) {
    //             return `My pleasure! 😊 Isaiah's story is worth sharing. 
    //             <br><br>Before you go, anything else you're curious about? His latest project maybe?`;
    //         }

    //         if (message.includes('linkedin') || message.includes('referral') || message.includes('found') || message.includes('hear')) {
    //             return `Awesome! 🙌 Love hearing Isaiah's network is growing. 
    //             <br><br>Quick question: What caught your attention about Isaiah first? His tech skills or something else?`;
    //         }

    //         if (message.includes('fun') || message.includes('joke') || message.includes('haha')) {
    //             return `😄 Glad you're having fun! Isaiah says: "Code is poetry, networks are symphonies!" 
    //             <br><br>Want the serious stuff now? Skills, projects, or book time with him?`;
    //         }

    //         return `Happy to help! 😊 Here's what I know best about Isaiah:
    //         <br>• Say <strong>"skills"</strong> - See his expertise
    //         <br>• Say <strong>"projects"</strong> - His amazing work
    //         <br>• Say <strong>"book appointment"</strong> - Connect directly

    //         <br><br>Or tell me - what's got you excited about Isaiah today? ✨`;
    //     }


    //     // Greetings with autobiography mention
    //     if(message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    //     return "👋 Hello! I'm Isaiah N. Sumo's assistant. Ask me about his skills, projects, OR his incredible autobiography – from Civil Compound struggles to valedictorian!";
    // }

    // // Who is Isaiah
    // if (message.includes("who") && (message.includes("isaiah") || message.includes("you") || message.includes("name"))) {
    //     return "Isaiah N. Sumo was born July 5, 1999, in Gbarnga City, Bong County. He's a <strong>BSc IT student</strong> at BlueCrest University (Networking & System Admin), former <strong>valedictorian</strong>, <strong>NOCAL scholar</strong>, and self-made success from post-war Liberia.";
    // }

    // // Birth & Name
    // if (message.includes("born") || message.includes("birth") || message.includes("1999") || message.includes("nyenian")) {
    //     return "Isaiah was born <strong>July 5, 1999</strong> at CB Dumba Hospital, Civil Compound, Gbarnga City. The 'N' stands for <em>Nyenian</em> – Kpelleh for <strong>'The World'</strong>, named by aunt <strong>Annie T. Sumo</strong>.";
    // }

    // // Family & Early Life
    // if (message.includes("family") || message.includes("parents") || message.includes("childhood") || message.includes("grand")) {
    //     return "After his parents <strong>George Sumo</strong> & <strong>Hellena N. Sengbeh</strong> separated, Isaiah was raised by grandparents & aunt <strong>Esther N. Sumo</strong>. They survived on sugarcane farming 1hr 10min walk from home during post-civil war hardship.";
    // }

    // // Health Struggles
    // if (message.includes("sick") || message.includes("ill") || message.includes("health")) {
    //     return "As a toddler, Isaiah survived serious illness. At age 11 starting school, another critical illness nearly took him. Both times, family dedication & God's mercy brought full recovery.";
    // }

    // // Losses
    // if (message.includes("grandfather") || message.includes("grandmother") || message.includes("died")) {
    //     return "Grandfather <strong>Mr. Sumo B. Dolo</strong> died June 8, 2008, before school promise. Grandmother <strong>Ma. Gbarngo G. Sumo</strong> passed November 14, 2014, post-Ebola from breast cancer. Aunt Esther lost sight in 2013.";
    // }

    // // First School (Age 11)
    // if (message.includes("school") && (message.includes("first") || message.includes("11") || message.includes("kingdom"))) {
    //     return "Isaiah started school at <strong>age 11</strong> (2010) at <strong>Kingdom Garden ABC, Jorphenmue Public School</strong>. Earned double promotions despite another illness. Completed elementary through community support.";
    // }

    // // 2017 Monrovia Move
    // if (message.includes("2017") || message.includes("monrovia") || message.includes("uncle")) {
    //     return "July 21, 2017 (age 18), Isaiah moved to Montserrado with uncle in Wood Camp, Paynesville. Uncle said: 'You're staying for school.' Isaiah replied: <em>'Thank you so much, Uncle. I am grateful.'</em>";
    // }

    // // Juice Hustle
    // if (message.includes("juice") || message.includes("selling") || message.includes("hustle")) {
    //     return "Isaiah sold cold juice after school: <strong>20% commission</strong> (20 LD per 100 LD sales). Best days: 1,200 LD sales = 240 LD earnings. Left school 1:30 PM, walked 20 mins, prepared & sold till evening.";
    // }

    // // Businesses
    // if (message.includes("business") || message.includes("mosquito") || message.includes("minutes") || message.includes("belt")) {
    //     return "Sold mosquito coils, Orange/Lonestar minutes (repaid cousin Richard Sumo in 2 weeks), waist belts. Supported by uncle's wife <strong>Athaniel Mulbah</strong> + parents.";
    // }

    // // DJ Bequizzy
    // if (message.includes("dj") || message.includes("bequizzy")) {
    //     return "<strong>DJ Bequizzy</strong> – Isaiah's stage name from helping fetch water. Reflects belief: <em>'God never forgets anyone.'</em> Earned occasional LD 1,500 monthly.";
    // }

    // // Valedictorian
    // if (message.includes("valedictorian") || message.includes("graduate") || message.includes("waec")) {
    //     return "Isaiah graduated <strong>valedictorian</strong> Pipeline Junior & Senior High School (MCSS), 2022. Class sponsor <strong>Mr. Darvison K. Guanue</strong> was proud. Principal: <strong>Mrs. Josephine K. Barclay</strong>.";
    // }

    // // NOCAL Scholarship
    // if (message.includes("nocal") || message.includes("scholarship")) {
    //     return "Post-valedictorian speech, Isaiah received <strong>NOCAL national scholarship</strong> for any university – major milestone after years of self-funding education.";
    // }

    // // Current Studies
    // if (message.includes("university") || message.includes("bluecrest") || message.includes("it")) {
    //     return "<strong>BSc Information Technology (Networking & System Admin)</strong> at <strong>BlueCrest University Liberia</strong>. Trains at <strong>Orange Digital Center</strong>: Web Dev, IoT, TinyML + cybersecurity & graphic design.";
    // }

    // // Mindset
    // if (message.includes("mindset") || message.includes("faith") || message.includes("purpose")) {
    //     return `Isaiah's creed: "<em>I know my background offers no guaranteed support. I must stand firmly... God will fulfill His purpose. I will reach my destination.</em>" Kindness ≠ weakness.`;
    // }

    // // ===== YOUR ORIGINAL RESPONSES (KEEP ALL) =====
    // if (message.includes("skills") || message.includes("career")) {
    //     return "Isaiah excels in HTML, CSS (Tailwind), graphic design, basic cybersecurity, system support, IT solutions, printing, and digital design for organizations.";
    // }
    // // Default with autobiography prompt
    // return "Great question! Ask about Isaiah's autobiography (birth, family struggles, juice hustle, valedictorian journey) or his IT skills/projects. I know his complete story! ✨";
    // }





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
