'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        header.classList.add('is-hidden');
      } else if (currentScrollY < lastScrollY) {
        header.classList.remove('is-hidden');
      }
      lastScrollY = currentScrollY;
    }

    // Check if Lenis is available
    if (window.lenis) {
      window.lenis.on('scroll', (e) => {
        handleScroll();
      });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navItems = [
    { href: '/main#hero', label: '브랜드 소개', id: 'nav-brand' },
    { href: '/main#trend-market-header', label: '창업안내', id: 'nav-franchise' },
    { href: '/store', label: '매장안내', id: 'nav-store' },
    { href: '/news', label: '소식', id: 'nav-news' },
    { href: '/contact', label: '문의하기', id: 'nav-contact' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleNavClick = (e, item) => {
    if (isMenuOpen) toggleMenu();

    const { href } = item;
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (pathname === path) {
        if (window.lenis) {
          e.preventDefault();
          window.history.pushState(null, null, `#${hash}`);
          setActiveHash(`#${hash}`);
          if (hash === 'hero') {
            window.lenis.scrollTo(0);
          } else {
            window.lenis.scrollTo(`#${hash}`);
          }
        }
      }
    }
  };

  return (
    <>
      <header className="site-header" id="header" ref={headerRef}>
        <div className="header-inner">
          {/* Logo */}
          <Link href="/main" className="header-logo">
            <img src="/assets/images/common/mungnyang-official-brand-logo.svg" alt="멍냥의민족 공식 로고" />
          </Link>

          {/* Navigation (Desktop) */}
          <nav className="desktop-nav">
            <ul className="header-nav">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    id={item.id}
                    className={
                      pathname === item.href || 
                      (pathname === item.href.split('#')[0] && (activeHash === '#' + item.href.split('#')[1] || (activeHash === '' && item.href === '/main#hero')))
                        ? 'is-active' 
                        : ''
                    }
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA (Desktop) */}
          <div className="header-cta desktop-only">
            <Link 
              href="https://pet-pal.co.kr/" 
              className="btn btn-m btn-round btn-primary btn-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/images/common/local_convenience_store_24dp_FFFFFF_FILL0_wght300_GRAD-25_opsz24.svg" width={24} height={24} alt="온라인몰" />
              온라인몰
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`mobile-menu-toggle ${isMenuOpen ? 'is-active' : ''}`} 
            onClick={toggleMenu}
            aria-label="메뉴 열기"
          >
            <img src="/assets/images/common/icon/menu_24dp_FFFFFF_FILL0_wght300_GRAD-25_opsz24.svg" width={24} height={24} alt="메뉴" />
          </button>
        </div>
      </header>

      <div className={`mobile-menu-overlay ${isMenuOpen ? 'is-active' : ''}`}>
        <div className="mobile-menu-header">
          <Link href="/main" className="header-logo" onClick={toggleMenu}>
            <img src="/assets/images/common/mungnyang-official-brand-logo.svg" alt="멍냥의민족 공식 로고" />
          </Link>
          <button 
            className="mobile-menu-close" 
            onClick={toggleMenu}
            aria-label="메뉴 닫기"
          >
            <img src="/assets/images/common/icon/close_24dp_FFFFFF_FILL0_wght300_GRAD-25_opsz24.svg" width={24} height={24} alt="닫기" />
          </button>
        </div>
        <nav className="mobile-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <Link 
                  href={item.href} 
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link 
                href="https://pet-pal.co.kr/" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={toggleMenu}
              >
                온라인몰
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
