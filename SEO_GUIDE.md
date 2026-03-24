# Cloudflare & 네이버 서치어드바이저 SEO 설정 가이드

본 문서는 Cloudflare Pages(무료 플랜) 환경에서 네이버 서치어드바이저를 위한 RSS 및 사이트맵 설정 시 발생하는 흔한 오류와 해결 방법을 정리한 실무 가이드입니다.

---

## 1. 도메인 일치성 (가장 중요)
네이버 서치어드바이저는 등록된 도메인과 RSS/Sitemap 내의 URL을 엄격하게 대조합니다.
*   **원칙**: `www` 포함 여부와 `http/https` 프로토콜이 검색 어드바이저에 등록된 주소와 **100% 일치**해야 합니다.
*   **주의**: `https://mungmin.com`으로 등록했다면 RSS 내의 모든 링크도 `https://mungmin.com/...`이어야 하며, `www`를 혼용하면 "형식이 올바르지 않습니다" 에러가 발생합니다.

## 2. RSS 2.0 규격 준수
네이버가 요구하는 표준 RSS 규격은 다음과 같습니다.

### 날짜 형식 (RFC 822)
*   일반적인 ISO 형식(`2026-03-23`)이나 단순 한국식 날짜를 지원하지 않습니다.
*   **올바른 형식**: `Mon, 23 Mar 2026 15:00:47 +0900`
*   Node.js 예시: `new Date().toUTCString()` 사용 시 마지막 `GMT`를 `+0000` 등으로 대체하거나 포맷터를 구현하여 사용해야 합니다.

### 특수 문자 처리 (CDATA)
본문에 특수 문자(`&`, `<`, `>`)가 포함될 경우 XML 파싱 에러가 발생합니다.
*   **해결**: `title`, `description`, `author`, `category` 태그 내부의 값은 반드시 `<![CDATA[ ... ]]>`로 감싸주세요.

### 본문 내용 (Description)
*   단순 요약보다는 **본문 전체 복사**를 권장합니다.
*   내용이 너무 짧으면 수집 품질 저하로 등록이 거절될 수 있습니다.

## 3. Cloudflare Pages 라우팅 설정 (`_routes.json`)
Next.js(next-on-pages)를 사용할 경우, 모든 요청이 워커(Worker)로 전달되어 정적 파일이 무시될 수 있습니다.
*   **해결**: `.vercel/output/static/_routes.json` 파일의 `exclude` 항목에 정적 파일들을 명시해야 합니다.
```json
"exclude": ["/_next/static/*", "/sitemap.xml", "/robots.txt", "/rss.xml", "/naver*.html"]
```

## 4. 윈도우 환경 배포 시 주의사항 (File Lock)
윈도우 터미널에서 `wrangler`로 수동 배포 시 `.vercel/output/static` 폴더 내의 파일이 다른 프로세스(node, npx 등)에 의해 점유되어 복사 에러가 날 수 있습니다.
*   **해결**: 별도의 임시 배포 폴더(예: `.deploy_temp`)를 생성하여 필요한 정적 파일들을 모두 집어넣은 뒤 그 폴더를 배포하세요.
```powershell
mkdir .deploy_temp
cp -r .vercel/output/static/* .deploy_temp/
cp public/rss.xml .deploy_temp/rss.xml
cp public/sitemap.xml .deploy_temp/sitemap.xml
npx wrangler pages deploy .deploy_temp
```

## 5. 자동화 vs 수동화 전략
*   **자동화**: `app/rss.xml/route.js`를 통해 동적으로 생성하는 것이 가장 좋으나, 윈도우 로컬 빌드 환경이 불안정할 경우 에러가 잦을 수 있습니다.
*   **수동화 (추천)**: `scripts/generate-rss.js` 같은 독립적인 스크립트로 `public` 폴더에 정적 XML을 생성하고, 배포 시점에 복사하여 올리는 방식이 훨씬 안정적입니다.
