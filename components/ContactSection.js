'use client';

export default function ContactSection() {
  return (
    <section className="section section-contact" id="contact">
      <div className="contents-wrapper">
        <div className="contact-header-row">
          <div className="contact-left">
            <h2 className="h2" style={{ marginTop: '16px' }}>
              <span style={{ color: '#2BC2BD' }}>멍냥의민족</span><br />
              창업에 대한 궁금증을<br />
              모두 해결해 드립니다.
            </h2>
          </div>
          <div className="contact-right" style={{ textAlign: 'right' }}>
            <p className="contact-eyebrow" style={{ fontSize: '32px', color: '#707272', marginBottom: '16px', fontWeight: 'var(--fw-semibold)' }}>24시간 전화상담</p>
            <p className="contact-phone" style={{ fontSize: '48px', fontWeight: '700' }}>070-4141-6402</p>

            <a href="tel:070-4141-6402" className="btn btn-primary btn-round mobile-only" style={{ padding: '16px 32px', fontSize: '20px', marginTop: '24px' }}>모바일 전화 상담</a>
          </div>
        </div>
      </div>
    </section>
  );
}
