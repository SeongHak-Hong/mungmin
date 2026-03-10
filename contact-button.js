/**
 * Mungmin Shared Contact Button Component
 * Injects a floating contact button with character and text balloon.
 */
(function () {
    // Prevent double injection
    if (document.getElementById('floating-contact-btn')) return;

    const contactHtml = `
    <div class="floating-contact-btn" id="floating-contact-btn">
        <img src="assets/images/common/mungnyang-franchise-inquiry-contact-balloon-button.svg" 
             alt="멍냥의민족 창업문의 캐릭터" 
             class="contact-btn-character" />
        <a href="tel:070-4141-6402" class="contact-btn-text-balloon">
            <span class="contact-btn-label">창업문의</span>
            <span class="contact-btn-number">070-4141<br>-6402</span>
        </a>
    </div>
    `;

    function initContactButton() {
        // Only inject if not on intro page
        if (window.location.pathname.includes('intro.html')) return;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = contactHtml.trim();
        document.body.appendChild(wrapper.firstChild);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactButton);
    } else {
        initContactButton();
    }
})();
