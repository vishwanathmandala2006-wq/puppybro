/**
 * Splash screen: Professional dog welfare theme with animated dog icon and Puppy Bro text
 */

(function() {
    const mainText = 'Puppy Bro';
    const duration = 2200;  // 2.2 seconds for main text
    const mainEl = document.getElementById('splashText');
    const dogIcon = document.getElementById('dogIcon');
    
    if (!mainEl) return;

    // Animate dog icon first
    if (dogIcon) {
        dogIcon.style.animation = 'bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both';
    }

    // Animate main text with slight delay
    let i = 0;
    const step = duration / mainText.length;
    const mainInterval = setInterval(() => {
        mainEl.textContent = mainText.slice(0, ++i);
        if (i >= mainText.length) {
            clearInterval(mainInterval);
            // Fade out splash after text animation completes
            setTimeout(() => {
                const splash = document.getElementById('splashScreen');
                if (splash) {
                    splash.classList.add('fade-out');
                    setTimeout(() => splash.remove(), 600);
                }
            }, 1000);
        }
    }, step);
})();
