/* ===========================================================
   설정 — 하드코딩된 주소를 한곳으로 모은다
   -----------------------------------------------------------
   form11.js 에서는 파일 맨 위에 이렇게 적혀 있었습니다.

       const API_BASE_URL = "http://localhost:8080";

   주소가 코드에 박혀 있으면 개발용과 운영용을 바꿀 때마다
   소스를 고쳐야 합니다. Vite 는 .env 파일에 적은 값을
   import.meta.env 로 넘겨주므로 코드를 고치지 않아도 됩니다.
   =========================================================== */

/** 서버 주소. .env 파일이 없을 때를 대비해 ?. 와 ?? 로 기본값을 둔다. */
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8080";

/** 학생 API 의 기본 경로 */
export const STUDENTS_URL = `${API_BASE_URL}/api/students`;

/** JSON 을 보낼 때 항상 붙여야 하는 헤더 */
export const JSON_HEADERS = {
    "Content-Type": "application/json",
};
