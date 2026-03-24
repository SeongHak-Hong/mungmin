# Notion DB 연동 및 사이트 최적화 가이드

본 문서는 클라우드플레어(Cloudflare) 환경에서 노션 DB를 연동하여 웹사이트를 운영할 때 발생할 수 있는 오류를 예방하고, 실시간 데이터를 안정적으로 반영하기 위한 핵심 규칙을 담고 있습니다.

---

## 1. 코드 안정성 (Optional Chaining 필수 적용)

노션 DB의 속성(Property)은 사용자가 언제든지 이름을 바꾸거나 삭제할 수 있습니다. 이를 대비하지 않으면 사이트 전체가 중단될 수 있습니다.

- **규칙**: 모든 노션 속성 접근과 배열 인덱스 접근(`[0]`)에는 반드시 Optional Chaining(`?.`)을 사용하세요.
- **나쁜 예**: `properties['지점명'].title[0].plain_text` (속성이 없으면 에러 발생)
- **좋은 예**: `properties['지점명']?.title?.[0]?.plain_text || '기본값'`

## 2. 실시간 데이터 반영 (캐시 제어)

노션 DB를 수정했는데 웹사이트에 즉시 반영되지 않는다면 Next.js 또는 Cloudflare의 캐시 설정 때문일 가능성이 높습니다.

- **규칙**: 노션 데이터를 사용하는 페이지의 최상단에 다음 설정을 추가하여 실시간성을 보장하세요.
  ```javascript
  export const dynamic = 'force-dynamic';
  export const revalidate = 0;
  ```
- **Fetch 옵션**: 노션 API 호출 시 `cache: 'no-store'` 옵션을 사용하여 서버 사이드 캐싱을 방지하세요.

## 3. 보안 관리 (API Key 및 테스트 스크립트)

API 키 노출은 깃허브 푸쉬 차단 및 보안 사고의 원인이 됩니다.

- **규칙 1**: 모든 API 키와 DB ID는 `.env.local` 파일에 저장하고 절대 깃(Git)에 커밋하지 마세요.
- **규칙 2**: 로컬 테스트를 위해 작성한 임시 스크립트 파일이 `scripts/` 등의 폴더에 포함되지 않도록 주의하세요. 만약 생성했다면 푸쉬 전 반드시 삭제하거나 `.gitignore`에 등록해야 합니다.

## 4. 데이터 타입 유연성 확보

노션의 '숫자' 속성은 가끔 '텍스트'로 변경될 수 있습니다 (예: 위도, 경도).

- **규칙**: 데이터를 읽어올 때 타입을 명시적으로 변환하고 예외 처리를 하세요.
  ```javascript
  let lat = null;
  if (properties['위도']?.rich_text?.[0]) {
    lat = parseFloat(properties['위도'].rich_text[0].plain_text.replace(/[^0-9.]/g, ''));
  } else if (properties['위도']?.number) {
    lat = properties['위도'].number;
  }
  ```

## 5. 레이블(Label) 매핑 점검

사이트 레이아웃이나 기능 수정 시 노션의 속성 이름과 코드의 매핑을 항상 확인하세요.

- **규칙**: 속성 이름(예: `연락처`, `주소`)이 변경되면 `lib/notion.js` 등의 데이터 파싱 로직도 함께 수정해야 합니다.

---
> [!IMPORTANT]
> **실패 없는 작업을 위한 체크리스트**
> 1. 노션 DB 속성 이름이 코드와 일치하는가?
> 2. `?.`를 사용하여 속성 부재 시에도 에러가 발생하지 않는가?
> 3. `force-dynamic` 설정이 되어 있어 수정 사항이 즉시 반영되는가?
> 4. API Key가 포함된 파일이 커밋 대상에 포함되지 않았는가?

---

## 6. 개발 및 배포 환경 (Node.js & Cloudflare)

수동 배포 및 로컬 환경에서 발생하는 404/500 오류를 방지하기 위한 핵심 기술 규칙입니다.

- **Node.js 버전**: 빌드 도구(`next-on-pages`, `wrangler`)는 **Node v20.0.0 이상**을 필수 요구합니다. 
  - `node -v`와 `where node` 명령어로 경로를 확인하고, 시스템 환경 변수(Path)가 올바른지 점검하세요.
- **배포 방식 (Wrangler 사용 필수)**: 클라우드플레어 대시보드의 "드래그 앤 드롭" 업로드는 폴더 형태의 `_worker.js`를 인식하지 못해 404 에러를 유발합니다. 
  - **규칙**: 반드시 터미널에서 `npx wrangler pages deploy .vercel/output/static` 또는 `.vercel/output` 명령어를 사용하여 배포하세요.
- **에지 런타임(Edge Runtime) 제한**: `nodemailer`와 같은 표준 Node.js 라이브러리는 에지 환경에서 작동하지 않아 500 에러를 유발합니다. 
  - **규칙**: 이메일 발송 등 외부 연동이 필요할 경우 Web API 기반의 서비스(Resend 등)를 사용하거나 Cloudflare전용 솔루션을 사용하세요.
- **SDK 안정성 및 REST API**: `@notionhq/client` SDK가 특정 에지 환경에서 메서드를 찾지 못하는 경우가 있습니다. 
  - **권장**: 가장 확실한 방법은 Notion 공식 REST API를 `fetch`로 직접 호출하는 것입니다. (헤더에 `Notion-Version: 2022-06-28` 명시 필수)
