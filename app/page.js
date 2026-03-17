'use client';

import Link from 'next/link';
import '@/styles/intro.css';

export default function IntroPage() {
  return (
    <div className="intro">
      {/* ── Left Panel: 브랜드 소개 ── */}
      <div className="intro-panel intro-panel--left">
        <Link href="/main" className="btn btn-2xl btn-round intro-btn">
          <span className="btn-text-medium">멍냥의민족</span>
          <span className="btn-text-extrabold">브랜드</span>
          <span>→</span>
        </Link>

        {/* 배경 이미지 */}
        <img
          className="intro-panel-bg"
          src="/assets/images/intro/mungnyang-minjok-brand-puppy-photozone.webp"
          alt="멍냥의민족 브랜드 소개 - 반려동물 포토존"
        />
      </div>

      {/* ── Right Panel: 창업 안내 ── */}
      <div className="intro-panel intro-panel--right">
        <Link href="/main#trend-market-header" className="btn btn-2xl btn-round intro-btn">
          <span className="btn-text-medium">멍냥의민족</span>
          <span className="btn-text-extrabold">창업</span>
          <span>→</span>
        </Link>

        {/* 배경 이미지 */}
        <img
          className="intro-panel-bg"
          src="/assets/images/intro/mungnyang-minjok-franchise-pet-shop.webp"
          alt="멍냥의민족 창업 안내 - 반려동물 용품 매장"
        />
      </div>
    </div>
  );
}

