'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ContactButton from '@/components/ContactButton';
import '@/styles/main.css';
import '@/styles/store.css';

// Client Map Component Placeholder
export default function StoreMapClient({ initialStores }) {
  const [stores, setStores] = useState(initialStores);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('update'); // update, distance
  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 5;

  // Filter and sort stores
  const filteredStores = stores.filter(store => 
    store.name.includes(searchTerm) || store.address.includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);

  return (
    <div className="store-page-container">
      <Header />
      
      <main className="store-main">
        <div className="store-header">
          <p className="eyebrow" style={{ color: '#2BC2BD' }}>매장안내</p>
          <h1 className="h2 store-title">우리동네 멍냥의민족은 어디있지?</h1>
        </div>

        <div className="map-container">
          {/* MAP PLACEHOLDER */}
          <div className="map-placeholder">
            <div className="map-placeholder-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2BC2BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p>네이버 지도가 렌더링될 영역입니다.<br/>(현재 API 키 발급 대기 중)</p>
            </div>
          </div>

          {/* STORE LIST OVERLAY */}
          <div className="store-overlay">
            <div className="store-search-box">
              <input 
                type="text" 
                placeholder="멍냥의민족" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="store-search-input"
              />
              <button className="store-search-btn">
                 검색
              </button>
            </div>

            <div className="store-sort-box">
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="store-sort-select"
              >
                <option value="update">업데이트순</option>
                <option value="distance">거리순 (준비중)</option>
              </select>
            </div>

            <div className="store-list">
              {currentStores.length > 0 ? currentStores.map((store) => (
                <div key={store.id} className="store-list-item">
                  <h3 className="store-item-name">{store.name}</h3>
                  <p className="store-item-address">{store.address}</p>
                </div>
              )) : (
                <div className="store-list-empty">검색 결과가 없습니다.</div>
              )}
            </div>

            {/* Pagination Placeholder UI */}
            {totalPages > 1 && (
              <div className="store-pagination">
                <button 
                  className="page-nav-btn" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1; // Simplified for demo
                  return (
                    <button 
                      key={pageNum} 
                      className={`page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  className="page-nav-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════
           창업문의
           ══════════════════════════════════════════════ */}
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
            <div className="contact-right">
              <p className="contact-eyebrow" style={{ fontSize: '32px', color: '#707272', marginBottom: '16px', fontWeight: 'var(--fw-semibold)' }}>24시간 전화상담</p>
              <p className="contact-phone" style={{ fontSize: '48px', fontWeight: '700' }}>070-4141-6402</p>
              
              <button className="btn btn-primary btn-round" style={{ padding: '16px 32px', fontSize: '20px', marginTop: '24px' }}>모바일 전화 상담</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           FOOTER
           ══════════════════════════════════════════════ */}
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
    </div>
  );
}
