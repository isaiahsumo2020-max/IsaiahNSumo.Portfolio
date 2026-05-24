/**
 * ═══════════════════════════════════════════════════════════════
 *  ISAIAH AI v9.0  —  Portfolio AI Assistant
 *  Matches Isaiah N. Sumo dark portfolio (index.html)
 *
 *  Features:
 *    ✦ Floating FAB launcher + teaser nudge
 *    ✦ Full-height slide-in chat panel (right sidebar)
 *    ✦ Claude API with multi-turn conversation memory
 *    ✦ Voice mode: mic → Claude → TTS (separate from text)
 *    ✦ End-call button stops everything cleanly
 *    ✦ Executive appointment booking modal
 *    ✦ Quick-action chips
 *    ✦ Zero conflicts with portfolio JS
 *
 *  Usage — one line before </body> in index.html:
 *    <script src="isaiah-ai.js"></script>
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     SYSTEM PROMPT (knowledge base sent to Claude API)
  ───────────────────────────────────────────────────────────── */
  const SYSTEM = `
You are Isaiah AI, the personal assistant on Isaiah N. Sumo's portfolio website.
Your purpose: answer visitor questions about Isaiah professionally, warmly, and concisely.
Keep replies to 2–4 short sentences. Never invent information not listed below.
Write in plain conversational text — no markdown asterisks, dashes, or headers.
When someone asks about booking, scheduling, or a meeting, tell them to click the calendar icon in the chat header to open the booking form.

=== IDENTITY ===
Name: Isaiah N. Sumo
Location: Monrovia, Liberia
Title: IT Student · Networking & System Administration · Cybersecurity Advocate · Web Developer · Digital Creative

=== PERSONAL STORY ===
Isaiah was born and raised in Liberia under post-conflict hardship, primarily by grandparents and extended family. He began formal education later than most peers, supporting himself through small-scale trading and informal work. His determination led him to graduate as class Valedictorian, earning a national scholarship. He self-funds his university studies and uses technology as a vehicle for personal growth and community impact.

=== EDUCATION ===
Diploma and WAEC Certificate — graduated Valedictorian, earned national scholarship.
B.Sc. Information Technology (in progress) — BlueCrest University Liberia, specializing in Networking & System Administration.

=== SKILLS ===
Networking: subnetting, routing, troubleshooting, LAN/WAN configuration, network diagnostics.
System Administration: Linux and Windows fundamentals, server setup, user management, system optimization.
Cybersecurity: security fundamentals, threat awareness, encryption basics, risk assessment, policy advocacy.
Web Development: HTML, CSS, JavaScript, Tailwind CSS, Vue.js — modern responsive frontends.
Graphic Design: Adobe Photoshop, Adobe Illustrator, print production, branding materials.

=== EXPERIENCE ===
IT Personnel · Curtis Professional Security Service (CPSS) · 2023–present. Desktop publishing, paperwork workflows, IT support.
IT Specialist · Kwaatɔnɔma Tech Solution Inc. · 2022–present. Web development, system setup, IT consulting.
Freelance · 2020–present. TQC Tech Solutions, printing and design, volunteer IT support across multiple clients.

=== PROJECTS ===
InfoCheck Liberia — prototype fact-checking and misinformation-awareness platform for Liberia. Stack: HTML/CSS/JS, Tailwind.
LibCinema — live movie discovery hub (libcinema.netlify.app). Stack: Vue.js, Tailwind.
School Management App — concept platform for LMS, student/faculty accounts, admin tools. Stack: HTML/CSS/JS.
Bequizzy de Blogger — motivational blogging platform prototype. Stack: responsive HTML/CSS.
Desktop Publishing Portfolio — professional flyers, brochures, business cards, branding via Adobe Creative Suite.

=== LEADERSHIP & ADVOCACY ===
President of PGA Foundation (Passionate Goals Achievers Foundation).
Founder of LEADS Liberia (Liberia Enterprise for Advance Digital Solutions).
YouthIGF2024 Liberia — participated in internet governance discussions.
Global Encryption Day Attendee.

=== RESEARCH ===
Thesis: "Addressing Cybersecurity Vulnerabilities Through Youth-Centered Awareness and National Policy Measures for a Safer Digital Future in Liberia."
Research interests: Cybersecurity policy, youth digital literacy, national ICT infrastructure development.

=== SERVICES ===
IT Support and System Setup · Website Design (Frontend) · Cybersecurity Awareness Training · Graphic and Print Design · Digital Literacy Workshops · Desktop Publishing.

=== AVAILABILITY ===
Open to freelance, internships, collaborations, and consulting. Isaiah responds within 24–48 hours.
`.trim();

  /* ─────────────────────────────────────────────────────────────
     STYLES — injected once, zero leakage into portfolio
  ───────────────────────────────────────────────────────────── */
  const CSS = `
/* ══ Isaiah AI v9 — scoped to #iai-root ══ */
#iai-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* ── FAB Launcher ─────────────────────── */
#iai-fab {
  position: fixed; bottom: 28px; right: 28px; z-index: 9990;
  width: 58px; height: 58px; border-radius: 50%; border: none; cursor: pointer;
  background: linear-gradient(135deg, #1d4ed8, #2563eb, #4d80ff);
  box-shadow: 0 4px 28px rgba(37,99,235,0.5);
  display: flex; align-items: center; justify-content: center; color: #fff;
  transition: transform .25s, box-shadow .25s;
}
#iai-fab:hover { transform: scale(1.1); box-shadow: 0 8px 36px rgba(37,99,235,0.6); }
#iai-fab .iai-ico-open  { display: flex; }
#iai-fab .iai-ico-close { display: none; }
#iai-fab.open .iai-ico-open  { display: none; }
#iai-fab.open .iai-ico-close { display: flex; }
#iai-fab-dot {
  position: absolute; top: 5px; right: 5px;
  width: 11px; height: 11px; border-radius: 50%;
  background: #22c55e; border: 2px solid #0f172a;
  animation: iai-pulse 2.5s ease-in-out infinite;
}
@keyframes iai-pulse { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.3);opacity:.7;} }

/* ── Teaser bubble ────────────────────── */
#iai-teaser {
  position: fixed; bottom: 98px; right: 28px; z-index: 9989;
  background: #0f172a; border: 1px solid rgba(77,128,255,.3);
  border-radius: 14px; padding: 10px 14px; max-width: 210px;
  font-family: 'DM Sans', sans-serif; font-size: .78rem; color: #94a3b8;
  box-shadow: 0 8px 28px rgba(0,0,0,.45);
  opacity: 0; transform: translateY(8px); pointer-events: none;
  transition: opacity .35s, transform .35s;
}
#iai-teaser strong { color: #80a5ff; }
#iai-teaser.show { opacity: 1; transform: translateY(0); pointer-events: auto; cursor: pointer; }
#iai-teaser::after {
  content: ''; position: absolute; bottom: -7px; right: 22px;
  border: 5px solid transparent; border-top-color: rgba(77,128,255,.3);
}

/* ── Chat panel (full-height sidebar) ─── */
#iai-panel {
  position: fixed; top: 0; right: 0; z-index: 9991;
  width: 420px; max-width: 100vw; height: 100%;
  background: rgba(9,15,29,.97); backdrop-filter: blur(24px);
  border-left: 1px solid rgba(255,255,255,.06);
  box-shadow: -12px 0 60px rgba(0,0,0,.6);
  display: flex; flex-direction: column;
  transform: translateX(100%);
  transition: transform .45s cubic-bezier(.16,1,.3,1);
}
#iai-panel.open { transform: translateX(0); }

/* Header */
#iai-header {
  display: flex; align-items: center; gap: 10px;
  padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,.05);
  flex-shrink: 0;
}
#iai-avatar {
  width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #1e40af, #2563eb);
  border: 1.5px solid rgba(77,128,255,.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: #fff;
}
#iai-title  { font-family: 'DM Sans',sans-serif; font-size: .88rem; font-weight: 700; color: #f1f5f9; }
#iai-status { font-size: .68rem; color: #22c55e; display: flex; align-items: center; gap: 4px; margin-top: 1px; font-family: 'JetBrains Mono',monospace; text-transform: uppercase; letter-spacing: .06em; }
#iai-status::before { content:''; width:6px; height:6px; border-radius:50%; background:#22c55e; display:inline-block; }
#iai-status.voice { color: #f87171; }
#iai-status.voice::before { background: #f87171; animation: iai-pulse .8s ease-in-out infinite; }
.iai-hdr-btns { margin-left: auto; display: flex; gap: 6px; }
.iai-hdr-btn {
  width: 30px; height: 30px; border-radius: 8px; border: none; cursor: pointer;
  background: rgba(255,255,255,.04); color: #64748b;
  display: flex; align-items: center; justify-content: center; font-size: 12px;
  transition: background .2s, color .2s;
}
.iai-hdr-btn:hover { background: rgba(255,255,255,.09); color: #e2e8f0; }
.iai-hdr-btn.active { background: rgba(37,99,235,.2); color: #80a5ff; }
.iai-hdr-btn.danger:hover { background: rgba(239,68,68,.15); color: #f87171; }

/* Messages */
#iai-msgs {
  flex: 1; overflow-y: auto; padding: 20px 16px;
  display: flex; flex-direction: column; gap: 14px;
  scrollbar-width: thin; scrollbar-color: #1e3a8a #0f172a;
}
#iai-msgs::-webkit-scrollbar { width: 3px; }
#iai-msgs::-webkit-scrollbar-thumb { background: #1e3a8a; border-radius: 2px; }

.iai-msg { display: flex; gap: 8px; align-items: flex-end; animation: iai-msg-in .3s ease; }
@keyframes iai-msg-in { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
.iai-msg.user { flex-direction: row-reverse; }
.iai-msg-av {
  width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 10px;
}
.iai-msg.ai   .iai-msg-av { background: rgba(37,99,235,.2); color: #80a5ff; }
.iai-msg.user .iai-msg-av { background: #1e40af; color: #fff; }
.iai-bubble {
  padding: 10px 14px; max-width: 78%; word-break: break-word;
  font-family: 'DM Sans',sans-serif; font-size: .83rem; line-height: 1.55;
}
.iai-msg.ai   .iai-bubble { background: rgba(37,99,235,.1); border: 1px solid rgba(77,128,255,.18); border-radius: 16px 16px 16px 4px; color: #e2e8f0; }
.iai-msg.user .iai-bubble { background: #1e3a8a; border-radius: 16px 16px 4px 16px; color: #e2e8f0; }

/* Typing dots */
.iai-dots { display: flex; gap: 4px; align-items: center; height: 14px; }
.iai-dots span { width: 5px; height: 5px; border-radius: 50%; background: #4d80ff; animation: iai-dot-bounce .9s ease-in-out infinite; }
.iai-dots span:nth-child(2) { animation-delay: .15s; }
.iai-dots span:nth-child(3) { animation-delay: .3s; }
@keyframes iai-dot-bounce { 0%,80%,100%{transform:translateY(0);} 40%{transform:translateY(-5px);} }

/* Voice strip */
#iai-voice-strip {
  display: none; align-items: center; justify-content: space-between;
  padding: 10px 16px; background: rgba(239,68,68,.07);
  border-top: 1px solid rgba(239,68,68,.15); flex-shrink: 0;
}
#iai-voice-strip.active { display: flex; }
#iai-orb-wrap { display: flex; align-items: center; gap: 10px; }
#iai-orb {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #1e40af, #2563eb);
  display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px;
}
#iai-orb.active { animation: iai-orb-ring 1s ease-in-out infinite; }
@keyframes iai-orb-ring { 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.5);} 50%{box-shadow:0 0 0 12px rgba(37,99,235,0);} }
#iai-voice-label { font-family:'DM Sans',sans-serif; font-size:.75rem; color:#94a3b8; }
#iai-end-call {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 8px; border: none; cursor: pointer;
  background: rgba(239,68,68,.12); color: #f87171;
  border: 1px solid rgba(239,68,68,.25);
  font-family: 'DM Sans',sans-serif; font-size: .75rem; font-weight: 600;
  transition: background .2s, transform .15s;
}
#iai-end-call:hover { background: rgba(239,68,68,.22); transform: scale(1.03); }

/* Quick chips */
#iai-chips {
  display: flex; flex-wrap: wrap; gap: 6px;
  padding: 10px 16px 4px; border-top: 1px solid rgba(255,255,255,.04); flex-shrink: 0;
}
.iai-chip {
  font-family: 'JetBrains Mono',monospace; font-size: .68rem; letter-spacing: .03em;
  padding: 4px 11px; border-radius: 5px; border: none; cursor: pointer;
  background: rgba(37,99,235,.13); color: #80a5ff;
  border: 1px solid rgba(77,128,255,.22);
  transition: background .2s, transform .15s;
}
.iai-chip:hover { background: rgba(37,99,235,.26); transform: translateY(-1px); }

/* Input row */
#iai-input-row {
  display: flex; gap: 8px; padding: 14px 16px;
  background: rgba(5,10,22,.6); border-top: 1px solid rgba(255,255,255,.05); flex-shrink: 0;
}
#iai-text {
  flex: 1; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
  border-radius: 12px; padding: 10px 14px;
  font-family: 'DM Sans',sans-serif; font-size: .83rem; color: #e2e8f0; outline: none;
  transition: border-color .2s;
}
#iai-text::placeholder { color: #334155; }
#iai-text:focus { border-color: rgba(77,128,255,.45); }
.iai-act {
  width: 38px; height: 38px; border-radius: 10px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0;
  transition: background .2s, transform .15s;
}
#iai-mic-btn { background: rgba(255,255,255,.05); color: #64748b; border: 1px solid rgba(255,255,255,.08); }
#iai-mic-btn:hover { background: rgba(255,255,255,.1); color: #e2e8f0; }
#iai-mic-btn.listening { background: rgba(239,68,68,.12); color: #f87171; border-color: rgba(239,68,68,.3); animation: iai-mic-glow 1.2s ease-in-out infinite; }
@keyframes iai-mic-glow { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0);} 50%{box-shadow:0 0 0 5px rgba(239,68,68,.2);} }
#iai-send-btn { background: #2563eb; color: #fff; }
#iai-send-btn:hover { background: #1d4ed8; transform: scale(1.06); }

/* Footer label */
#iai-foot {
  text-align: center; padding: 8px 16px 14px;
  font-family: 'JetBrains Mono',monospace; font-size: .62rem;
  color: #1e3a8a; letter-spacing: .1em; text-transform: uppercase; flex-shrink: 0;
}

/* ── Booking modal ────────────────────── */
#iai-modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,.75); backdrop-filter: blur(6px);
  display: none; align-items: center; justify-content: center; padding: 16px;
}
#iai-modal-overlay.show { display: flex; }
#iai-modal {
  width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;
  background: #080f1f; border: 1px solid rgba(255,255,255,.08);
  border-radius: 24px; box-shadow: 0 32px 80px rgba(0,0,0,.7);
}
#iai-modal::-webkit-scrollbar { width: 3px; }
#iai-modal::-webkit-scrollbar-thumb { background: #1e3a8a; }
.iai-m-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 28px 28px 20px; border-bottom: 1px solid rgba(255,255,255,.06);
}
.iai-m-head h2 { font-family: 'Syne',sans-serif; font-size: 1.3rem; font-weight: 700; color: #f1f5f9; }
.iai-m-head p  { font-family: 'DM Sans',sans-serif; font-size: .78rem; color: #475569; margin-top: 3px; }
.iai-m-close {
  width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; flex-shrink: 0;
  background: rgba(255,255,255,.05); color: #64748b; font-size: 13px;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, color .2s;
}
.iai-m-close:hover { background: rgba(239,68,68,.12); color: #f87171; }
.iai-m-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 18px; }
.iai-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.iai-field { display: flex; flex-direction: column; gap: 6px; }
.iai-field label {
  font-family: 'JetBrains Mono',monospace; font-size: .65rem;
  text-transform: uppercase; letter-spacing: .1em; color: #334155;
}
.iai-field input,
.iai-field select,
.iai-field textarea {
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px; padding: 12px 14px;
  font-family: 'DM Sans',sans-serif; font-size: .83rem; color: #e2e8f0; outline: none;
  transition: border-color .2s;
}
.iai-field input:focus,
.iai-field select:focus,
.iai-field textarea:focus { border-color: rgba(77,128,255,.45); }
.iai-field input.err,
.iai-field select.err { border-color: rgba(239,68,68,.5); }
.iai-field select option { background: #080f1f; }
.iai-field textarea { resize: none; height: 80px; }
.iai-m-actions { display: flex; gap: 10px; padding: 0 28px 28px; }
.iai-m-btn {
  flex: 1; padding: 14px; border-radius: 12px; border: none; cursor: pointer;
  font-family: 'DM Sans',sans-serif; font-size: .85rem; font-weight: 600;
  transition: background .2s, transform .15s;
}
.iai-m-btn.primary { background: #2563eb; color: #fff; }
.iai-m-btn.primary:hover { background: #1d4ed8; transform: translateY(-1px); }
.iai-m-btn.secondary { background: rgba(255,255,255,.05); color: #64748b; border: 1px solid rgba(255,255,255,.08); }
.iai-m-btn.secondary:hover { color: #94a3b8; }
.iai-m-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.iai-err-msg {
  font-family: 'DM Sans',sans-serif; font-size: .73rem; color: #f87171;
  padding: 0 28px 4px; display: none;
}
.iai-err-msg.show { display: block; }

/* Mobile */
@media (max-width: 480px) {
  #iai-panel { width: 100vw; }
  #iai-fab { bottom: 18px; right: 18px; }
  #iai-teaser { right: 18px; bottom: 90px; }
  .iai-row-2 { grid-template-columns: 1fr; }
  .iai-m-body { padding: 18px 18px; }
  .iai-m-head { padding: 20px 18px 16px; }
  .iai-m-actions { padding: 0 18px 20px; }
}
`;

  /* ─────────────────────────────────────────────────────────────
     HTML TEMPLATE
  ───────────────────────────────────────────────────────────── */
  const HTML = `
<div id="iai-root">

  <!-- Teaser nudge -->
  <div id="iai-teaser"><strong>Isaiah AI</strong> is online — ask me anything 👋</div>

  <!-- FAB -->
  <button id="iai-fab" aria-label="Open Isaiah AI Chat">
    <span class="iai-ico-open"><i class="fas fa-robot" style="font-size:21px;"></i></span>
    <span class="iai-ico-close"><i class="fas fa-times" style="font-size:19px;"></i></span>
    <span id="iai-fab-dot"></span>
  </button>

  <!-- Full-height chat panel -->
  <div id="iai-panel" role="dialog" aria-label="Isaiah AI Chat">

    <!-- Header -->
    <div id="iai-header">
      <div id="iai-avatar"><i class="fas fa-robot"></i></div>
      <div>
        <div id="iai-title">Isaiah AI</div>
        <div id="iai-status">Online</div>
      </div>
      <div class="iai-hdr-btns">
        <button class="iai-hdr-btn" id="iai-book-btn" title="Book an appointment">
          <i class="fas fa-calendar-plus"></i>
        </button>
        <button class="iai-hdr-btn" id="iai-voice-toggle-btn" title="Voice mode">
          <i class="fas fa-microphone"></i>
        </button>
        <button class="iai-hdr-btn danger" id="iai-close-btn" title="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div id="iai-msgs"></div>

    <!-- Voice strip (shown only in voice mode) -->
    <div id="iai-voice-strip">
      <div id="iai-orb-wrap">
        <div id="iai-orb"><i class="fas fa-microphone"></i></div>
        <span id="iai-voice-label">Tap mic to speak…</span>
      </div>
      <button id="iai-end-call">
        <i class="fas fa-phone-slash"></i> End Call
      </button>
    </div>

    <!-- Chips -->
    <div id="iai-chips">
      <button class="iai-chip" data-q="Who is Isaiah?">About Isaiah</button>
      <button class="iai-chip" data-q="What are his skills?">Skills</button>
      <button class="iai-chip" data-q="Tell me about his projects">Projects</button>
      <button class="iai-chip" data-q="Tell me his story">His Story</button>
      <button class="iai-chip" data-q="How can I contact Isaiah?">Contact</button>
    </div>

    <!-- Input -->
    <div id="iai-input-row">
      <input id="iai-text" type="text" placeholder="Message Isaiah AI…" autocomplete="off" />
      <button class="iai-act" id="iai-mic-btn" title="Start voice mode">
        <i class="fas fa-microphone"></i>
      </button>
      <button class="iai-act" id="iai-send-btn" title="Send">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
    <div id="iai-foot">Powered by Isaiah AI · Claude</div>

  </div><!-- /iai-panel -->

  <!-- ── Booking Modal ──────────────────────────────── -->
  <div id="iai-modal-overlay">
    <div id="iai-modal">

      <div class="iai-m-head">
        <div>
          <h2><i class="fas fa-calendar-check" style="color:#4d80ff;margin-right:8px;font-size:1rem;"></i>Schedule an Appointment</h2>
          <p>Professional consultation with Isaiah N. Sumo</p>
        </div>
        <button class="iai-m-close" id="iai-modal-close"><i class="fas fa-times"></i></button>
      </div>

      <div class="iai-m-body">

        <div class="iai-row-2">
          <div class="iai-field">
            <label>Full Name <span style="color:#f87171;">*</span></label>
            <input type="text" id="iai-f-name" placeholder="e.g. James Kollie" />
          </div>
          <div class="iai-field">
            <label>Email Address <span style="color:#f87171;">*</span></label>
            <input type="email" id="iai-f-email" placeholder="you@example.com" />
          </div>
        </div>

        <div class="iai-row-2">
          <div class="iai-field">
            <label>Preferred Date <span style="color:#f87171;">*</span></label>
            <input type="date" id="iai-f-date" />
          </div>
          <div class="iai-field">
            <label>Preferred Time <span style="color:#f87171;">*</span></label>
            <select id="iai-f-time">
              <option value="">Select a time…</option>
              <option>09:00 AM</option><option>10:00 AM</option>
              <option>11:00 AM</option><option>12:00 PM</option>
              <option>01:00 PM</option><option>02:00 PM</option>
              <option>03:00 PM</option><option>04:00 PM</option>
              <option>05:00 PM</option>
            </select>
          </div>
        </div>

        <div class="iai-field">
          <label>Meeting Type</label>
          <select id="iai-f-type">
            <option>Virtual Meeting (Video Call)</option>
            <option>Phone Call</option>
            <option>In-Person Consultation (Monrovia)</option>
          </select>
        </div>

        <div class="iai-field">
          <label>Purpose of Meeting <span style="color:#f87171;">*</span></label>
          <select id="iai-f-purpose">
            <option value="">Select a purpose…</option>
            <option>Web Development Project</option>
            <option>IT Support / Consulting</option>
            <option>Cybersecurity Workshop / Training</option>
            <option>Collaboration / Partnership</option>
            <option>Career / Mentorship Discussion</option>
            <option>Research Collaboration</option>
            <option>General Discussion</option>
          </select>
        </div>

        <div class="iai-field">
          <label>Additional Notes (optional)</label>
          <textarea id="iai-f-notes" placeholder="Any context or details you'd like Isaiah to know beforehand…"></textarea>
        </div>

      </div>

      <p id="iai-m-err" class="iai-err-msg"></p>

      <div class="iai-m-actions">
        <button class="iai-m-btn secondary" id="iai-modal-cancel">Cancel</button>
        <button class="iai-m-btn primary" id="iai-modal-confirm">
          <i class="fas fa-check" style="margin-right:6px;"></i>Confirm Appointment
        </button>
      </div>

    </div>
  </div><!-- /iai-modal-overlay -->

</div><!-- /iai-root -->
`;

  /* ─────────────────────────────────────────────────────────────
     INJECT
  ───────────────────────────────────────────────────────────── */
  function inject() {
    const style = document.createElement('style');
    style.id = 'iai-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = HTML;
    document.body.appendChild(wrapper);
  }

  /* ─────────────────────────────────────────────────────────────
     CONVERSATION HISTORY (multi-turn memory for Claude)
  ───────────────────────────────────────────────────────────── */
  const history = []; // {role, content}
  const MAX_HISTORY = 16;

  /* ─────────────────────────────────────────────────────────────
     MAIN CLASS
  ───────────────────────────────────────────────────────────── */
  class IsaiahAI {
    constructor() {
      // DOM refs
      this.$ = id => document.getElementById(id);
      this.$fab          = this.$('iai-fab');
      this.$panel        = this.$('iai-panel');
      this.$teaser       = this.$('iai-teaser');
      this.$msgs         = this.$('iai-msgs');
      this.$text         = this.$('iai-text');
      this.$status       = this.$('iai-status');
      this.$voiceStrip   = this.$('iai-voice-strip');
      this.$orb          = this.$('iai-orb');
      this.$voiceLabel   = this.$('iai-voice-label');
      this.$micBtn       = this.$('iai-mic-btn');
      this.$voiceToggle  = this.$('iai-voice-toggle-btn');
      this.$modalOverlay = this.$('iai-modal-overlay');
      this.$mErr         = this.$('iai-m-err');

      // State
      this.isOpen      = false;
      this.isProcessing = false;
      this.isVoice     = false;
      this.isListening = false;
      this.isSpeaking  = false;
      this.synth       = window.speechSynthesis;
      this.recognition = null;

      this._initSpeech();
      this._bindEvents();
      this._welcome();
      this._scheduleTeaser();
    }

    /* ── Open / close panel ────────────────────────── */
    open() {
      this.isOpen = true;
      this.$panel.classList.add('open');
      this.$fab.classList.add('open');
      this.$teaser.classList.remove('show');
      setTimeout(() => this.$text.focus(), 400);
    }
    close() {
      this.isOpen = false;
      this.$panel.classList.remove('open');
      this.$fab.classList.remove('open');
      if (this.isVoice) this._stopVoice();
    }
    toggle() { this.isOpen ? this.close() : this.open(); }

    /* ── Welcome message ───────────────────────────── */
    _welcome() {
      this._addMsg(
        "Hi there! 👋 I'm Isaiah AI — your guide to everything about Isaiah N. Sumo. " +
        "Ask me about his skills, story, projects, or tap the calendar icon to book a meeting.",
        'ai'
      );
    }

    /* ── Teaser scheduling ─────────────────────────── */
    _scheduleTeaser() {
      const show = () => {
        if (!this.isOpen) {
          this.$teaser.classList.add('show');
          setTimeout(() => this.$teaser.classList.remove('show'), 5500);
        }
      };
      setTimeout(() => { show(); setInterval(show, 22000); }, 3500);
    }

    /* ── Event binding ─────────────────────────────── */
    _bindEvents() {
      this.$fab.addEventListener('click', () => this.toggle());
      this.$('iai-close-btn').addEventListener('click', () => this.close());
      this.$teaser.addEventListener('click', () => this.open());

      // Chips
      document.querySelectorAll('.iai-chip').forEach(c =>
        c.addEventListener('click', () => this._sendText(c.dataset.q))
      );

      // Send
      this.$('iai-send-btn').addEventListener('click', () => this._sendText());
      this.$text.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._sendText(); }
      });

      // Mic (input row) — starts voice mode
      this.$micBtn.addEventListener('click', () => this._toggleVoice());

      // Voice toggle in header
      this.$voiceToggle.addEventListener('click', () => this._toggleVoice());

      // End call
      this.$('iai-end-call').addEventListener('click', () => this._stopVoice());

      // Booking
      this.$('iai-book-btn').addEventListener('click', () => this._openModal());
      this.$('iai-modal-close').addEventListener('click', () => this._closeModal());
      this.$('iai-modal-cancel').addEventListener('click', () => this._closeModal());
      this.$('iai-modal-confirm').addEventListener('click', () => this._confirmBooking());
      // Close overlay on backdrop click
      this.$modalOverlay.addEventListener('click', e => {
        if (e.target === this.$modalOverlay) this._closeModal();
      });

      // Set min date to today on modal open
      const today = new Date().toISOString().split('T')[0];
      this.$('iai-f-date').min = today;
    }

    /* ── Claude API ────────────────────────────────── */
    async _callClaude(msgs) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 350,
          system: SYSTEM,
          messages: msgs
        })
      });
      if (!res.ok) throw new Error('API ' + res.status);
      const data = await res.json();
      return data.content.filter(b => b.type === 'text').map(b => b.text).join(' ').trim()
        || "I'm not sure about that — try asking about Isaiah's skills, projects, or story!";
    }

    /* ── Send a text message ───────────────────────── */
    async _sendText(override) {
      const raw = (override || this.$text.value).trim();
      if (!raw || this.isProcessing) return;
      if (!override) this.$text.value = '';

      // Booking intent shortcuts
      if (/book|schedule|appointment|meeting|calendar/i.test(raw)) {
        this._addMsg(raw, 'user');
        this._addMsg("Sure! I've opened the appointment form. Fill in your details and Isaiah will get back to you within 24–48 hours.", 'ai');
        this._openModal();
        return;
      }

      this._addMsg(raw, 'user');
      history.push({ role: 'user', content: raw });
      if (history.length > MAX_HISTORY) history.splice(0, 2);

      this._showTyping();
      this.isProcessing = true;
      try {
        const reply = await this._callClaude([...history]);
        this._hideTyping();
        this._addMsg(reply, 'ai');
        history.push({ role: 'assistant', content: reply });
        if (history.length > MAX_HISTORY) history.splice(0, 2);
      } catch (_) {
        this._hideTyping();
        this._addMsg("Connection hiccup — please try again in a moment!", 'ai');
      }
      this.isProcessing = false;
    }

    /* ── Voice mode ────────────────────────────────── */
    _initSpeech() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return;
      this.recognition = new SR();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.$micBtn.classList.add('listening');
        this.$orb.classList.add('active');
        this.$voiceLabel.textContent = '🎙️ Listening… speak now.';
        this._setStatus('LIVE', true);
      };

      this.recognition.onresult = e => {
        const t = Array.from(e.results).filter(r => r.isFinal).map(r => r[0].transcript).join(' ').trim();
        if (t.length > 1) this._handleVoiceInput(t);
      };

      this.recognition.onspeechend = () => this.recognition.stop();

      this.recognition.onend = () => {
        this.isListening = false;
        this.$micBtn.classList.remove('listening');
        this.$orb.classList.remove('active');
        // Auto-restart if voice mode still on and not speaking/processing
        if (this.isVoice && !this.isProcessing && !this.isSpeaking) {
          this.$voiceLabel.textContent = '🎙️ Listening…';
          setTimeout(() => { if (this.isVoice) this.recognition.start(); }, 600);
        }
      };

      this.recognition.onerror = e => {
        if (e.error !== 'no-speech') {
          this.$voiceLabel.textContent = 'Mic error — try again.';
        }
        this.$micBtn.classList.remove('listening');
      };
    }

    _toggleVoice() {
      this.isVoice ? this._stopVoice() : this._startVoice();
    }

    _startVoice() {
      if (!this.recognition) {
        this._addMsg('Voice mode requires microphone permission and a compatible browser (Chrome or Edge recommended).', 'ai');
        return;
      }
      if (!this.isOpen) this.open();
      this.isVoice = true;
      this.$voiceStrip.classList.add('active');
      this.$voiceToggle.classList.add('active');
      this.$voiceLabel.textContent = '🎙️ Listening…';
      this._setStatus('LIVE', true);
      this._addMsg("Voice mode activated! I'll listen and respond out loud. Start speaking about Isaiah.", 'ai');
      try { this.recognition.start(); } catch (_) {}
    }

    _stopVoice() {
      this.isVoice = false;
      this.isListening = false;
      this.isSpeaking = false;
      this.synth.cancel();
      try { this.recognition?.stop(); } catch (_) {}
      this.$voiceStrip.classList.remove('active');
      this.$voiceToggle.classList.remove('active');
      this.$micBtn.classList.remove('listening');
      this.$orb.classList.remove('active');
      this._setStatus('Online', false);
      this._addMsg('Voice call ended. You can keep chatting by text below.', 'ai');
    }

    async _handleVoiceInput(transcript) {
      if (this.isProcessing) return;
      this.$voiceLabel.textContent = `"${transcript.slice(0, 40)}…"`;
      this._addMsg(transcript, 'user');
      history.push({ role: 'user', content: transcript });
      if (history.length > MAX_HISTORY) history.splice(0, 2);

      this.isProcessing = true;
      this.$orb.classList.remove('active');
      this.$voiceLabel.textContent = '⏳ Thinking…';

      try {
        const reply = await this._callClaude([...history]);
        history.push({ role: 'assistant', content: reply });
        if (history.length > MAX_HISTORY) history.splice(0, 2);
        this._addMsg(reply, 'ai');
        this._speak(reply);
      } catch (_) {
        this._addMsg('Connection issue — please try again.', 'ai');
        this.isProcessing = false;
      }
    }

    _speak(text) {
      if (!this.isVoice) return;
      this.synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.93; u.pitch = 1.04; u.volume = 0.92;
      this.isSpeaking = true;
      this.$orb.classList.add('active');
      this.$voiceLabel.textContent = '🔊 Speaking…';
      u.onend = () => {
        this.isSpeaking = false;
        this.isProcessing = false;
        this.$orb.classList.remove('active');
        if (this.isVoice) {
          this.$voiceLabel.textContent = '🎙️ Listening…';
          try { this.recognition.start(); } catch (_) {}
        }
      };
      this.synth.speak(u);
    }

    _setStatus(text, isVoice) {
      this.$status.textContent = text;
      this.$status.className = isVoice ? 'voice' : '';
      this.$status.id = 'iai-status';
    }

    /* ── Message rendering ─────────────────────────── */
    _addMsg(text, sender) {
      const row = document.createElement('div');
      row.className = `iai-msg ${sender}`;
      const av = document.createElement('div');
      av.className = 'iai-msg-av';
      av.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
      const bub = document.createElement('div');
      bub.className = 'iai-bubble';
      bub.textContent = text;
      row.appendChild(av);
      row.appendChild(bub);
      this.$msgs.appendChild(row);
      this.$msgs.scrollTop = this.$msgs.scrollHeight;
    }

    _showTyping() {
      const row = document.createElement('div');
      row.className = 'iai-msg ai'; row.id = 'iai-typing';
      row.innerHTML = `<div class="iai-msg-av"><i class="fas fa-robot"></i></div><div class="iai-bubble"><div class="iai-dots"><span></span><span></span><span></span></div></div>`;
      this.$msgs.appendChild(row);
      this.$msgs.scrollTop = this.$msgs.scrollHeight;
    }
    _hideTyping() { this.$('iai-typing')?.remove(); }

    /* ── Booking modal ─────────────────────────────── */
    _openModal() {
      const today = new Date().toISOString().split('T')[0];
      this.$('iai-f-date').min = today;
      this.$modalOverlay.classList.add('show');
    }
    _closeModal() {
      this.$modalOverlay.classList.remove('show');
      this._clearModalErrors();
    }

    _clearModalErrors() {
      ['iai-f-name','iai-f-email','iai-f-date','iai-f-time','iai-f-purpose'].forEach(id => {
        this.$(id)?.classList.remove('err');
      });
      this.$mErr.classList.remove('show');
    }

    _showModalError(msg) {
      this.$mErr.textContent = msg;
      this.$mErr.classList.add('show');
    }

    _confirmBooking() {
      this._clearModalErrors();
      const name    = this.$('iai-f-name').value.trim();
      const email   = this.$('iai-f-email').value.trim();
      const date    = this.$('iai-f-date').value;
      const time    = this.$('iai-f-time').value;
      const type    = this.$('iai-f-type').value;
      const purpose = this.$('iai-f-purpose').value;
      const notes   = this.$('iai-f-notes').value.trim();

      let valid = true;
      if (!name)    { this.$('iai-f-name').classList.add('err');    valid = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.$('iai-f-email').classList.add('err'); valid = false;
      }
      if (!date)    { this.$('iai-f-date').classList.add('err');    valid = false; }
      if (!time)    { this.$('iai-f-time').classList.add('err');    valid = false; }
      if (!purpose) { this.$('iai-f-purpose').classList.add('err'); valid = false; }
      if (!valid) { this._showModalError('Please fill in all required fields marked with *.'); return; }

      const btn = this.$('iai-modal-confirm');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i>Processing…';

      setTimeout(() => {
        const summary =
          `ISAIAH N. SUMO — APPOINTMENT\n` +
          `Name: ${name} | Email: ${email}\n` +
          `Date: ${date} | Time: ${time}\n` +
          `Type: ${type} | Purpose: ${purpose}` +
          (notes ? `\nNotes: ${notes}` : '');

        navigator.clipboard.writeText(summary).catch(() => {});

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check" style="margin-right:6px;"></i>Confirm Appointment';

        this._closeModal();
        ['iai-f-name','iai-f-email','iai-f-date','iai-f-time','iai-f-purpose','iai-f-notes']
          .forEach(id => { const el = this.$(id); if(el) el.value = ''; });

        if (!this.isOpen) this.open();
        this._addMsg(
          `Your appointment request is confirmed! 🎉 Isaiah will reach out to ${email} within 24–48 hours ` +
          `to finalize your ${type.toLowerCase()}. Looking forward to connecting, ${name.split(' ')[0]}!`,
          'ai'
        );
      }, 1600);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────────────────────── */
  function boot() {
    inject();
    window.isaiahAI = new IsaiahAI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();