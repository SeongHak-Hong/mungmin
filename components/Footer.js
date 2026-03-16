'use client';

import { useState } from 'react';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '@/lib/policies';

export default function Footer() {
  const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false);
  const [isPrivacyPopupOpen, setIsPrivacyPopupOpen] = useState(false);

  return (
    <>
      <footer className="site-footer" id="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <ul className="footer-links">
              <li>
                <button type="button" className="privacy-link" onClick={() => setIsTermsPopupOpen(true)}>이용약관</button>
              </li>
              <li>
                <button type="button" className="privacy-link" onClick={() => setIsPrivacyPopupOpen(true)}>개인정보처리방침</button>
              </li>
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

      {/* Terms of Service Popup */}
      <div className={`popup-overlay ${isTermsPopupOpen ? 'is-active' : ''}`} onClick={() => setIsTermsPopupOpen(false)}>
        <div className="popup privacy-popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="popup-close" onClick={() => setIsTermsPopupOpen(false)}>✕</div>
          <h3>이용약관</h3>
          <div className="privacy-popup-body" data-lenis-prevent style={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px', fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
            {TERMS_OF_SERVICE.split('\n').map((line, index) => (
              <p key={index}>{line || <br />}</p>
            ))}
          </div>
          <div className="privacy-popup-footer" style={{ marginTop: '24px' }}>
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

      {/* Privacy Policy Popup */}
      <div className={`popup-overlay ${isPrivacyPopupOpen ? 'is-active' : ''}`} onClick={() => setIsPrivacyPopupOpen(false)}>
        <div className="popup privacy-popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="popup-close" onClick={() => setIsPrivacyPopupOpen(false)}>✕</div>
          <h3>개인정보처리방침</h3>
          <div className="privacy-popup-body" data-lenis-prevent style={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px', fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
            {PRIVACY_POLICY.split('\n').map((line, index) => (
              <p key={index}>{line || <br />}</p>
            ))}
          </div>
          <div className="privacy-popup-footer" style={{ marginTop: '24px' }}>
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
    </>
  );
}
