// Add these methods to the BequizzyAI class (after existing methods)

class BequizzyAI {
    // ... existing methods ...

    // 🔥 MINI AI TEASER - Auto popup every 10s for 40s
    initMiniTeaser() {
        this.miniTeaser = document.getElementById('mini-ai-teaser');
        if (!this.miniTeaser) return;

        // Start teaser cycle
        this.startTeaserCycle();
        
        // Click handler - opens full AI
        this.miniTeaser.addEventListener('click', () => {
            document.getElementById('ai-toggle-btn').click();
            this.miniTeaser.classList.add('hidden');
        });
    }

    startTeaserCycle() {
        let showTimeout, hideTimeout;
        
        const showTeaser = () => {
            clearTimeout(hideTimeout);
            this.miniTeaser.classList.remove('hidden');
            this.miniTeaser.style.animation = 'miniAiSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Hide after 40 seconds
            hideTimeout = setTimeout(() => {
                this.miniTeaser.classList.add('hidden');
                this.miniTeaser.style.animation = '';
            }, 40000); // 40 seconds
        };

        const cycle = () => {
            clearTimeout(showTimeout);
            // Wait 10 seconds, then show
            showTimeout = setTimeout(() => {
                if (!document.getElementById('ai-chat-panel').classList.contains('hidden')) {
                    // If full chat is open, restart cycle
                    cycle();
                    return;
                }
                showTeaser();
            }, 10000); // 10 seconds
        };

        // Initial cycle start after 3 seconds
        setTimeout(cycle, 3000);
    }
}
