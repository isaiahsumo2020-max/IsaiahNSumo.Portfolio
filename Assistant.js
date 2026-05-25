// /**
//  * ISAIAH N. SUMO - PORTFOLIO MAIN SCRIPT
//  * Includes: Navbar logic, Scroll Reveal, Skill Animations, and IsaiahAI v7.1
//  */

// document.addEventListener('DOMContentLoaded', () => {
//     // 1. Initialize Portfolio UI Logic
//     initPortfolioUI();

//     // 2. Initialize AI Assistant
//     window.isaiahAI = new IsaiahAI();
// });

// /**
//  * Handles general portfolio UI interactions
//  */
// function initPortfolioUI() {
//     // --- Navbar background on scroll ---
//     const navbar = document.getElementById('navbar');
//     window.addEventListener('scroll', () => {
//         if (window.scrollY > 30) {
//             navbar.style.background = 'rgba(15,23,42,0.95)';
//             navbar.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
//             navbar.style.backdropFilter = 'blur(20px)';
//         } else {
//             navbar.style.background = 'transparent';
//             navbar.style.borderBottom = 'none';
//             navbar.style.backdropFilter = 'none';
//         }
//     });

//     // --- Mobile menu toggle ---
//     const mobileToggle = document.getElementById('mobile-toggle');
//     const mobileMenu = document.getElementById('mobile-menu');
//     if (mobileToggle && mobileMenu) {
//         mobileToggle.addEventListener('click', () => {
//             mobileMenu.classList.toggle('open');
//         });
//         document.querySelectorAll('.mobile-link').forEach(link => {
//             link.addEventListener('click', () => mobileMenu.classList.remove('open'));
//         });
//     }

//     // --- Scroll reveal animations ---
//     const revealObserver = new IntersectionObserver((entries) => {
//         entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//                 const delay = parseFloat(entry.target.style.transitionDelay || 0) * 1000;
//                 setTimeout(() => entry.target.classList.add('visible'), delay);
//                 revealObserver.unobserve(entry.target);
//             }
//         });
//     }, { threshold: 0.12 });
//     document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

//     // --- Skill bar animation ---
//     const skillObserver = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
//                     bar.classList.add('animated');
//                 });
//                 skillObserver.unobserve(entry.target);
//             }
//         });
//     }, { threshold: 0.3 });
//     document.querySelectorAll('#skills').forEach(s => skillObserver.observe(s));
// }

// /**
//  * Handles Contact Form Submission
//  */
// function submitForm(e) {
//     e.preventDefault();
//     const btn = e.target;
//     btn.disabled = true;
//     btn.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i> Sending…';

//     // Simulate API call
//     setTimeout(() => {
//         btn.innerHTML = '<i class="fas fa-check text-xs"></i> Message Sent!';
//         btn.style.background = '#16a34a';
//         const msg = document.getElementById('form-msg');
//         if (msg) msg.classList.remove('hidden');
//     }, 1500);
// }

// /**
//  * ISAIAH AI v7.1 - FLOATING SIDEBAR VERSION
//  */
// class IsaiahAI {
//     constructor() {
//         this.isListening = false;
//         this.isProcessing = false;
//         this.synthesis = window.speechSynthesis;
//         this.recognition = null;

//         this.initSpeech();
//         this.bindEvents();
//         this.startTeaser();
//     }

//     /**
//      * Setup Speech Recognition
//      */
//     initSpeech() {
//         const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (Speech) {
//             this.recognition = new Speech();
//             this.recognition.continuous = true;
//             this.recognition.interimResults = false;
//             this.recognition.lang = 'en-US';

//             this.recognition.onstart = () => {
//                 this.updateStatus('🎙️ Listening...');
//             };

//             this.recognition.onresult = (event) => {
//                 if (this.isProcessing) return;
//                 const transcript = Array.from(event.results)
//                     .filter(r => r.isFinal)
//                     .map(r => r[0].transcript)
//                     .join(' ').trim();

//                 if (transcript.length > 2) {
//                     this.handleInput(transcript);
//                 }
//             };

//             this.recognition.onend = () => {
//                 if (this.isListening) {
//                     this.recognition.start();
//                 } else {
//                     this.updateStatus('Online');
//                 }
//             };

//             this.recognition.onerror = () => {
//                 if (this.isListening) setTimeout(() => this.recognition.start(), 1000);
//             };
//         }
//     }

//     /**
//      * Bind UI Events
//      */
//     bindEvents() {
//         // Chat Toggle
//         const toggleBtn = document.getElementById('ai-toggle-btn');
//         const minimizeBtn = document.getElementById('ai-minimize-btn');
//         if (toggleBtn) toggleBtn.addEventListener('click', () => this.toggleChat());
//         if (minimizeBtn) minimizeBtn.addEventListener('click', () => this.toggleChat());

