'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import ContactButton from '@/components/ContactButton';
import SmoothScroll from '@/components/SmoothScroll';
import { InfiniteSlider } from '@/components/InfiniteSlider';
import { COST_DATA, COST_TOTAL, STARTUP_STEPS, VIDEO_LINKS, SUCCESS_STORIES, HERO_BODY_TEXT } from '@/lib/content';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '@/lib/policies';
import '@/styles/main.css';
import '@/styles/success-slider.css';

export default function MainPage() {
  const heroBodyXlRef = useRef(null);
  const graphRef = useRef(null);
  const successSliderRef = useRef(null);
  const headerRef = useRef(null);

  // --- Form & Popup State ---
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    detailLocation: '',
    content: '',
    privacy: false
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPrivacyPopupOpen, setIsPrivacyPopupOpen] = useState(false);
  const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false);
  const [isFooterPrivacyPopupOpen, setIsFooterPrivacyPopupOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partners');
        if (res.ok) {
          const data = await res.json();
          setPartners(data);
        }
      } catch (err) {
        console.error('Failed to fetch partners:', err);
      }
    };
    fetchPartners();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Scroll Lock when popup is open ---
  useEffect(() => {
    const isAnyPopupOpen = isPrivacyPopupOpen || isTermsPopupOpen || isFooterPrivacyPopupOpen || isPopupOpen || selectedVideo;
    
    const lenis = window.lenis;
    if (isAnyPopupOpen) {
      document.documentElement.classList.add('no-scroll');
      document.body.classList.add('no-scroll');
      if (lenis) {
        lenis.stop();
      }
    } else {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      if (lenis) {
        lenis.start();
      }
    }

    return () => {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      if (lenis) {
        lenis.start();
      }
    };
  }, [isPrivacyPopupOpen, isTermsPopupOpen, isFooterPrivacyPopupOpen, isPopupOpen, selectedVideo]);

  /* Removed local definitions for better maintainability */

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, email, location, detailLocation, content, privacy } = formData;

    // Validation: All fields must be filled and privacy must be checked
    if (!name || !phone || !email || !location || !detailLocation || !content || !privacy) {
      setIsPopupOpen(true);
      return;
    }

    // Process form submission
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('문의가 성공적으로 전송되었습니다. 담당자가 확인 후 연락드리겠습니다.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          location: '',
          detailLocation: '',
          content: '',
          privacy: false
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // References for cleanup
    let heroScrollHandler = null;
    let heroResizeHandler = null;
    let graphObserver = null;

    // ════════════════════════════════════════════════
    // HERO SECTION — Interactive Scroll Logic
    // ════════════════════════════════════════════════
    const heroSpacer = document.querySelector('.hero-pin-spacer');
    const hero = document.getElementById('hero');
    const bgDay = document.querySelector('.hero-bg-day');
    const bgNight = document.querySelector('.hero-bg-night');
    const titleContent = document.getElementById('hero-title-content');
    const bodyXlEl = heroBodyXlRef.current;
    const character = document.getElementById('hero-character');

    if (heroSpacer && hero && bgDay && bgNight && titleContent && bodyXlEl && character) {
      // Clear any previously generated content (cleanup for Strict Mode)
      bodyXlEl.innerHTML = '';

      // Split text into per-char spans
      const bodyText = HERO_BODY_TEXT;
      const words = bodyText.split(' ');
      const allChars = [];

      words.forEach(function (word) {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';

        word.split('').forEach(function (char) {
          const charSpan = document.createElement('span');
          charSpan.className = 'char';

          const bgSpan = document.createElement('span');
          bgSpan.className = 'char-bg';
          bgSpan.textContent = char;

          const fgSpan = document.createElement('span');
          fgSpan.className = 'char-fg';
          fgSpan.textContent = char;

          charSpan.appendChild(bgSpan);
          charSpan.appendChild(fgSpan);
          wordSpan.appendChild(charSpan);

          allChars.push(fgSpan);
        });

        bodyXlEl.appendChild(wordSpan);
      });

      const totalChars = allChars.length;

      // ── Optimization Variables ──
      let ticking = false;
      let currentScrollY = window.scrollY;

      let viewW = window.innerWidth;
      let viewH = window.innerHeight;
      let spacerRectTop = heroSpacer.getBoundingClientRect().top + currentScrollY;
      let spacerHeight = heroSpacer.offsetHeight;

      character.style.left = '0'; // Use transform instead

      function updateDimensions() {
        viewW = window.innerWidth;
        viewH = window.innerHeight;
        spacerRectTop = heroSpacer.getBoundingClientRect().top + window.scrollY;
        spacerHeight = heroSpacer.offsetHeight;
      }

      const heroScrollUpdate = function () {
        const scrolled = currentScrollY - spacerRectTop;
        const maxScroll = spacerHeight - viewH;
        const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

        // 1. Title fade out
        if (progress <= 0.12) {
          const titleOpacity = 1 - (progress / 0.12);
          titleContent.style.opacity = titleOpacity;
          titleContent.style.display = '';
        } else {
          titleContent.style.opacity = 0;
          titleContent.style.display = 'none';
        }

        // 2. Background crossfade
        const crossfadeCenter = 0.5;
        const crossfadeRange = 0.08;
        const crossfadeStart = crossfadeCenter - crossfadeRange;
        const crossfadeEnd = crossfadeCenter + crossfadeRange;
        if (progress <= crossfadeStart) {
          bgNight.style.opacity = 0;
          bgDay.style.opacity = 1;
        } else if (progress >= crossfadeEnd) {
          bgNight.style.opacity = 1;
          bgDay.style.opacity = 0;
        } else {
          const nightOpacity = (progress - crossfadeStart) / (crossfadeEnd - crossfadeStart);
          bgNight.style.opacity = nightOpacity;
          bgDay.style.opacity = 1 - nightOpacity;
        }

        // 3. Body XL gradient scroll
        if (progress >= 0.13) {
          bodyXlEl.style.opacity = 1;
          const textStart = 0.15;
          const textEnd = 0.95;
          const textProgress = Math.max(0, Math.min(1, (progress - textStart) / (textEnd - textStart)));

          for (let i = 0; i < totalChars; i++) {
            const charStart = i / totalChars;
            const charEnd = (i + 1) / totalChars;
            const charProgress = Math.max(0, Math.min(1, (textProgress - charStart) / (charEnd - charStart)));
            allChars[i].style.opacity = charProgress;
          }
        } else {
          bodyXlEl.style.opacity = 0;
        }

        // 4. Character movement (Optimized with transform)
        const startLeft = viewW + 219;
        const endLeft = -219;
        const charLeft = startLeft + (endLeft - startLeft) * progress;
        character.style.transform = `translateX(${charLeft}px)`;

        ticking = false;
      };

      heroScrollHandler = function () {
        currentScrollY = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(heroScrollUpdate);
          ticking = true;
        }
      };

      heroResizeHandler = function () {
        updateDimensions();
        heroScrollHandler();
      };

      window.addEventListener('scroll', heroScrollHandler, { passive: true });
      window.addEventListener('resize', heroResizeHandler);
      updateDimensions();
      heroScrollUpdate();
    }

    // ════════════════════════════════════════════════
    // GRAPH ANIMATION — Intersection Observer
    // ════════════════════════════════════════════════
    const graphEl = graphRef.current;
    if (graphEl) {
      graphObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              graphEl.classList.add('graph-animate');
            }
          });
        },
        { threshold: 0.3 }
      );
      graphObserver.observe(graphEl);
    }

    // ════════════════════════════════════════════════
    // SCROLL REVEAL (using package)
    // ════════════════════════════════════════════════
    let sr = null;
    const initScrollReveal = async () => {
      const ScrollReveal = (await import('scrollreveal')).default;
      sr = ScrollReveal();

      sr.reveal('.section', {
        distance: '40px', origin: 'bottom', duration: 800, delay: 100, easing: 'ease-out', interval: 150
      });
      sr.reveal('.section-header, .section-text-block', {
        distance: '30px', origin: 'bottom', duration: 700, delay: 200, easing: 'ease-out'
      });
      sr.reveal('.card, .comp-card', {
        distance: '30px', origin: 'bottom', duration: 600, delay: 100, easing: 'ease-out', interval: 100
      });
      sr.reveal('.faq-list', {
        distance: '30px', origin: 'bottom', duration: 700, delay: 100, easing: 'ease-out'
      });
      sr.reveal('.app-img-wrapper, .studio-img-wrapper', {
        distance: '40px', origin: 'bottom', duration: 800, delay: 200, easing: 'ease-out'
      });
      sr.reveal('.cost-table-desktop', {
        distance: '30px', origin: 'bottom', duration: 700, delay: 100, easing: 'ease-out'
      });
      sr.reveal('.step-card', {
        distance: '30px', origin: 'bottom', duration: 600, delay: 100, easing: 'ease-out', interval: 100
      });
    };

    initScrollReveal();

    // ════════════════════════════════════════════════
    // CLEANUP
    // ════════════════════════════════════════════════
    return () => {
      if (bodyXlEl) bodyXlEl.innerHTML = '';

      if (heroScrollHandler) {
        window.removeEventListener('scroll', heroScrollHandler);
      }
      if (heroResizeHandler) {
        window.removeEventListener('resize', heroResizeHandler);
      }

      if (graphObserver) graphObserver.disconnect();

      if (sr) sr.destroy();
    };
  }, []);

  /* ── Removed local data definitions ── */

  return (
    <>
      <SmoothScroll />
      <Header />

      {/* ══════════════════════════════════════════════
           1. HERO
           ══════════════════════════════════════════════ */}
      <div className="hero-pin-spacer">
        <section className="hero" id="hero">
          <div className="hero-bg-day"></div>
          <div className="hero-bg-night"></div>

          <div className="hero-content" id="hero-title-content">
            <h1 className="hero-title">
              반려동물과 반려인, <br className="mobile-br" />
              그리고 브랜드가 함께 <br />
              행복한 세상을 꿈꾸는 <br className="mobile-br" />
              옴니채널 플랫폼, <br />
              멍냥의민족입니다.
            </h1>
          </div>

          <div className="hero-body-xl" id="hero-body-xl" ref={heroBodyXlRef}></div>

          <img
            src="/assets/images/hero/fast-pet-supply-delivery-service-character-illustration.png"
            alt="배달 캐릭터 일러스트레이션"
            className="hero-character"
            id="hero-character"
          />
        </section>
      </div>


      {/* ══════════════════════════════════════════════
           2. 앱 이용 혜택
           ══════════════════════════════════════════════ */}
      <section className="section section-full" id="app-benefits">
        <div className="contents-wrapper">
          <div className="section-text-block">
            <h2 className="h2">
              반려생활이 곧 수익이 되는 곳,<br />
              온·오프라인 최초 플랫폼
            </h2>
            <p className="body-l">
              공유와 추천을 통한 수익 구조.<br />
              상대방이 구매할 때마다 나에게 리워드가 쌓여,<br />
              지속적인 온라인 수익 창출이 가능합니다.<br /><br />
              언제든지 가능한 캐쉬 환급<br />
              적립된 리워드는 단순한 포인트에 머물지 않고,<br />
              언제든 캐쉬로 전환 가능합니다.
            </p>
          </div>
          <div className="img-wrapper app-img-wrapper">
            <img
              src="/assets/images/app/mungnyang-app-ui-point-reward-screen-mockup.png"
              alt="멍냥의민족 앱 마일리지 적립 화면 예시"
              className="app-mockup"
            />
            <img
              src="/assets/images/app/mungnyang-mascot-ddung-nyang-holding-cash-10-percent-reward.svg"
              alt="양손에 현금을 들고 좋아하는 멍냥의민족 마스코트 뚱냥"
              className="app-mascot"
            />
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
           3. Brand Values (기존 셀프 스튜디오 이미지 유지)
           ══════════════════════════════════════════════ */}
      <section className="section section-full" id="brand-values">
        <div className="contents-wrapper">
          <div className="section-text-block">
            <h2>Brand Values</h2>
            <div className="brand-values-list">
              <div className="brand-value-item">
                <h3 className="brand-value-title">Premium Sourcing</h3>
                <p className="body-l">
                  까다로운 기준으로 엄선한 고품질 상품만을 선보여<br />
                  반려동물의 건강과 삶의 질을 높입니다.
                </p>
              </div>
              <div className="brand-value-item">
                <h3 className="brand-value-title">Free Self-Studio</h3>
                <p className="body-l">
                  오프라인 매장 &lsquo;멍냥의민족&rsquo;에 마련된<br />
                  전문 셀프 스튜디오에서 우리 아이와의<br />
                  소중한 순간을 무료로 기록하세요.
                </p>
              </div>
            </div>
          </div>
          <div className="img-wrapper studio-img-wrapper">
            <img
              src="/assets/images/studio/mungnyang-pet-self-studio-bichon-photo-zone-memory.jpg"
              alt="멍냥의민족 매장 내 셀프 스튜디오"
              className="studio-main-img"
            />
            <img
              src="/assets/images/studio/mungnyang-mascot-ddung-meong-playing-ball-happy-memory.svg"
              alt="노란 공을 가지고 신나게 노는 멍냥의민족 마스코트 뚱멍"
              className="studio-mascot"
            />
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
           4. 창업포인트 – 트렌드 시장 그래프
           ══════════════════════════════════════════════ */}
      {/* 4. 창업포인트 – 헤더 섹션 (독립 섹션) */}
      <section className="section section-trend-header" id="trend-market-header">
        <div className="contents-wrapper contents-wrapper--column">
          <p className="trend-header-eyebrow">
            국내 최초 온·오프라인 수익창출 모델
          </p>
          <h2 className="trend-header-title">
            멍냥의민족 창업,<br className="mobile-br" />
            꼭 해야하는 이유는?
          </h2>
        </div>
      </section>

      {/* 4-2. 창업포인트 – 트렌드 시장 그래프 (본문 섹션) */}
      <section className="section section-trend-body" id="trend-market-body">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="trend-content">
            <div className="section-header-group">
              <div className="section-header">
                <p className="eyebrow">Point 01</p>
                <h2 className="h2">지속성장하는 트렌드 시장</h2>
              </div>
              <p className="body-m">
                1,500만 전체 가구의 약 25~28%가<br />
                반려동물을 양육 중입니다.
              </p>
            </div>

            {/* SVG Graph */}
            <div className="trend-graph" ref={graphRef}>
              <svg viewBox="-40 0 1240 600" className="market-graph" preserveAspectRatio="xMidYMid meet">
                {/* Y-axis labels */}
                <text x="68" y="78" className="graph-label-y">6.0조</text>
                <text x="68" y="183" className="graph-label-y">5.5조</text>
                <text x="68" y="288" className="graph-label-y">5.0조</text>
                <text x="68" y="393" className="graph-label-y">4.5조</text>
                <text x="68" y="498" className="graph-label-y">4.0조</text>

                {/* Y-axis grid lines */}
                <line x1="105" y1="72" x2="1125" y2="72" className="graph-grid" />
                <line x1="105" y1="177" x2="1125" y2="177" className="graph-grid" />
                <line x1="105" y1="282" x2="1125" y2="282" className="graph-grid" />
                <line x1="105" y1="387" x2="1125" y2="387" className="graph-grid" />
                <line x1="105" y1="492" x2="1125" y2="492" className="graph-grid" />

                {/* X-axis labels */}
                <text x="330" y="540" className="graph-label-x">2024년</text>
                <text x="675" y="540" className="graph-label-x">2025년</text>
                <text x="1020" y="540" className="graph-label-x">2026년</text>
                <text x="1020" y="560" className="graph-label-x graph-label-sub">(예상)</text>

                {/* Gradient fill area */}
                <defs>
                  <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2BC2BD" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2BC2BD" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <path
                  d="M 150 492 Q 240 420 330 324 Q 510 294 675 240 Q 870 150 1050 72 L 1050 492 Z"
                  fill="url(#graphGradient)"
                  className="graph-area"
                />

                {/* Line */}
                <path
                  d="M 150 492 Q 240 420 330 324 Q 510 294 675 240 Q 870 150 1050 72"
                  fill="none"
                  stroke="#2BC2BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="graph-line"
                />

                {/* Data points */}
                <circle cx="330" cy="324" r="6" fill="#fff" stroke="#2BC2BD" strokeWidth="3" className="graph-dot" />
                <circle cx="675" cy="240" r="6" fill="#fff" stroke="#2BC2BD" strokeWidth="3" className="graph-dot" />
                <circle cx="1050" cy="72" r="6" fill="#fff" stroke="#2BC2BD" strokeWidth="3" className="graph-dot" />

                {/* Data labels */}
                <text x="330" y="300" className="graph-data-label">4.8조</text>
                <text x="675" y="216" className="graph-data-label">5.2조</text>
                <text x="1050" y="48" className="graph-data-label graph-data-highlight">6.0조</text>

                {/* Vertical dashed line for 2026 */}
                <line x1="1050" y1="72" x2="1050" y2="492" className="graph-dash-line" />

                {/* Growth annotation */}
                <text x="945" y="310" className="graph-annotation-small">전년 대비 시장 매출 규모</text>
                <text x="930" y="358" className="graph-annotation-big">약 15.4% 성장</text>
              </svg>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
           5. 경쟁력 – 6개 카드
           ══════════════════════════════════════════════ */}
      <section className="section section-competitiveness" id="competitiveness">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="section-header">
            <p className="eyebrow">Point 02</p>
            <h2 className="h2">멍냥의민족의 경쟁력</h2>
          </div>

          <div className="competitiveness-grid">
            <div className="comp-card">
              <div className="comp-card-header">
                <span className="comp-card-header-title">차별점 01</span>
              </div>
              <div className="comp-card-body">
                <p className="comp-card-eyebrow">수익구조</p>
                <h3 className="comp-card-title">
                  로열티 0% 모델<br />
                  수익률 본사 0%<br />
                  점주 100%
                </h3>
              </div>
            </div>

            <div className="comp-card">
              <div className="comp-card-header">
                <span className="comp-card-header-title">차별점 02</span>
              </div>
              <div className="comp-card-body">
                <p className="comp-card-eyebrow">O2O 옴니채널</p>
                <h3 className="comp-card-title">
                  온라인 수익<br />
                  연계가능
                </h3>
              </div>
            </div>

            <div className="comp-card">
              <div className="comp-card-header">
                <span className="comp-card-header-title">차별점 03</span>
              </div>
              <div className="comp-card-body">
                <p className="comp-card-eyebrow">수익성</p>
                <h3 className="comp-card-title">
                  리테일 프랜차이즈 중<br />
                  투자 대비 높은 수익성
                </h3>
              </div>
            </div>

            <div className="comp-card">
              <div className="comp-card-header">
                <span className="comp-card-header-title">차별점 04</span>
              </div>
              <div className="comp-card-body">
                <p className="comp-card-eyebrow">물류경쟁력</p>
                <h3 className="comp-card-title">
                  공동물류 구현 타사 대비<br />
                  원가 6-10% 절감
                </h3>
              </div>
            </div>

            <div className="comp-card">
              <div className="comp-card-header">
                <span className="comp-card-header-title">차별점 05</span>
              </div>
              <div className="comp-card-body">
                <p className="comp-card-eyebrow">블루오션</p>
                <h3 className="comp-card-title">
                  포화시장인 카페,<br />
                  편의점 대비 최적의<br />
                  블루오션 리테일 시장
                </h3>
              </div>
            </div>

            <div className="comp-card">
              <div className="comp-card-header">
                <span className="comp-card-header-title">차별점 06</span>
              </div>
              <div className="comp-card-body">
                <p className="comp-card-eyebrow">검증된 창업비용</p>
                <h3 className="comp-card-title">
                  <span className="comp-badge">업계최저</span> 창업비용 동종업계 대<br />
                  비 30% 절감<br />
                  <span className="comp-badge">거품제거</span> 로열티/교육비 파격<br />
                  면제
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
           6. 비용 비교 – 테이블
           ══════════════════════════════════════════════ */}
      <section className="section section-cost" id="cost-comparison">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="section-header">
            <p className="eyebrow">Point 03</p>
            <h2 className="h2">타사 VS 멍냥의민족 비교견적</h2>
          </div>

          {/* ── Desktop Table ── */}
          <div className="cost-table-wrapper cost-table-desktop">
            <table className="cost-table">
              <thead>
                <tr>
                  <th className="cost-th cost-th-category">구분</th>
                  <th className="cost-th cost-th-competitor">타사 평균</th>
                  <th className="cost-th cost-th-mungmin">멍냥의민족</th>
                </tr>
              </thead>
              <tbody>
                {COST_DATA.map((row, i) => (
                  <tr key={i}>
                    <td className="cost-td cost-td-category">
                      <strong>{row.category}</strong>
                      <span className="cost-td-desc">{row.desc}</span>
                    </td>
                    <td className="cost-td cost-td-competitor">
                      {row.competitor}
                      {row.competitorNote && <span className="cost-td-note">{row.competitorNote}</span>}
                    </td>
                    <td className="cost-td cost-td-mungmin">
                      <strong>{row.mungmin}</strong>
                      {row.mungminNote && <span className="cost-td-note">{row.mungminNote}</span>}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="cost-total-row">
                  <td className="cost-td cost-td-category">
                    <strong>{COST_TOTAL.category}</strong>
                    <span className="cost-td-desc">{COST_TOTAL.desc}</span>
                  </td>
                  <td className="cost-td cost-td-competitor">{COST_TOTAL.competitor}</td>
                  <td className="cost-td cost-td-mungmin cost-td-total-mungmin">
                    <strong>{COST_TOTAL.mungmin}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Mobile Table (Card Layout) ── */}
          <div className="cost-table-wrapper cost-table-mobile">
            <div className="cost-mobile-header">
              <span className="cost-mobile-header-competitor">타사 평균</span>
              <span className="cost-mobile-header-mungmin">멍냥의민족</span>
            </div>
            {COST_DATA.map((row, i) => (
              <div className="cost-mobile-card" key={i}>
                <div className="cost-mobile-card-top">
                  <strong>{row.category}</strong> – {row.desc}
                </div>
                <div className="cost-mobile-card-values">
                  <span className="cost-mobile-val-competitor">
                    {row.competitor}
                    {row.competitorNote && <span className="cost-td-note">{row.competitorNote}</span>}
                  </span>
                  <span className="cost-mobile-val-mungmin">
                    <strong>{row.mungmin}</strong>
                    {row.mungminNote && <span className="cost-td-note">{row.mungminNote}</span>}
                  </span>
                </div>
              </div>
            ))}
            {/* Total Card */}
            <div className="cost-mobile-card cost-mobile-total">
              <div className="cost-mobile-card-top">
                <strong>{COST_TOTAL.category}</strong> – {COST_TOTAL.desc}
              </div>
              <div className="cost-mobile-card-values">
                <span className="cost-mobile-val-competitor">타사 {COST_TOTAL.competitor}</span>
                <span className="cost-mobile-val-mungmin cost-mobile-val-total">
                  <strong>멍민 {COST_TOTAL.mungmin}</strong>
                </span>
              </div>
            </div>
          </div>

          <ul className="cost-footnote">
            <li>상가 컨디션에 따른 인테리어 비용 감소 및 증가</li>
            <li>사업비용 남을 시 환급</li>
          </ul>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
           7. 창업절차 (9 STEP)
           ══════════════════════════════════════════════ */}
      <section className="section section-startup-steps" id="startup-steps">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="section-header">
            <p className="eyebrow">창업절차</p>
            <h2 className="h2">
              멍냥의민족 창업<br />
              이렇게 준비하세요
            </h2>
          </div>

          <div className="steps-grid-container">
            {STARTUP_STEPS.map((s, idx) => (
              <div key={s.step} className={`step-card ${idx === 8 ? 'store-combined-card' : ''}`}>
                {idx === 8 ? (
                  <div className="store-combined-content">
                    <span className="step-badge">STEP {s.step}</span>
                    <p className="step-title-bold">{s.title}</p>
                    <p className="step-desc-text">{s.desc}</p>
                    {s.note && <p className="step-note-small">{s.note}</p>}
                    <p className="step-note-small step-footnote-medium">
                      *가맹계약 후 영업일기준 15일 이내 오픈 프로세스를 유지하고있습니다.
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="step-badge">STEP {s.step}</span>
                    <p className="step-title-bold">{s.title}</p>
                    <p className="step-desc-text">{s.desc}</p>
                    {s.note && <p className="step-note-small">{s.note}</p>}
                  </>
                )}
                {idx === 8 && (
                  <div className="store-combined-img">
                    <img src="/assets/images/franchise-steps/mungnyang-franchise-open-process.png" alt="멍냥의민족 가맹 프로세스 오픈 이미지" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
           8. 창업성공기 (유튜브)
           ══════════════════════════════════════════════ */}
      <section className="section section-success-stories" id="success-stories">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="section-header section-header--with-controls">
            <div className="section-header-text">
              <p className="eyebrow">창업성공기</p>
              <h2 className="h2">
                실제 점주님의 리얼한<br />
                창업 성공기를 들어보세요
              </h2>
            </div>
            {!isMobile && (
              <div className="slider-controls">
                <button 
                  className="slider-btn prev-btn" 
                  onClick={() => {
                    setSliderIndex(prev => Math.max(0, prev - 1));
                  }}
                  disabled={sliderIndex === 0}
                  aria-label="Previous slide"
                >
                  <img src="/assets/images/common/icon/arrow_back_24dp_131313_FILL0_wght300_GRAD0_opsz24.svg" alt="Left" />
                </button>
                <button 
                  className="slider-btn next-btn" 
                  onClick={() => {
                    // Maximum index is set to 2 (SUCCESS_STORIES.length - 3) so that the 5th card reaches the end of the 1200px grid.
                    setSliderIndex(prev => Math.min(SUCCESS_STORIES.length - 3, prev + 1));
                  }}
                  disabled={sliderIndex >= SUCCESS_STORIES.length - 3}
                  aria-label="Next slide"
                >
                  <img src="/assets/images/common/icon/arrow_forward_24dp_131313_FILL0_wght300_GRAD0_opsz24.svg" alt="Right" />
                </button>
              </div>
            )}
          </div>

          <div className="success-stories-slider-container">
            <div 
              className="success-stories-list"
              style={{ 
                transform: isMobile ? 'none' : `translateX(-${sliderIndex * (387 + 24)}px)`
              }}
            >
              {SUCCESS_STORIES.map((video) => (
                <div className="youtube-card" key={video.id} onClick={() => setSelectedVideo(`https://www.youtube.com/embed/${video.id}`)}>
                  <div
                    className="youtube-placeholder"
                    style={{ 
                      backgroundImage: `url(https://img.youtube.com/vi/${video.id}/maxresdefault.jpg)`
                    }}
                  >
                    <div className="play-button-overlay"></div>
                  </div>
                  <div className="youtube-info">
                    <p className="video-eyebrow">{video.eyebrow}</p>
                    <h3 className="video-title">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
           9. FAQ
           ══════════════════════════════════════════════ */}
      <section className="section section-faq" id="faq">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="section-header" style={{ textAlign: 'left', width: '100%' }}>
            <p className="eyebrow">FAQ</p>
            <h2 className="h2">자주 묻는 질문</h2>
          </div>

          <div className="faq-list">
            {[
              { q: '정말 로열티가 0원인가요?', a: '네, 맞습니다. 멍냥의민족은 본사의 배를 불리는 로열티 대신, 점주님과 함께 성장하는 상생 구조를 택했습니다.' },
              { q: '무인 매장 관리가 어렵진 않나요?', a: '걱정 마세요. 스마트한 IoT 시스템과 본사의 밀착 교육으로 운영이 어렵지 않도록 도와드립니다.' },
              { q: '상권 분석은 어떻게 하나요?', a: '전문 개발 담당자가 배후 세대, 유동 인구, 경쟁점을 철저히 분석해 \'되는 자리\'만 추천해 드립니다.' },
            ].map((item, i) => (
              <div className="faq-item" key={i}>
                <div className="faq-question">{item.q}</div>
                <div className="faq-answer">
                  <div className="faq-answer-inner">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
           10. 창업문의
           ══════════════════════════════════════════════ */}
      <section className="section section-contact" id="contact">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="contact-header-row">
            <div className="contact-left">
              <h2 className="h2" style={{ marginTop: '16px' }}>
                <span style={{ color: '#2BC2BD' }}>멍냥의민족</span><br />
                창업에 대한 궁금증을<br />
                모두 해결해 드립니다.
              </h2>
            </div>
            <div className="contact-right">
              <p className="contact-eyebrow">24시간 전화상담</p>
              <p className="contact-phone">070-4141-6402</p>
              <a href="tel:070-4141-6402" className="btn btn-primary btn-round mobile-only" style={{ padding: '16px 32px', fontSize: '20px', marginTop: '24px' }}>모바일 전화 상담</a>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                <div className="form-field">
                  <label className="form-label">성함</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="성함을 입력해주세요."
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">연락처</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    placeholder="연락처를 입력해주세요."
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">이메일</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="이메일을 입력해주세요."
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">창업 희망지역</label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    placeholder="주소"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="detailLocation"
                    className="form-input"
                    placeholder="상세주소"
                    value={formData.detailLocation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field form-field--full">
                  <label className="form-label">내용</label>
                  <textarea
                    name="content"
                    className="form-textarea"
                    placeholder="궁금하신 점을 적어주세요."
                    value={formData.content}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              <label className="form-privacy">
                <input
                  type="checkbox"
                  name="privacy"
                  checked={formData.privacy}
                  onChange={handleInputChange}
                />
                <span>
                  <button type="button" className="privacy-link" onClick={() => setIsPrivacyPopupOpen(true)}>
                    개인정보 수집 및 이용
                  </button>
                  에 동의합니다.
                </span>
              </label>

              <div className="form-submit-row">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '전송 중...' : '문의하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
           11. 관계사
           ══════════════════════════════════════════════ */}
      <section className="section section-partners" id="partners">
        <div className="partners-list">
          <InfiniteSlider gap={32} duration={80}>
            {partners.length > 0 ? (
              // Use double map to ensure even short lists look infinite
              [...partners, ...partners].map((partner, idx) => (
                <a 
                  key={`${partner.id}-${idx}`} 
                  href={partner.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="partner-logo"
                >
                  <img src={partner.logoUrl} alt={partner.name} />
                </a>
              ))
            ) : (
              // Fallback or loading state
              [1, 2, 3, 4].map((set) => (
                <div key={set} style={{ display: 'flex', gap: '32px' }}>
                  <div className="partner-logo">
                    <img src="/assets/images/partners/logo-PetVillage.svg" alt="펫빌리지 로고" />
                  </div>
                  <div className="partner-logo">
                    <img src="/assets/images/partners/logo-monggeulnyanggeul.svg" alt="몽글냥글 로고" />
                  </div>
                  <div className="partner-logo">
                    <img src="/assets/images/partners/logo-petinkitchen.svg" alt="펫인키친 로고" />
                  </div>
                </div>
              ))
            )}
          </InfiniteSlider>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
           12. FOOTER
           ══════════════════════════════════════════════ */}
      <footer className="site-footer" id="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <ul className="footer-links">
              <li><button type="button" className="privacy-link" onClick={() => setIsTermsPopupOpen(true)}>이용약관</button></li>
              <li><button type="button" className="privacy-link" onClick={() => setIsFooterPrivacyPopupOpen(true)}>개인정보처리방침</button></li>
            </ul>
          </div>

          <div className="footer-info">
            <p>
              대표: 신상훈 | 사업자 등록번호: 129-87-03274<br />
              스토어: 서울시 양천구 남부순환로 425 멍냥의민족 1층<br />
              본사: 서울특별시 강서구 공항대로 426 VIP빌딩 1001호<br />
              이메일: help@pet-pal.co.kr | 통신판매업 신고번호 : 2022-고양덕양구-0659 | 개인정보관리자: 김연주
            </p>
          </div>

          <p className="footer-copyright">
            Copyright© 2026 <strong>mungmin</strong> All Rights Reserved.
          </p>
        </div>
      </footer>

      <ContactButton />

      <div className={`popup-overlay ${isPopupOpen ? 'is-active' : ''}`}>
        <div className="popup">
          <div className="popup-header" style={{ textAlign: 'center' }}>
            <p className="popup-eyebrow">알림</p>
            <h3 className="popup-title">
              빈 항목이 있어요.<br />
              필수항목을 입력해주세요.
            </h3>
          </div>

          <div className="popup-img-wrapper">
            <img
              src="/assets/images/common/mungnyang-mascot-character-bichon.svg"
              alt="Mungnyang Mascot"
              style={{ width: '200px', height: '200px' }}
            />
          </div>

          <button
            type="button"
            className="popup-btn btn-primary"
            onClick={() => setIsPopupOpen(false)}
          >
            확인
          </button>
        </div>
      </div>

      {/* --- Video Popup --- */}
      {selectedVideo && (
        <div className="popup-overlay is-active" onClick={() => setSelectedVideo(null)}>
          <div
            className="video-popup-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '1200px',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              style={{
                position: 'absolute',
                top: '-56px', // 48px(size) + 8px(gap)
                right: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src="/assets/images/common/icon/close_24dp_FFFFFF_FILL0_wght300_GRAD-25_opsz24.svg"
                alt="Close video"
                style={{ width: '48px', height: '48px' }}
              />
            </button>

            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%', // 16:9 ratio
                height: 0,
                overflow: 'hidden',
                borderRadius: '16px',
                backgroundColor: '#000'
              }}
            >
              <iframe
                src={selectedVideo}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
      {/* Privacy Policy Popup (Form) */}
      <div className={`popup-overlay ${isPrivacyPopupOpen ? 'is-active' : ''}`} onClick={() => setIsPrivacyPopupOpen(false)}>
        <div className="popup privacy-popup-content" onClick={(e) => e.stopPropagation()}>
          <h3>개인정보 수집 및 이용</h3>
          <div className="privacy-popup-body" data-lenis-prevent>
            {PRIVACY_POLICY.split('\n').map((line, index) => (
              <p key={index}>{line || <br />}</p>
            ))}
          </div>
          <div className="privacy-popup-footer">
            <button
              type="button"
              className="btn btn-m btn-primary btn-round"
              onClick={() => setIsPrivacyPopupOpen(false)}
              style={{ width: '100%' }}
            >
              확인
            </button>
          </div>
        </div>
      </div>

      {/* Terms of Service Popup (Footer) */}
      <div className={`popup-overlay ${isTermsPopupOpen ? 'is-active' : ''}`} onClick={() => setIsTermsPopupOpen(false)}>
        <div className="popup privacy-popup-content" onClick={(e) => e.stopPropagation()}>
          <h3>이용약관</h3>
          <div className="privacy-popup-body" data-lenis-prevent>
            {TERMS_OF_SERVICE.split('\n').map((line, index) => (
              <p key={index}>{line || <br />}</p>
            ))}
          </div>
          <div className="privacy-popup-footer">
            <button
              type="button"
              className="btn btn-m btn-primary btn-round"
              onClick={() => setIsTermsPopupOpen(false)}
              style={{ width: '100%' }}
            >
              확인
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Popup (Footer) */}
      <div className={`popup-overlay ${isFooterPrivacyPopupOpen ? 'is-active' : ''}`} onClick={() => setIsFooterPrivacyPopupOpen(false)}>
        <div className="popup privacy-popup-content" onClick={(e) => e.stopPropagation()}>
          <h3>개인정보처리방침</h3>
          <div className="privacy-popup-body" data-lenis-prevent>
            {PRIVACY_POLICY.split('\n').map((line, index) => (
              <p key={index}>{line || <br />}</p>
            ))}
          </div>
          <div className="privacy-popup-footer">
            <button
              type="button"
              className="btn btn-m btn-primary btn-round"
              onClick={() => setIsFooterPrivacyPopupOpen(false)}
              style={{ width: '100%' }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
