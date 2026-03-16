'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ContactButton from '@/components/ContactButton';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import SmoothScroll from '@/components/SmoothScroll';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '@/lib/policies';
import '@/styles/main.css';
import '@/styles/contact.css';

export default function ContactPage() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isAnyPopupOpen = isPrivacyPopupOpen || isTermsPopupOpen || isFooterPrivacyPopupOpen || isPopupOpen;
    const lenis = window.lenis;
    if (isAnyPopupOpen) {
      document.documentElement.classList.add('no-scroll');
      document.body.classList.add('no-scroll');
      if (lenis) lenis.stop();
    } else {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      if (lenis) lenis.start();
    }
    return () => {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      if (lenis) lenis.start();
    };
  }, [isPrivacyPopupOpen, isTermsPopupOpen, isFooterPrivacyPopupOpen, isPopupOpen]);

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

    if (!name || !phone || !email || !location || !detailLocation || !content || !privacy) {
      setIsPopupOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        throw new Error('Failed to send inquiry');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SmoothScroll />
      <Header />

      <main className="contact-page-container">
        {/* Inquiry Section */}
        <section className="section inquiry-wrapper">
          <div className="contents-wrapper contents-wrapper--column">
            <div className="section-header-group inquiry-header">
              <div className="section-header">
                <p className="eyebrow">문의하기</p>
                <h1 className="h2">창업의 궁금증을<br />해결해 드립니다.</h1>
              </div>
              <p className="body-m">365일 24시간.<br />문의사항을 언제든 남겨주세요.</p>
            </div>

            <div className="inquiry-form-container">
              <form className="inquiry-form" onSubmit={handleSubmit}>
                <div className="inquiry-form-grid">
                  <div className="inquiry-field">
                    <label className="inquiry-label">성함</label>
                    <input
                      type="text"
                      name="name"
                      className="inquiry-input"
                      placeholder="성함을 입력해주세요."
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="inquiry-field">
                    <label className="inquiry-label">연락처</label>
                    <input
                      type="text"
                      name="phone"
                      className="inquiry-input"
                      placeholder="연락처를 입력해주세요."
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="inquiry-field">
                    <label className="inquiry-label">이메일</label>
                    <input
                      type="email"
                      name="email"
                      className="inquiry-input"
                      placeholder="이메일을 입력해주세요."
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="inquiry-field">
                    <label className="inquiry-label">창업 희망지역</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        name="location"
                        className="inquiry-input"
                        placeholder="주소"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        name="detailLocation"
                        className="inquiry-input"
                        placeholder="상세주소"
                        value={formData.detailLocation}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="inquiry-field inquiry-field--full">
                    <label className="inquiry-label">내용</label>
                    <textarea
                      name="content"
                      className="inquiry-textarea"
                      placeholder="궁금하신 점을 적어주세요."
                      value={formData.content}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>

                <label className="inquiry-privacy">
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

                <div className="inquiry-submit-row">
                  <button type="submit" className="inquiry-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? '전송 중...' : '문의하기'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section className="section section-faq" id="faq" style={{ paddingTop: '0' }}>
          <div className="contents-wrapper contents-wrapper--column">
            <div className="section-header" style={{ textAlign: 'left', width: '100%' }}>
              <p className="eyebrow">FAQ</p>
              <h2 className="h2" style={{ marginBottom: '48px' }}>자주 묻는 질문</h2>
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

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />
      <ContactButton />

      {/* Popups (Copied from MainPage for consistency) */}
      <div className={`popup-overlay ${isPopupOpen ? 'is-active' : ''}`}>
        <div className="popup">
          <div className="popup-header" style={{ textAlign: 'center' }}>
            <p className="popup-eyebrow">알림</p>
            <h3 className="popup-title">빈 항목이 있어요.<br />필수항목을 입력해주세요.</h3>
          </div>
          <div className="popup-img-wrapper">
            <img src="/assets/images/common/mungnyang-mascot-character-bichon.svg" alt="Mungnyang Mascot" style={{ width: '200px', height: '200px' }} />
          </div>
          <button type="button" className="popup-btn btn-primary" onClick={() => setIsPopupOpen(false)}>확인</button>
        </div>
      </div>

      {/* Privacy Policy Popup */}
      <div className={`popup-overlay ${isPrivacyPopupOpen ? 'is-active' : ''}`} onClick={() => setIsPrivacyPopupOpen(false)}>
        <div className="popup privacy-popup-content" onClick={(e) => e.stopPropagation()}>
          <h3>개인정보 수집 및 이용</h3>
          <div className="privacy-popup-body" data-lenis-prevent>
            {PRIVACY_POLICY.split('\n').map((line, index) => (
              <p key={index}>{line || <br />}</p>
            ))}
          </div>
          <div className="privacy-popup-footer">
            <button type="button" className="btn btn-m btn-primary btn-round" onClick={() => setIsPrivacyPopupOpen(false)} style={{ width: '100%' }}>확인</button>
          </div>
        </div>
      </div>

      {/* Terms of Service Popup */}
      <div className={`popup-overlay ${isTermsPopupOpen ? 'is-active' : ''}`} onClick={() => setIsTermsPopupOpen(false)}>
        <div className="popup privacy-popup-content" onClick={(e) => e.stopPropagation()}>
          <h3>이용약관</h3>
          <div className="privacy-popup-body" data-lenis-prevent>
            {TERMS_OF_SERVICE.split('\n').map((line, index) => <p key={index}>{line || <br />}</p>)}
          </div>
          <div className="privacy-popup-footer">
            <button type="button" className="btn btn-m btn-primary btn-round" onClick={() => setIsTermsPopupOpen(false)} style={{ width: '100%' }}>확인</button>
          </div>
        </div>
      </div>

      {/* Footer Privacy Policy Popup */}
      <div className={`popup-overlay ${isFooterPrivacyPopupOpen ? 'is-active' : ''}`} onClick={() => setIsFooterPrivacyPopupOpen(false)}>
        <div className="popup privacy-popup-content" onClick={(e) => e.stopPropagation()}>
          <h3>개인정보처리방침</h3>
          <div className="privacy-popup-body" data-lenis-prevent>
            {PRIVACY_POLICY.split('\n').map((line, index) => <p key={index}>{line || <br />}</p>)}
          </div>
          <div className="privacy-popup-footer">
            <button type="button" className="btn btn-m btn-primary btn-round" onClick={() => setIsFooterPrivacyPopupOpen(false)} style={{ width: '100%' }}>확인</button>
          </div>
        </div>
      </div>
    </>
  );
}