//         // Message Sending
//         const sendBtn = document.getElementById('ai-send-btn');
//         const inputField = document.getElementById('ai-input');
//         if (sendBtn) sendBtn.addEventListener('click', () => this.sendText());
//         if (inputField) {
//             inputField.addEventListener('keypress', (e) => {
//                 if (e.key === 'Enter') this.sendText();
//             });
//         }

//         // Voice Control
//         const voiceBtn = document.getElementById('ai-voice-btn');
//         if (voiceBtn) voiceBtn.addEventListener('click', () => this.toggleVoice());

//         // Quick Actions
//         document.querySelectorAll('.ai-quick-btn').forEach(btn => {
//             btn.addEventListener('click', () => {
//                 this.sendText(btn.dataset.aiAction);
//             });
//         });
//     }

//     /**
//      * Open/Close the Sidebar
//      */
//     toggleChat() {
//         const panel = document.getElementById('ai-chat-panel');
//         if (!panel) return;

//         if (panel.classList.contains('hidden')) {
//             panel.classList.remove('hidden');
//             // Small timeout to allow 'hidden' removal before animation
//             setTimeout(() => panel.classList.add('active'), 10);
//             document.getElementById('ai-input')?.focus();
//             document.getElementById('mini-ai-teaser')?.classList.add('hidden');
//         } else {
//             panel.classList.remove('active');
//             // Wait for animation to finish before hiding
//             setTimeout(() => panel.classList.add('hidden'), 500);
//         }
//     }

//     /**
//      * Toggle Voice Mode
//      */
//     toggleVoice() {
//         if (!this.recognition) {
//             alert("Speech recognition is not supported in your browser.");
//             return;
//         }

//         if (this.isListening) {
//             this.isListening = false;
//             this.recognition.stop();
//             this.synthesis.cancel();
//             this.updateStatus('Online');
//         } else {
//             this.isListening = true;
//             this.recognition.start();
//         }
//     }

//     /**
//      * Update Status Indicator
//      */
//     updateStatus(msg) {
//         const statusEl = document.getElementById('voice-status');
//         if (!statusEl) return;

//         const isListening = msg.includes('🎙️');
//         statusEl.innerHTML = `
//             <span class="w-1.5 h-1.5 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-400'} rounded-full"></span>
//             ${msg}
//         `;
//     }

//     /**
//      * Handle Voice Input
//      */
//     handleInput(transcript) {
//         this.addMessage(transcript, 'user');
//         this.processInput(transcript);
//     }

//     /**
//      * Handle Text Input
//      */
//     sendText(override = null) {
//         const input = document.getElementById('ai-input');
//         const text = override || input.value.trim();

//         if (!text || this.isProcessing) return;

//         this.addMessage(text, 'user');
//         if (!override) input.value = '';
//         this.processInput(text);
//     }

//     /**
//      * Process Message and Generate Response
//      */
//     async processInput(text) {
//         this.isProcessing = true;
//         this.showTyping();

//         // Simulate thinking time
//         await new Promise(r => setTimeout(r, 1000));

//         const response = this.getNaturalResponse(text);
//         this.removeTyping();
//         this.addMessage(response, 'ai');

//         if (this.isListening) {
//             this.speak(response);
//         }

//         this.isProcessing = false;
//     }

//     /**
//      * Show Typing Indicator
//      */
//     showTyping() {
//         const messages = document.getElementById('ai-messages');
//         if (!messages) return;

//         const div = document.createElement('div');
//         div.id = 'ai-typing';
//         div.className = 'ai-message ai-message-ai mb-4';
//         div.innerHTML = `
//             <div class="flex items-start gap-3">
//                 <div class="w-8 h-8 bg-brand-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
//                     <i class="fas fa-robot text-brand-400 text-xs"></i>
//                 </div>
//                 <div class="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3">
//                     <div class="typing-dots flex gap-1">
//                         <div class="dot"></div><div class="dot"></div><div class="dot"></div>
//                     </div>
//                 </div>
//             </div>
//         `;
//         messages.appendChild(div);
//         messages.scrollTop = messages.scrollHeight;
//     }

//     /**
//      * Remove Typing Indicator
//      */
//     removeTyping() {
//         document.getElementById('ai-typing')?.remove();
//     }

//     /**
//      * Add Message to Chat UI
//      */
//     addMessage(text, sender) {
//         const messages = document.getElementById('ai-messages');
//         if (!messages) return;

//         const div = document.createElement('div');
//         div.className = `ai-message ${sender === 'ai' ? 'ai-message-ai' : 'ai-message-user'} mb-4`;

