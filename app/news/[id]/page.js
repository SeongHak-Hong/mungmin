import Link from 'next/link';
import Header from '@/components/Header';

export const runtime = 'edge';
import ContactButton from '@/components/ContactButton';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import { getNews } from '@/lib/notion';
import '@/styles/main.css';
import '@/styles/news.css';

export default async function NewsDetailPage({ params }) {
  const { id } = await params;
  const news = await getNews();
  const post = news.find(p => p.id === id);

  if (!post) {
    return (
      <div className="news-page-container">
        <Header />
        <main className="news-main section" style={{ textAlign: 'center' }}>
          <div className="contents-wrapper contents-wrapper--column">
            <h1>게시물을 찾을 수 없습니다.</h1>
            <Link href="/news" className="btn btn-primary btn-round btn-m" style={{ marginTop: '32px', display: 'inline-flex' }}>
              소식 목록으로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="news-page-container">
      <Header />
      
      <main className="news-main section">
        <div className="contents-wrapper contents-wrapper--column">
          <article className="news-detail-container">
            <header className="news-detail-header">
              <div className="news-detail-category">{post.category}</div>
              <h1 className="news-detail-title">{post.title}</h1>
              <div className="news-detail-date">{post.date}</div>
            </header>

            <div className="news-detail-thumb">
              {post.isNotice ? (
                <div className="news-thumb-wrapper is-notice">
                   <div className="notice-overlay-content">
                      <img src="/assets/images/common/mungnyang-official-brand-logo.svg" alt="Logo" className="notice-logo" style={{ filter: 'brightness(0) invert(1)' }} />
                      <div className="notice-text">{post.category}</div>
                    </div>
                </div>
              ) : post.videoUrl ? (
                <div className="news-video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', backgroundColor: '#000' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${post.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1]}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  ></iframe>
                </div>
              ) : post.images && post.images.length > 0 ? (
                post.images.map((imgUrl, idx) => (
                  <img key={idx} src={imgUrl} alt={`${post.title}-${idx}`} style={{ width: '100%', marginBottom: '24px', borderRadius: '16px' }} />
                ))
              ) : (
                <img src={post.thumbnail} alt={post.title} style={{ width: '100%', borderRadius: '16px' }} />
              )}
            </div>

            <div className="news-detail-content">
              {post.content}
            </div>

            <footer className="news-detail-footer">
              <Link href="/news" className="btn-back-to-list btn btn-primary btn-round btn-m">
                목록으로
              </Link>
            </footer>
          </article>
        </div>
      </main>

      <ContactSection />
      <Footer />
      <ContactButton />
    </div>
  );
}
