'use client';

import { usePathname } from 'next/navigation';

export default function ContactButton() {
  const pathname = usePathname();

  // Only show on non-intro pages
  if (pathname === '/') return null;

  return (
    <div className="floating-contact-btn" id="floating-contact-btn">
      <img
        src="/assets/images/common/mungnyang-franchise-inquiry-contact-balloon-button.svg"
        alt="멍냥의민족 창업문의 캐릭터"
        className="contact-btn-character"
      />
      <a href="tel:070-4141-6402" className="contact-btn-text-balloon">
        <span className="contact-btn-label">창업문의</span>
        <span className="contact-btn-number">070-4141<br />-6402</span>
      </a>
    </div>
  );
}