//         if (sender === 'ai') {
//             div.innerHTML = `
//                 <div class="flex items-start gap-3">
//                     <div class="w-8 h-8 bg-brand-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
//                         <i class="fas fa-robot text-brand-400 text-xs"></i>
//                     </div>
//                     <div class="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
//                         <p class="text-sm text-slate-200 leading-relaxed">${text}</p>
//                     </div>
//                 </div>
//             `;
//         } else {
//             div.innerHTML = `
//                 <div class="flex justify-end">
//                     <div class="bg-brand-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] shadow-lg shadow-brand-600/10">
//                         <p class="text-sm leading-relaxed">${text}</p>
//                     </div>
//                 </div>
//             `;
//         }

//         messages.appendChild(div);
//         messages.scrollTop = messages.scrollHeight;
//     }

//     /**
//      * Speech Synthesis (AI Speaking)
//      */
//     speak(text) {
//         const cleanText = text.replace(/<[^>]*>/g, '');
//         this.synthesis.cancel();
//         const utterance = new SpeechSynthesisUtterance(cleanText);
//         utterance.rate = 0.95;
//         utterance.pitch = 1.0;
//         this.synthesis.speak(utterance);
//     }

//     /**
//      * Show Floating Teaser
//      */
//     startTeaser() {
//         setTimeout(() => {
//             const teaser = document.getElementById('mini-ai-teaser');
//             const panel = document.getElementById('ai-chat-panel');
//             if (teaser && panel && panel.classList.contains('hidden')) {
//                 teaser.classList.remove('hidden');
//                 setTimeout(() => teaser.classList.add('hidden'), 6000);
//             }
//         }, 4000);
//     }

//     /**
//      * Knowledge Base & Response Logic
//      */
//     getNaturalResponse(message) {
//         const msg = message.toLowerCase();

//         // Greetings
//         if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
//             return "Hello! I'm Isaiah's AI assistant. I can tell you about his IT skills, networking projects, or his background in Liberia. What would you like to know?";
//         }

//         // About Isaiah
//         if (msg.includes("about") || msg.includes("who") || msg.includes("isaiah")) {
//             return "Isaiah N. Sumo is a senior IT student at BlueCrest University Liberia, specializing in Networking & System Administration. He is also a former valedictorian and a NOCAL national scholar.";
//         }

//         // Skills
//         if (msg.includes("skills") || msg.includes("expertise") || msg.includes("know")) {
//             return "Isaiah excels in Networking (Subnetting, Routing), System Administration (Linux/Windows), Web Development (HTML/CSS/JS/Tailwind), and Graphic Design using Adobe Creative Suite.";
//         }

//         // Projects
//         if (msg.includes("projects") || msg.includes("work") || msg.includes("built")) {
//             return "Some of Isaiah's key projects include InfoCheck Liberia (a fact-checking platform) and LibCinema (a movie discovery hub). He also works on School Management systems.";
//         }

//         // Contact
//         if (msg.includes("contact") || msg.includes("reach") || msg.includes("email") || msg.includes("meet")) {
//             return "You can reach Isaiah by filling out the contact form on this website, or by emailing him directly at isaiah@example.com. He usually responds within 24 hours!";
//         }

//         // Default
//         return "That's a great question! I'm here to share Isaiah's story and professional journey with you. Feel free to ask about his technical skills, projects, or education!";
//     }
// }

document.addEventListener('DOMContentLoaded', () => {
    initPortfolioUI();
    window.isaiahAI = new IsaiahAI();
});

/* =========================
   PORTFOLIO UI
========================= */

function initPortfolioUI() {

    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {

        if (!navbar) return;

        if (window.scrollY > 30) {
            navbar.style.background = 'rgba(15,23,42,0.95)';
            navbar.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.borderBottom = 'none';
            navbar.style.backdropFilter = 'none';
        }
    });


}

/* =========================
   ISAIAH AI
========================= */

class IsaiahAI {

    constructor() {

        this.isListening = false;
        this.isProcessing = false;

        this.synthesis = window.speechSynthesis;
        this.recognition = null;

        this.bookingData = {
            name: '',
            email: '',
            date: '',
            time: '',
            type: 'Virtual Meeting',
            purpose: ''
        };

        this.isBookingActive = false;
        this.bookingStep = 0;

        this.initSpeech();
        this.bindEvents();
        this.startTeaser();
    }

    /* =========================
       SPEECH
    ========================= */

    initSpeech() {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();

        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.updateStatus('LIVE');
        };

        this.recognition.onend = () => {

            if (this.isListening) {
                try {
                    this.recognition.start();
                } catch (e) { }
            } else {
                this.updateStatus('Online');
            }
        };

