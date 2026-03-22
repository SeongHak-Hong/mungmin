'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="error-page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
        <div className="error-content" style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--primary-color, #1F1F1F)' }}>죄송합니다. 오류가 발생했습니다.</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '32px', color: 'var(--text-secondary, #666)' }}>
            페이지를 불러오는 중 문제가 발생했습니다. 일시적인 현상일 수 있으니 잠시 후 다시 시도해 주세요.
          </p>
          
          <div className="debug-info" style={{ 
            textAlign: 'left', 
            background: '#f8f8f8', 
            padding: '20px', 
            borderRadius: '12px', 
            marginBottom: '32px',
            fontSize: '0.9rem',
            overflowX: 'auto'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>디버그 정보:</p>
            <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {error?.message || '알 수 없는 오류'}
            </code>
            {error?.digest && (
              <p style={{ marginTop: '8px', opacity: 0.7 }}>Error ID: {error.digest}</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              className="btn btn-primary btn-round btn-m"
              onClick={() => reset()}
            >
              다시 시도하기
            </button>
            <a href="/" className="btn btn-secondary btn-round btn-m">
              홈으로 가기
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
