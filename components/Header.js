'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
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

  const navItems = [
    { href: '/main', label: '브랜드 소개', id: 'nav-brand' },
    { href: '#', label: '창업안내', id: 'nav-franchise' },
    { href: '#', label: '매장안내', id: 'nav-store' },
    { href: '#', label: '소식', id: 'nav-news' },
    { href: '#', label: '문의하기', id: 'nav-contact' },
  ];

  return (
    <header className="site-header" id="header" ref={headerRef}>
      <div className="header-inner">
        {/* Logo */}
        <Link href="/main" className="header-logo">
          <img src="/assets/images/common/mungnyang-official-brand-logo.svg" alt="멍냥의민족 공식 로고" />
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="header-nav">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  id={item.id}
                  className={pathname === item.href ? 'is-active' : ''}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <div className="header-cta">
          <Link href="#" className="btn btn-m btn-round btn-primary btn-icon">
            <img src="/assets/images/common/local_convenience_store_24dp_FFFFFF_FILL0_wght300_GRAD-25_opsz24.svg" width={24} height={24} alt="온라인몰" />
            온라인몰
          </Link>
        </div>
      </div>
    </header>
  );
}