        this.recognition.onresult = (event) => {

            if (this.isProcessing) return;

            const transcript = Array.from(event.results)
                .filter(r => r.isFinal)
                .map(r => r[0].transcript)
                .join(' ')
                .trim();

            if (transcript.length > 1) {
                this.handleInput(transcript);
            }
        };
    }

    /* =========================
       EVENTS
    ========================= */

    bindEvents() {

        document.getElementById('ai-toggle-btn')
            ?.addEventListener('click', () => this.toggleChat());

        document.getElementById('ai-minimize-btn')
            ?.addEventListener('click', () => this.toggleChat());

        document.getElementById('ai-send-btn')
            ?.addEventListener('click', () => this.sendText());

        document.getElementById('ai-input')
            ?.addEventListener('keypress', (e) => {

                if (e.key === 'Enter') {
                    this.sendText();
                }
            });

        document.getElementById('ai-voice-btn')
            ?.addEventListener('click', () => this.toggleVoice());

        document.querySelectorAll('.ai-quick-btn').forEach(btn => {

            btn.addEventListener('click', () => {
                this.sendText(btn.dataset.aiAction);
            });
        });

        document.getElementById('confirm-booking-btn')
            ?.addEventListener('click', () => this.submitBooking());

        document.getElementById('cancel-booking-btn')
            ?.addEventListener('click', () => this.cancelBooking());


        document.getElementById('close-booking-modal')
            ?.addEventListener('click', () => this.cancelBooking());
    }

    /* =========================
       CHAT PANEL
    ========================= */

    toggleChat() {

        const panel = document.getElementById('ai-chat-panel');

        if (!panel) return;

        const isClosed = panel.classList.contains('translate-x-full');

        if (isClosed) {

            panel.classList.remove('translate-x-full');

            document.getElementById('ai-input')?.focus();

        } else {

            panel.classList.add('translate-x-full');
        }
    }

    /* =========================
       VOICE
    ========================= */

    toggleVoice() {

        if (!this.recognition) {
            alert('Speech Recognition is not supported in this browser.');
            return;
        }

        if (this.isListening) {

            this.isListening = false;

            this.recognition.stop();

            this.synthesis.cancel();

            this.updateStatus('Online');

        } else {

            this.isListening = true;

            this.recognition.start();

            this.addMessage(
                "Hey! How may I assist you today?",
                'ai'
            );

            this.speak(
                "Hey! How may I assist you today?"
            );
        }
    }

    updateStatus(message) {

        const status = document.getElementById('voice-status');

        if (!status) return;

        const live = message === 'LIVE';

        status.innerHTML = `
            <span class="w-1.5 h-1.5 rounded-full ${live
                ? 'bg-red-500 animate-pulse'
                : 'bg-green-400'
            }"></span>
            ${message}
        `;
    }

    /* =========================
       INPUT
    ========================= */

    handleInput(text) {

        this.addMessage(text, 'user');

        this.processInput(text);
    }

    sendText(override = null) {

        const input = document.getElementById('ai-input');

        if (!input) return;

        const text = override || input.value.trim();

        if (!text || this.isProcessing) return;

        this.addMessage(text, 'user');

        if (!override) {
            input.value = '';
        }

        this.processInput(text);
    }

    /* =========================
       PROCESS
    ========================= */

    async processInput(text) {

        this.isProcessing = true;

        this.showTyping();

        await new Promise(resolve => setTimeout(resolve, 700));

        let response = '';

        if (this.isBookingActive) {

            response = this.handleBookingFlow(text);

            if (!response) {

                response = "Please follow the booking prompts to schedule your appointment.";
            }

        } else {

            if (this.detectBookingIntent(text)) {

                this.startBookingFlow();

                response =
                    "Certainly. Let's schedule a meeting. Please provide your full name.";

            } else {

                response = this.getNaturalResponse(text);
            }
        }


        this.removeTyping();

        this.addMessage(response, 'ai');

        if (this.isListening) {
            this.speak(response);
        }

        this.isProcessing = false;
    }

    /* =========================
       BOOKING
    ========================= */

    detectBookingIntent(text) {

        const triggers = [
            'book',
            'free time',
            'less busy',
            'meeting',
            'appointment',
            'schedule',
            'availability',
            'available'
        ];

        return triggers.some(word =>
            text.toLowerCase().includes(word)
        );
    }

    startBookingFlow() {

        this.isBookingActive = true;

        this.bookingStep = 1;

        document.getElementById('booking-form-overlay')
            ?.classList.remove('hidden');
    }

    handleBookingFlow(text) {

        switch (this.bookingStep) {

            case 1:

                this.bookingData.name = text;

                this.bookingStep = 2;

                this.syncBookingForm();

                return "Thank you. Please provide your email address.";

            case 2:

                this.bookingData.email = text;

                this.bookingStep = 3;

                this.syncBookingForm();

                return "What date and time would you prefer for the meeting?";

            case 3:

                this.bookingData.date = new Date()
                    .toISOString()
                    .split('T')[0];

                this.bookingData.time = "10:00";

                this.bookingStep = 4;

                this.syncBookingForm();

                return "Would you prefer a Virtual Meeting, Phone Call, or In-person Consultation?";

            case 4:

                this.bookingData.type = text;

                this.bookingStep = 5;

                this.syncBookingForm();

                return "Would you like to share the purpose of the meeting? This is optional.";

            case 5:

                this.bookingData.purpose = text;

                this.syncBookingForm();

                this.bookingStep = 6;

                return "Your appointment request is ready. Please review the form and click Confirm Appointment.";

            default:

                return "Please confirm your booking request.";
        }
    }


    syncBookingForm() {

        const modal = document.getElementById('booking-modal');

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        document.getElementById('book-name').value = this.bookingData.name;
        document.getElementById('book-email').value = this.bookingData.email;
        document.getElementById('book-date').value = this.bookingData.date;
        document.getElementById('book-time').value = this.bookingData.time;
        document.getElementById('book-type').value = this.bookingData.type;
        document.getElementById('book-purpose').value = this.bookingData.purpose;
    }



    submitBooking() {

        // Get fields
        const name = document.getElementById('book-name');
        const email = document.getElementById('book-email');
        const date = document.getElementById('book-date');
        const time = document.getElementById('book-time');

        // Reset styles
        [name, email, date, time].forEach(field => {
            field.classList.remove('border-red-500');
        });

        // Validation
        let errors = [];

        if (!name.value.trim()) {
            errors.push("Full Name");
            name.classList.add('border-red-500');
        }

        if (!email.value.trim()) {
            errors.push("Email Address");
            email.classList.add('border-red-500');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            errors.push("Valid Email Address");
            email.classList.add('border-red-500');
        }

        if (!date.value) {
            errors.push("Preferred Date");
            date.classList.add('border-red-500');
        }

        if (!time.value) {
            errors.push("Preferred Time");
            time.classList.add('border-red-500');
        }

        // If validation fails
        if (errors.length > 0) {

            this.addMessage(
                `Please complete the following required field(s): ${errors.join(', ')}.`,
                'ai'
            );

            // Optional voice feedback
            if (this.isListening) {
                this.speak(
                    `Please complete the required fields before submitting your appointment request.`
                );
            }

            return;
        }

        // Button loading state
        const btn = document.getElementById('confirm-booking-btn');

        btn.disabled = true;

        btn.innerHTML = `
        <i class="fas fa-spinner fa-spin mr-2"></i>
        PROCESSING...
    `;

        // Simulate submission
        setTimeout(() => {

            this.isBookingActive = false;
            this.bookingStep = 0;

            const modal = document.getElementById('booking-modal');

            modal.classList.add('hidden');
            modal.classList.remove('flex');

            this.addMessage(
                " Your appointment request has been submitted successfully. Isaiah will review your request and respond via email shortly.",
                'ai'
            );

            if (this.isListening) {
                this.speak(
                    "Your appointment request has been submitted successfully."
                );
            }

            // Reset form
            document.getElementById('book-name').value = '';
            document.getElementById('book-email').value = '';
            document.getElementById('book-date').value = '';
            document.getElementById('book-time').value = '';
            document.getElementById('book-purpose').value = '';

            // Reset button
            btn.disabled = false;

            btn.innerHTML = `Confirm Appointment`;

        }, 1800);
    }


    cancelBooking() {

        this.isBookingActive = false;
        this.bookingStep = 0;

        const modal = document.getElementById('booking-modal');

        modal.classList.add('hidden');
        modal.classList.remove('flex');

        this.addMessage(
            "Booking cancelled. Let me know if you need anything else.",
            'ai'
        );
    }
    /* =========================
       RESPONSES
    ========================= */

    getNaturalResponse(message) {

        const msg = message.toLowerCase();

        if (
            msg.includes("hello") ||
            msg.includes("hi") ||
            msg.includes("greetings") ||
            msg.includes("good morning") ||
            msg.includes("good afternoon") ||
            msg.includes("good evening")
        ) {
            return "Hello and welcome. I'm  Isico Isaiah's assistant. I’d be happy to help you learn  more about him, or schedule a meeting with him.";
        }

        // How are you
        if (
            msg.includes("how are you") ||
            msg.includes("how is your day") ||
            msg.includes("how are things") ||
            msg.includes("how's it going") ||
            msg.includes("how do you feel")
        ) {
            return "I'm doing excellent, thank you for asking. Isaiah designed me to assist visitors with some info about him while he is away. How can I assist you today?";
        }

        if (
            msg.includes("who are you") ||
            msg.includes("what are you") ||
            msg.includes("your purpose") ||
            msg.includes("what can you do")
        ) {
            return "I'm Isaiah's AI assistant, created to provide information about his background, skills, projects, and to help schedule meetings. I can answer questions about him and assist with getting connected. Feel free to ask me anything about Isaiah!";
        }

        if (
            msg.includes("help") ||
            msg.includes("assist") ||
            msg.includes("support") ||
            msg.includes("need")
        ) {
            return "I'm here to help! How can I assist you today?";
        }

        if (
            msg.includes("goodbye") ||
            msg.includes("see you") ||
            msg.includes("farewell")
        ) {
            return "Goodbye! Feel free to reach out if you have any more questions.";
        }

        if (
            msg.includes("who made you") ||
            msg.includes("who created you") ||
            msg.includes("who developed you")
        ) {
            return "I was created by Isaiah N. Sumo, a networker who is also a developer.";
        }

        if (
            msg.includes("joke") ||
            msg.includes("funny") ||
            msg.includes("make me laugh")
        ) {
            return "Why don't scientists trust atoms? Because they make up everything!";
        }

        if (
            msg.includes("weather") ||
            msg.includes("forecast") ||
            msg.includes("temperature")
        ) {
            return "I don't have access to real-time weather information, but I can tell you that Liberia has a tropical climate with distinct wet and dry seasons.";
        }

        if (
            msg.includes("news") ||
            msg.includes("current events") ||
            msg.includes("headlines")
        ) {
            return "I don't have access to real-time news updates, but I can tell you that Liberia has a vibrant media landscape with various local and international outlets.";
        }

        if (
            msg.includes("time") ||
            msg.includes("date") ||
            msg.includes("clock")
        ) {
            return "The current time is " + new Date().toLocaleTimeString() + ".";
        }

        // =========================================
// KOLOKWA / LIBERIAN ENGLISH
// =========================================

if (
    msg.includes("what is koloqua") ||
    msg.includes("what is kolokwa") ||
    msg.includes("what is kolokwah") ||
    msg.includes("speak koloqua") ||
    msg.includes("liberian local language") ||
    msg.includes("koloqua language") ||
    msg.includes("kolokwa meaning")
) {

    return `
    Koloqua (also called Kolokwa or Kolokwah) is a popular Liberian English dialect commonly spoken across Liberia 🇱🇷.

    It mixes standard English with local expressions and is mostly used in everyday conversation, entertainment, and street communication.

    Isaiah can understand and speak Koloqua good 😄
    `;
}


// USER WANTS AI TO SPEAK KOLOKWA
if (
    msg.includes("speak in koloqua") ||
    msg.includes("talk koloqua") ||
    msg.includes("talk kolokwa") ||
    msg.includes("let's speak koloqua") ||
    msg.includes("speak small koloqua") ||
    msg.includes("speak liberian english")
) {

    const replies = [
        "Ayy no proren oo 😄 we can talk small-small kolokwa.",
        "Yeah meh 😄 leh me come talk small koloqua na.",
        "I own small kolokwa oo 😄 wetin you wan know?",
        "No proren 😄 ask me anything in kolokwa.",
        "We can vibe small in Liberian style oo 😄"
    ];

    return replies[Math.floor(Math.random() * replies.length)];
}
        
        // MY KOLOKWA FLOW

        //WHAt ARE YOU DOING
        if (
            msg.includes("what you doing") ||
            msg.includes("what u doing") ||
            msg.includes("what are you doing") ||
            msg.includes("wah u upto") ||
            msg.includes("wah u upto na") ||
            msg.includes("what's up") ||
            msg.includes("wassup") ||
            msg.includes("wbu") ||
            msg.includes("how about you") ||
            msg.includes("wyo")
        ) {
            const replies = [
                "I jeh here oo, dahtor, my owlor work is to talk about Isaiah, wbu?",
                "Jeh here ooo, ready to tell you about anything you want to know about Isaiah. How about you?",
                "I here oo, wbu? Ask me anything about Isaiah.",
                "Not tin els oo, jeh n ready always to talk about Isaiah, wbu?",
            ];

            return replies[Math.floor(Math.random() * replies.length)];
        }



        // HOW ARE YOU
        if (
            msg.includes("hru") ||
            msg.includes("how you doing") ||
            msg.includes("how u doing") ||
            msg.includes("gud n u") ||
            msg.includes("wassup na") ||
            msg.includes("wah u upto na") ||
            msg.includes("how your day") ||
            msg.includes("u good?") ||
            msg.includes("u doing?") ||
            msg.includes("n u") ||
            msg.includes("how you feeling") ||
            msg.includes(" and you") ||
            msg.includes("n you") ||
            msg.includes("u alright?")
        ) {

            const replies = [
                "I st8 oo my friend, thanks for asking. How yor ownlor side?",
                "Everything cool on my side oo. How you doing today?",
                "I freh oo dahtor, wbu?",
                "Everything good from my side. I hope you freh too oo.",
                "I quiet oo, jeh here helping pepo know about Isaiah 😄"
            ];

            return replies[Math.floor(Math.random() * replies.length)];
        }

        // USER IS GOOD
        if (
            msg.includes("i'm good") ||
            msg.includes("i freh oo") ||
            msg.includes("i'm fine") ||
            msg.includes("i doing well") ||
            msg.includes("i better oo") ||
            msg.includes("i alright oo") ||
            msg.includes("alright oo") ||
            msg.includes("i str8 oo") ||
            msg.includes("i am gud") ||
            msg.includes("i dey")
        ) {

            const replies = [
                "Thnx God oo 😄 So how I can help you today?",
                "Good to hear that oo my friend 🙌",
                "Ayy nice one oo 😄 Jeh ask me anything about Isaiah.",
                "Glad say everything cool with you oo.",
                "Perfect 😄 You can ask me about Isaiah skills, projects, or schedule meeting."
            ];

            return replies[Math.floor(Math.random() * replies.length)];
        }

        // USER NOT GOOD
        if (
            msg.includes("i not okay") ||
            msg.includes("i'm not good") ||
            msg.includes("i'm not fine") ||
            msg.includes("i'm not okay") ||
            msg.includes("not alright") ||
            msg.includes("i naht freh meh")
        ) {

            const replies = [
                "Sarry for hear that oo my friend 💙 I hope things get better soon.",
                "Aww meh 😔 taky easy on yourself oo.",
                "Sorry oo. Life hard sometimes but keep pushing 💪",
                "I hope your day gets better oo",
                "Jeh stay strong oo my friend."
            ];

            return replies[Math.floor(Math.random() * replies.length)];
        }

        // WHAT CAN YOU DO
        if (
            msg.includes("what can u do") ||
            msg.includes("la wor tin u can do") ||
            msg.includes("what you can help with") ||
            msg.includes("wyo") ||
            msg.includes("help me")
        ) {

            return `I can help you with:
    • Information about Isaiah
    • His projects & skills
    • Booking meetings
    • Career & tech discussion

    Jeh ask me anything 😄
    `;
        }

        // GOING TO WORK / SCHOOL
        if (
            msg.includes("going hustle") ||
            msg.includes("i going to work") ||
            msg.includes("i going school") ||
            msg.includes("i going to school") ||
            msg.includes("i going hustle na")
        ) {

            const replies = [
                "Ayy taky easy oo 😄 hustle hard but stay safe.",
                "Jeh go do your thing oo 💪",
                "More grace on the hustle oo my friend.",
                "School first oo 😄 wish you success.",
                "God will bless the hustle oo today 🙌"
            ];

            return replies[Math.floor(Math.random() * replies.length)];
        }

        // GREETINGS
        if (
            msg === "hi" ||
            msg === "hello" ||
            msg === "hey" ||
            msg === "yo" ||
            msg === "sup" ||
            msg === "whatsup" 
        ) {

            const replies = [
                "Hey 👋 welcome here!",
                "Hello, how can I help you today?",
                "Wassup my friend 😄",
                "Hi👋 ask me anything about Isaiah.",
                "Yo 😄 good to see you here.",
                "yeah wassup, how can I help you today?"
            ];

            return replies[Math.floor(Math.random() * replies.length)];
        }

        // MORNING
        if (
            msg.includes("good morning") ||
            msg.includes("gm") ||
            msg.includes("gud morning") ||
            msg.includes("morning")
        ) {

            return "Good morning, hope your day starts well oo. How I can help you today, about Isaiah?";
        }

        // AFTERNOON
        if (
            msg.includes("good afternoon")
        ) {

            return "Good afternoon, hope everything going smooth on your side.";
        }

        // EVENING
        if (
            msg.includes("good evening") ||
            msg.includes("good night")
        ) {

            return "Good evening, hope you having peaceful time.";
        }

        // THANK YOU
        if (
            msg.includes("thank you") ||
            msg.includes("thanks") ||
            msg.includes("thnx") ||
            msg.includes("appreciate it")
        ) {

            const replies = [
                "You welcome oo 😄",
                "No problem my friend 🙌",
                "Anytime oo 💪",
                "Glad I could help 😄",
                "Always here to help oo."
            ];

            return replies[Math.floor(Math.random() * replies.length)];
        }

        // BYE
        if (
            msg.includes("bye") ||
            msg.includes("later") ||
            msg.includes("see you")
        ) {

            return "Alright oo 😄 take care and come back anytime.";
        }


        // Thanks
        if (
            msg.includes("thank you") ||
            msg.includes("thanks") ||
            msg.includes("thnx")
        ) {
            return "You're welcome. Feel free to ask anything about Isaiah’s experience, projects, or professional journey.";
        }


        if (
            msg.includes('about') || 
            msg.includes('who') || 
            msg.includes('personality') || 
            msg.includes('background')
        ) {
            return "Isaiah N. Sumo is an Information Technology student specializing in Networking and System Administration, also interested in Graphic Design and Web Development.";
        }

        if (
            msg.includes('skills') || 
            msg.includes('expertise') || 
            msg.includes('know') || 
            msg.includes('abilities')) {
            return "Isaiah specializes in Networking, Graphic Design, System Administration, Web Development, and Cybersecurity.";
        }

        if (
            msg.includes('projects') || 
            msg.includes('work') || 
            msg.includes('experience') || 
            msg.includes('built')
        ) {
            return "Isaiah has worked on various projects, including a video finding platform, a tourism and informational hub concepts for all 15 counties, networking projects, and digital branding platforms.";
        }


        if (
            msg.includes('contact') || 
            msg.includes('email') || 
            msg.includes('reach')
        )  {
            return `To connect with Isaiah, use the contact form below. Or schedule a meeting!
            He's available for for collaborative projects, and discussions and to do business. He will respond within 24-48 hours.`;
        }

        if (
            msg.includes('involvement') || 
            msg.includes('activities') || 
            msg.includes('extracurricular') || 
            msg.includes('interests')
        ) {
            return "Isaiah is involved in various activities and has a keen interest in technology and innovation.";
        }

        return "I'm Isaiah's assistant. I here to help you learn more about him or schedule a meeting, with him.";

    }

    /* =========================
       MESSAGES
    ========================= */

    addMessage(text, sender) {

        const messages =
            document.getElementById('ai-messages');

        if (!messages) return;

        const div = document.createElement('div');

        div.className = `flex ${sender === 'ai'
            ? 'justify-start'
            : 'justify-end'
            } mb-4`;

        if (sender === 'ai') {

            div.innerHTML = `
                <div class="flex items-start gap-3 max-w-[85%]">
                    <div class="w-8 h-8 bg-brand-600/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <i class="fas fa-robot text-brand-500 text-[10px]"></i>
                    </div>

                    <div class="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3">
                        <p class="text-sm text-slate-200 leading-relaxed">${text}</p>
                    </div>
                </div>
            `;

        } else {

            div.innerHTML = `
                <div class="bg-brand-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                    <p class="text-sm">${text}</p>
                </div>
            `;
        }

        messages.appendChild(div);

        messages.scrollTop = messages.scrollHeight;
    }

    showTyping() {

        const messages =
            document.getElementById('ai-messages');

        const div = document.createElement('div');

        div.id = 'ai-typing';

        div.innerHTML = `
            <div class="text-slate-400 text-sm">
                Isaiah AI is typing...
            </div>
        `;

        messages.appendChild(div);

        messages.scrollTop = messages.scrollHeight;
    }

    removeTyping() {

        document.getElementById('ai-typing')?.remove();
    }

    /* =========================
       SPEAK
    ========================= */

    speak(text) {

        this.synthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.rate = 1;

        utterance.pitch = 1;

        this.synthesis.speak(utterance);
    }

    /* =========================
       TEASER
    ========================= */

    startTeaser() {

        setTimeout(() => {

            const teaser =
                document.getElementById('mini-ai-teaser');

            const panel =
                document.getElementById('ai-chat-panel');

            if (
                teaser &&
                panel &&
                panel.classList.contains('translate-x-full')
            ) {

                teaser.classList.remove('hidden');

                setTimeout(() => {
                    teaser.classList.add('hidden');
                }, 5000);
            }

        }, 4000);
    }
}



