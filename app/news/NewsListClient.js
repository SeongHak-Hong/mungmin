'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ContactButton from '@/components/ContactButton';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';

export default function NewsListClient({ initialNews }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = initialNews.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(initialNews.length / postsPerPage);
  const displayTotalPages = Math.max(1, totalPages);

  return (
    <div className="news-page-container">
      <Header />

      <main className="news-main section">
        <div className="contents-wrapper contents-wrapper--column">
          <div className="section-header">
            <p className="eyebrow">소식</p>
            <h1 className="h2">멍냥의민족 소식</h1>
          </div>

          {/* News Grid */}
          <div className="news-grid">
            {currentPosts.map((post) => (
              <Link href={`/news/${post.id}`} key={post.id} className={`news-card ${post.isNotice ? 'is-notice' : ''}`}>
                <div className="news-thumb-wrapper">
                  {post.isNotice ? (
                    <div className="notice-overlay-content">
                      <img src="/assets/images/common/mungnyang-official-brand-logo.svg" alt="Logo" className="notice-logo" style={{ filter: 'brightness(0) invert(1)' }} />
                      <div className="notice-text">{post.category}</div>
                    </div>
                  ) : (
                    <img src={post.thumbnail} alt={post.title} />
                  )}
                </div>
                <div className="news-info">
                  <span className="news-category">{post.category}</span>
                  <h3 className="news-title">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="news-pagination">
            <button
              className="page-nav-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <img src="/assets/images/common/icon/chevron_left_20dp_1F1F1F_FILL0_wght300_GRAD-25_opsz20.svg" alt="이전" />
            </button>
            {(() => {
              const maxButtons = 5;
              const groupIndex = Math.floor((currentPage - 1) / maxButtons);
              const startPage = groupIndex * maxButtons + 1;
              const endPage = Math.min(startPage + maxButtons - 1, displayTotalPages);

              const pages = [];
              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }

              return pages.map(number => (
                <button
                  key={number}
                  className={`page-num-btn ${currentPage === number ? 'active' : ''}`}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              ));
            })()}
            <button
              className="page-nav-btn"
              onClick={() => setCurrentPage(prev => Math.min(displayTotalPages, prev + 1))}
              disabled={currentPage === displayTotalPages}
            >
              <img src="/assets/images/common/icon/chevron_right_20dp_1F1F1F_FILL0_wght300_GRAD-25_opsz20.svg" alt="다음" />
            </button>
          </div>
        </div>
      </main>

      <ContactSection />
      <Footer />
      <ContactButton />
    </div>
  );
}
