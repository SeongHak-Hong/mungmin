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
// Naver Map Component
export default function StoreMapClient({ initialStores }) {
  const [stores, setStores] = useState(initialStores);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('update'); // update, distance
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStore, setSelectedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const storesPerPage = 5;

  // Haversine formula to calculate distance between two points in km
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  // Get user location when distance sort is selected
  const handleSortChange = (e) => {
    const newOrder = e.target.value;
    setSortOrder(newOrder);
    setCurrentPage(1);

    if (newOrder === 'distance' && !userLocation) {
      setIsLocating(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setIsLocating(false);
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("위치 정보를 가져올 수 없습니다. 권한 설정을 확인해주세요.");
            setSortOrder('update');
            setIsLocating(false);
          }
        );
      } else {
        alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
        setSortOrder('update');
        setIsLocating(false);
      }
    }
  };

  // Filter and sort stores
  const filteredStores = stores
    .filter(store => 
      store.name.includes(searchTerm) || store.address.includes(searchTerm)
    )
    .map(store => {
      if (userLocation && store.lat && store.lng) {
        const distance = getDistance(
          userLocation.lat,
          userLocation.lng,
          parseFloat(store.lat),
          parseFloat(store.lng)
        );
        return { ...store, distance };
      }
      return store;
    });

  if (sortOrder === 'distance' && userLocation) {
    filteredStores.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
  } else if (sortOrder === 'update') {
    // Default Notion sort or update date if available
    // For now assuming initialStores is already sorted by update
  }

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
            <div className="naver-map-wrapper">
              <StoreMap stores={currentStores} selectedStore={selectedStore} />
            </div>

          {/* STORE LIST OVERLAY */}
          <div className="store-overlay">
            <div className="store-search-box">
              <input 
                type="text" 
                placeholder="멍냥의민족" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="store-search-input"
              />
              <button className="btn btn-primary btn-round btn-m store-search-btn">
                 검색
              </button>
            </div>

            <div className="store-sort-box">
              <select 
                value={sortOrder} 
                onChange={handleSortChange}
                className="store-sort-select"
                disabled={isLocating}
              >
                <option value="update">업데이트순</option>
                <option value="distance">{isLocating ? '위치 찾는 중...' : '거리순'}</option>
              </select>
            </div>

            <div className="store-list">
              {currentStores.length > 0 ? currentStores.map((store) => (
                <div 
                  key={store.id} 
                  className={`store-list-item ${selectedStore?.id === store.id ? 'active' : ''}`}
                  onClick={() => setSelectedStore(store)}
                >
                  <div className="store-item-info">
                    <h3 className="store-item-name">{store.name}</h3>
                    {store.distance !== undefined && (
                      <span className="store-item-distance">
                        {store.distance < 1 
                          ? `${Math.round(store.distance * 1000)}m` 
                          : `${store.distance.toFixed(1)}km`}
                      </span>
                    )}
                  </div>
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