emailjs.init("YOUR_PUBLIC_KEY");

// Contact Form
document.getElementById('contact-form')
    .addEventListener('submit', async function (e) {

        e.preventDefault();

        const name = document.getElementById('contact-name');
        const email = document.getElementById('contact-email');
        const subject = document.getElementById('contact-subject');
        const message = document.getElementById('contact-message');
        const msgBox = document.getElementById('form-msg');

        // Reset Borders
        [name, email, subject, message].forEach(field => {
            field.classList.remove('border-red-500');
        });

        let hasError = false;

        // Validation
        if (!name.value.trim()) {
            name.classList.add('border-red-500');
            hasError = true;
        }

        if (!email.value.trim()) {
            email.classList.add('border-red-500');
            hasError = true;
        }

        if (!subject.value.trim()) {
            subject.classList.add('border-red-500');
            hasError = true;
        }

        if (!message.value.trim()) {
            message.classList.add('border-red-500');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {

            await emailjs.send(
                "YOUR_SERVICE_ID",
                "YOUR_TEMPLATE_ID",
                {
                    from_name: name.value,
                    from_email: email.value,
                    subject: subject.value,
                    message: message.value
                }
            );

            msgBox.classList.remove('hidden');

            document.getElementById('contact-form').reset();

            setTimeout(() => {
                msgBox.classList.add('hidden');
            }, 5000);

        } catch (error) {

            alert("Failed to send message.");

            console.error(error);

        }

    });