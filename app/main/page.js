'use client';

import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import ContactButton from '@/components/ContactButton';
import '@/styles/main.css';

export default function MainPage() {
  const heroBodyXlRef = useRef(null);
  const allCharsRef = useRef([]);

  useEffect(() => {
    // ════════════════════════════════════════════════
    // COST SLIDER LOGIC
    // ════════════════════════════════════════════════
    const sliderWrapper = document.querySelector('.cost-slider-wrapper');
    const slider = document.querySelector('.cost-slider');
    const originalCards = Array.from(document.querySelectorAll('.cost-card'));

    if (sliderWrapper && slider && originalCards.length > 0) {
      const cardWidth = originalCards[0].offsetWidth;
      const gap = 24;
      const cloneCount = 4;

      for (let i = 0; i < cloneCount; i++) {
        slider.appendChild(originalCards[i].cloneNode(true));
        slider.insertBefore(originalCards[originalCards.length - 1 - i].cloneNode(true), slider.firstChild);
      }

      let currentIndex = cloneCount;
      let isTransitioning = false;

      function updateSlider(animate = true) {
        const wrapperWidth = sliderWrapper.offsetWidth;
        const offset = (wrapperWidth / 2) - (currentIndex * (cardWidth + gap) + (cardWidth / 2));
        if (!animate) {
          slider.style.transition = 'none';
        } else {
          slider.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        }
        slider.style.transform = 'translateX(' + offset + 'px)';
      }

      function slideNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateSlider(true);
      }

      slider.addEventListener('transitionend', function () {
        isTransitioning = false;
        if (currentIndex >= originalCards.length + cloneCount) {
          currentIndex = cloneCount;
          updateSlider(false);
        }
        if (currentIndex < cloneCount) {
          currentIndex = originalCards.length + cloneCount - 1;
          updateSlider(false);
        }
      });

      const interval = setInterval(slideNext, 5000);
      updateSlider(false);

      window.addEventListener('resize', function () {
        updateSlider(false);
      });
    }

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
      // Split text into per-char spans
      const bodyText = '멍냥의민족은 단순히 물건만 사고파는 무인 매장이 아닙니다. 앱으로 미리 주문해 배송비를 아끼고, 매장 안 스튜디오에서는 아이와의 소중한 오늘을 기록해요. 반려인에게는 산책이 기다려지는 즐거운 공간이 되고, 점주님에게는 노동의 부담 없이 삶의 여유를 선물하는 든든한 파트너가 되어줍니다. 기술로 매장의 한계를 넘어, 사람과 반려동물 모두가 행복한 내일을 만들어 갑니다.';
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
      character.style.left = 'calc(100vw + 219px)';

      function heroScrollHandler() {
        const spacerRect = heroSpacer.getBoundingClientRect();
        const spacerHeight = heroSpacer.offsetHeight;
        const viewH = window.innerHeight;

        const scrolled = -spacerRect.top;
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

        // 4. Character movement
        const viewW = window.innerWidth;
        const startLeft = viewW + 219;
        const endLeft = -219;
        const charLeft = startLeft + (endLeft - startLeft) * progress;
        character.style.left = charLeft + 'px';
      }

      window.addEventListener('scroll', heroScrollHandler, { passive: true });
      window.addEventListener('resize', heroScrollHandler);
      heroScrollHandler();
    }

    // ════════════════════════════════════════════════
    // LENIS SMOOTH SCROLL (loaded via script tag)
    // ════════════════════════════════════════════════
    function initLenis() {
      if (typeof window.Lenis === 'undefined') return;
      const lenisInstance = new window.Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        orientation: 'vertical',
        smoothWheel: true,
      });
      window.lenis = lenisInstance;

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Load Lenis via script tag
    const lenisScript = document.createElement('script');
    lenisScript.src = 'https://unpkg.com/lenis@1.1.18/dist/lenis.min.js';
    lenisScript.onload = () => initLenis();
    document.head.appendChild(lenisScript);

    // ════════════════════════════════════════════════
    // SCROLL REVEAL (loaded via script tag)
    // ════════════════════════════════════════════════
    const srScript = document.createElement('script');
    srScript.src = 'https://unpkg.com/scrollreveal@4.0.9/dist/scrollreveal.min.js';
    srScript.onload = () => {
      if (typeof window.ScrollReveal === 'undefined') return;

      window.ScrollReveal().reveal('.section', {
        distance: '40px', origin: 'bottom', duration: 800, delay: 100, easing: 'ease-out', interval: 150, reset: true
      });
      window.ScrollReveal().reveal('.section-header, .section-text-block', {
        distance: '30px', origin: 'bottom', duration: 700, delay: 200, easing: 'ease-out', reset: true
      });
      window.ScrollReveal().reveal('.card', {
        distance: '30px', origin: 'bottom', duration: 600, delay: 100, easing: 'ease-out', interval: 100, reset: true
      });
      window.ScrollReveal().reveal('.cost-slider-wrapper', {
        distance: '30px', origin: 'bottom', duration: 700, delay: 100, easing: 'ease-out', reset: true
      });
      window.ScrollReveal().reveal('.faq-list', {
        distance: '30px', origin: 'bottom', duration: 700, delay: 100, easing: 'ease-out', reset: true
      });
      window.ScrollReveal().reveal('.app-img-wrapper, .studio-img-wrapper', {
        distance: '40px', origin: 'bottom', duration: 800, delay: 200, easing: 'ease-out', reset: true
      });
    };
    document.head.appendChild(srScript);

  }, []);

  return (
    <>
      <Header />

      {/* ── HERO ── */}
      <div className="hero-pin-spacer">
        <section className="hero" id="hero">
          <div className="hero-bg-day"></div>
          <div className="hero-bg-night"></div>

          <div className="hero-content" id="hero-title-content">
            <h1 className="hero-title">
              반려쇼핑의 모든 것,<br />
              산책길에 쉽고 알뜰하게.
            </h1>
            <p className="hero-subtitle">국내 최초 O2O 리워드 샵, 멍냥의민족</p>
          </div>

          <div className="hero-body-xl" id="hero-body-xl" ref={heroBodyXlRef}></div>

          <img
            src="/assets/images/hero/fast-pet-supply-delivery-service-character-illustration.svg"
            alt="배달 캐릭터 일러스트레이션"
            className="hero-character"
            id="hero-character"
          />
        </section>
      </div>

      {/* ── 앱 이용 혜택 ── */}
      <section className="section section-full" id="app-benefits">
        <div className="contents-wrapper">
          <div className="section-text-block">
            <h2 className="h2">
              산책하다 들렀는데<br />
              돈 벌어가는 기분.
            </h2>
            <p className="body-l" style={{ marginTop: 'var(--title-body-gap)' }}>
              매장에서 몽글냥글 앱을 사용해보세요.<br />
              전 상품 10%가 영구 적립되거든요.<br />
              집에서 주문하고 매장에서 픽업하면<br />
              배송비도 아낄 수 있죠.
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

      {/* ── 셀프 스튜디오 ── */}
      <section className="section section-full" id="self-studio">
        <div className="contents-wrapper">
          <div className="section-text-block">
            <h2 className="h2">
              아이들 간식 사러 왔다가,<br />
              잊지 못할 추억까지.
            </h2>
            <p className="body-l" style={{ marginTop: 'var(--title-body-gap)' }}>
              매장 안 셀프 스튜디오에서 견생샷을 남겨보세요.<br />
              물건을 파는 곳을 넘어,<br />
              추억을 파는 공간이니까요.
            </p>
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

      {/* ── 경쟁력 ── */}
      <section className="section section-competitiveness" id="competitiveness">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="section-header">
            <p className="eyebrow">경쟁력</p>
            <h2 className="h2">
              그런데 사장님,<br />
              이 모든 혜택이 매출이 된다면요?
            </h2>
          </div>

          <div className="cards-wrapper">
            <div className="cards-row-2">
              <div className="card">
                <div className="card-text">
                  <p className="card-eyebrow">수익구조</p>
                  <h3 className="card-title">본사 0%<br />점주 100%<br />로열티 면제</h3>
                </div>
                <div className="card-img">
                  <img src="/assets/images/competitiveness/mungnyang-franchise-zero-royalty-100-percent-profit-mascot.svg" alt="로열티 면제 마스코트" />
                </div>
              </div>
              <div className="card">
                <div className="card-text">
                  <p className="card-eyebrow">O2O</p>
                  <h3 className="card-title">고객이 앱으로<br />상품을 구매하면<br />수익이 우리 가게로</h3>
                </div>
                <div className="card-img">
                  <img src="/assets/images/competitiveness/mungnyang-o2o-app-order-store-revenue-model-mascot.svg" alt="O2O 수익 모델 마스코트" />
                </div>
              </div>
            </div>

            <div className="cards-row-3">
              <div className="card">
                <div className="card-text">
                  <p className="card-eyebrow">SKU</p>
                  <h3 className="card-title">직영점 데이터로<br />우리 매장에<br />가장 최적화된 상품 제안</h3>
                </div>
              </div>
              <div className="card">
                <div className="card-text">
                  <p className="card-eyebrow">물류경쟁력</p>
                  <h3 className="card-title">업계 최초<br />1,000평 규모의<br />공동 물류 센터 운영</h3>
                </div>
              </div>
              <div className="card">
                <div className="card-text">
                  <p className="card-eyebrow">빠른 오픈</p>
                  <h3 className="card-title">가맹 계약 후<br />영업일 기준<br />15일 이내 오픈</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 비용 비교 ── */}
      <section className="section section-cost" id="cost-comparison">
        <div className="contents-wrapper">
          <div className="cost-text">
            <p className="eyebrow">비용 비교</p>
            <h2 className="h2" style={{ marginTop: 'var(--title-eyebrow-gap)' }}>
              타사 대비<br />최소 3,600만 원에서<br />최대 3,800만원 차이
            </h2>
            <p className="body-m">*권리금, 임대료, 월세 제외</p>
            <a href="#" className="btn btn-l btn-round btn-primary">창업 비용 자세히 보기</a>
          </div>

          <div className="cost-slider-wrapper">
            <div className="cost-slider">
              {[
                { eyebrow: '온라인 수익', title: '오프라인과\n온라인 연계 수익 창출', main: '가능', other: '타사 평균 불가능' },
                { eyebrow: '가맹비', title: '상표사용, 상권조사 등', main: '500만원', other: '타사 평균 200~500만원' },
                { eyebrow: '교육비', title: '운영에 관한 교육', main: '면제', other: '타사 평균 200~300만원' },
                { eyebrow: '익스테리어', title: '메인간판, 서브간판, 시트지', main: '400만원', other: '타사 평균 400만원~700만원' },
                { eyebrow: '인테리어', title: '조명, 전기작업,\n타일, 시그니처 페인트 등', main: '600~800만 원', other: '타사 평균 1,500~3,000만원' },
                { eyebrow: '키오스크', title: '키오스크 (카드전용)', main: '265만원', other: '타사 평균 250~300만원' },
                { eyebrow: '진열선반', title: '매장 전체 선반 및 행사매대', main: '450만원', other: '타사 평균 450~550만원' },
                { eyebrow: '반려동물 제품', title: '10평 기준', main: '1,100만원', other: '타사 평균 1,300~1,500만원' },
                { eyebrow: '씨씨티비', title: '8채널+모니터', main: '153만원', other: '타사 평균 252만원' },
                { eyebrow: '스튜디오', title: '스튜디오 선반,\n스튜디오 용품', main: '50만원', other: '타사 스튜디오 없음' },
                { eyebrow: '로열티', title: '매출 정률 or 매출 정액', main: '면제', other: '타사 평균 15~30만원' },
                { eyebrow: '의류', title: '선반+의류', main: '80만원', other: '타사 평균 150만원' },
                { eyebrow: '선택사항', title: '냉난방기, 철거, 어닝 등', main: '별도견적', other: '타사 평균 -' },
                { eyebrow: '합계', title: '권리금, 임대료, 월세 제외\n(VAT 별도)', main: '3,600만원 ~ 3,800만원', other: '타사 평균 4,700만원 ~ 7,300만원' },
              ].map((card, i) => (
                <div className="cost-card" key={i}>
                  <div className="cost-card-top">
                    <div className="card-text">
                      <p className="card-eyebrow">{card.eyebrow}</p>
                      <h3 className="card-title" dangerouslySetInnerHTML={{ __html: card.title.replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                  <div className="cost-card-prices">
                    <p className="cost-price-main">{card.main}</p>
                    <p className="cost-price-other">{card.other}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
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

      {/* ── 관계사 ── */}
      <section className="section section-partners" id="partners">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="partners-list">
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
        </div>
      </section>

      {/* ── 창업문의 ── */}
      <section className="section section-contact" id="contact">
        <div className="contents-wrapper">
          <div className="contact-left">
            <h2 className="h2">
              <span style={{ color: 'var(--color-accent)' }}>멍냥의민족</span><br />
              창업에 대한 궁금증을<br />
              모두 해결해 드립니다.
            </h2>
          </div>
          <div className="contact-right">
            <p className="contact-eyebrow">24시간 전화상담</p>
            <p className="contact-phone">070-4141-6402</p>
            <a href="tel:07041416402" className="btn btn-xl btn-round" style={{ backgroundColor: '#2BC2BD', color: '#fff' }}>
              모바일 전화 상담
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer" id="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <ul className="footer-links">
              <li><a href="#">이용약관</a></li>
              <li><a href="#">개인정보처리방침</a></li>
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
    </>
  );
}
