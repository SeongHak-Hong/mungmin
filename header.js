/**
 * Mungmin Shared Header Component
 * This script injects the header HTML and initializes scroll behavior.
 * Works even in local file:// environments.
 */
(function () {
    const headerHtml = `
    <header class="site-header" id="header">
        <div class="header-inner">
            <!-- Logo -->
            <a href="main.html" class="header-logo">
                <img src="assets/images/common/mungnyang-official-brand-logo.svg" alt="멍냥의민족 공식 로고" />
            </a>

            <!-- Navigation (Desktop) -->
            <nav class="desktop-nav">
                <ul class="header-nav">
                    <li><a href="main.html" id="nav-brand">브랜드 소개</a></li>
                    <li><a href="#" id="nav-franchise">창업안내</a></li>
                    <li><a href="#" id="nav-store">매장안내</a></li>
                    <li><a href="#" id="nav-news">소식</a></li>
                    <li><a href="#" id="nav-contact">문의하기</a></li>
                </ul>
            </nav>

            <!-- CTA (Desktop) -->
            <div class="header-cta desktop-only">
                <a href="#" class="btn btn-m btn-round btn-primary btn-icon">
                    <img src="assets/images/common/local_convenience_store_24dp_FFFFFF_FILL0_wght300_GRAD-25_opsz24.svg" width="24" height="24" alt="온라인몰" />
                    온라인몰
                </a>
            </div>

            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="메뉴 열기">
                <img src="assets/images/common/icon/menu_24dp_FFFFFF_FILL0_wght300_GRAD-25_opsz24.svg" width="24" height="24" alt="메뉴" />
            </button>
        </div>

        <!-- Mobile Menu Overlay -->
        <div class="mobile-menu-overlay" id="mobile-menu-overlay">
            <div class="mobile-menu-inner">
                <ul class="mobile-nav">
                    <li><a href="main.html">브랜드 소개</a></li>
                    <li><a href="#">창업안내</a></li>
                    <li><a href="#">매장안내</a></li>
                    <li><a href="#">소식</a></li>
                    <li><a href="#">문의하기</a></li>
                </ul>
                <div class="mobile-cta">
                    <a href="#" class="btn btn-m btn-round btn-primary btn-icon">
                        <img src="assets/images/common/local_convenience_store_24dp_FFFFFF_FILL0_wght300_GRAD-25_opsz24.svg" width="24" height="24" alt="온라인몰" />
                        온라인몰
                    </a>
                </div>
            </div>
        </div>
    </header>
    `;

    function initHeader() {
        const container = document.getElementById('header-container');
        if (!container) return;

        // Replace the container with the header directly so sticky works correctly relative to body
        container.outerHTML = headerHtml;

        // Find the newly injected header
        const header = document.getElementById('header');
        if (!header) return;

        // Set active state based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'main.html';
        const navLinks = header.querySelectorAll('.header-nav a, .mobile-nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });

        // Mobile Menu Toggle Logic
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const overlay = document.getElementById('mobile-menu-overlay');

        if (toggleBtn && overlay) {
            toggleBtn.addEventListener('click', () => {
                const isActive = toggleBtn.classList.toggle('is-active');
                overlay.classList.toggle('is-active');
                document.body.style.overflow = isActive ? 'hidden' : '';
            });

            // Close menu when clicking links
            const mobileLinks = overlay.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    toggleBtn.classList.remove('is-active');
                    overlay.classList.remove('is-active');
                    document.body.style.overflow = '';
                });
            });
        }

        // Header Scroll Hide Logic
        let lastScrollY = window.scrollY;

        function handleScroll(scrollY) {
            const currentScrollY = scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                header.classList.add('is-hidden');
            } else if (currentScrollY < lastScrollY) {
                header.classList.remove('is-hidden');
            }
            lastScrollY = currentScrollY;
        }

        // Priority to Lenis if available
        if (window.lenis) {
            window.lenis.on('scroll', (e) => {
                handleScroll(e.scroll);
            });
        } else {
            // Fallback for pages without Lenis
            window.addEventListener('scroll', function () {
                handleScroll(window.scrollY);
            }, { passive: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeader);
    } else {
        initHeader();
    }
})();
