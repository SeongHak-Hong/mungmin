'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ContactButton from '@/components/ContactButton';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import '@/styles/main.css';
import '@/styles/store.css';
import dynamic from 'next/dynamic';

const StoreMap = dynamic(
  () => import('@/components/StoreMap'),
  { ssr: false, loading: () => <div className="map-placeholder"><div className="map-placeholder-content"><p>지도를 불러오는 중입니다...</p></div></div> }
);
// Client Map Component Placeholder
export default function StoreMapClient({ initialStores }) {
  const [stores, setStores] = useState(initialStores);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('update'); // update, distance
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStore, setSelectedStore] = useState(null);
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
      
      <main className="store-main section">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="section-header" style={{ marginBottom: 'var(--contents-gap)' }}>
            <p className="eyebrow">매장안내</p>
            <h1 className="h2">우리동네 멍냥의민족은 어디있지?</h1>
          </div>
        </div>

          <div className="map-container">
            <div className="leaflet-map-wrapper">
              <StoreMap stores={currentStores} selectedStore={selectedStore} />
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
              <button className="btn btn-primary btn-round btn-m store-search-btn">
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
                <div 
                  key={store.id} 
                  className={`store-list-item ${selectedStore?.id === store.id ? 'active' : ''}`}
                  onClick={() => setSelectedStore(store)}
                >
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
                  <img src="/assets/images/common/icon/chevron_left_20dp_1F1F1F_FILL0_wght300_GRAD-25_opsz20.svg" alt="이전" />
                </button>
                {(() => {
                  const maxButtons = 5;
                  const groupIndex = Math.floor((currentPage - 1) / maxButtons);
                  const startPage = groupIndex * maxButtons + 1;
                  const endPage = Math.min(startPage + maxButtons - 1, totalPages);

                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }

                  return pages.map(pageNum => (
                    <button 
                      key={pageNum} 
                      className={`page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ));
                })()}
                <button 
                  className="page-nav-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <img src="/assets/images/common/icon/chevron_right_20dp_1F1F1F_FILL0_wght300_GRAD-25_opsz20.svg" alt="다음" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <ContactSection />
      <Footer />
      <ContactButton />
    </div>
  );
}
