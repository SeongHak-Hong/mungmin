'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import '@/styles/intro.css';
import IntroMascot from '@/components/IntroMascot';

export default function IntroPage() {
  return (
    <div className="intro">
      {/* ── Left Panel: 브랜드 소개 ── */}
      <div className="intro-panel intro-panel--left">
        <h2 className="intro-title">
          무료 스튜디오에서 사진 찍고,<br />
          앱으로 10% 영구 적립 받으세요!
        </h2>
        <Link href="/main" className="btn btn-l btn-round intro-btn">
          멍냥의민족 브랜드 소개
        </Link>

        {/* 배경 이미지 */}
        <img
          className="intro-panel-bg"
          src="/assets/images/intro/mungnyang-free-pet-studio-app-reward-background.webp"
          alt="멍냥의민족 무료 반려동물 스튜디오와 앱 10% 영구 적립 혜택"
        />
      </div>

      {/* ── Right Panel: 창업 안내 ── */}
      <div className="intro-panel intro-panel--right">
        <h2 className="intro-title">
          로열티 0원, 온라인 추가 수익까지<br />
          가져가는 국내 최초 O2O 플랫폼
        </h2>
        <Link href="#" className="btn btn-l btn-round intro-btn">
          멍냥의민족 창업 안내
        </Link>

        {/* 배경 이미지 */}
        <img
          className="intro-panel-bg"
          src="/assets/images/intro/mungnyang-o2o-pet-franchise-no-royalty-platform.webp"
          alt="국내 최초 O2O 반려동물 용품 플랫폼 멍냥의민족 가맹점 창업 안내"
        />
      </div>

      {/* ── Center Mascot ── */}
      <IntroMascot />

      {/* ── Center Logo Overlay ── */}
      <div className="intro-logo-overlay">
        <img
          src="/assets/images/common/mungnyang-official-brand-logo.svg"
          alt="멍냥의민족 공식 브랜드 로고 (국내 최초 O2O 반려동물 플랫폼)"
        />
      </div>
    </div>
  );
}
