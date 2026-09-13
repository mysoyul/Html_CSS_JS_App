/* ---------------------------------------------------------
   설정 — 서버 주소를 한곳으로 모은다
   5부(student_react_first)와 달라진 점이 하나 있습니다.

   5부에서는 주소 전체를 만들어 두었습니다.
       STUDENTS_URL = "http://localhost:8080/api/students"

   6부에서는 axios 가 앞부분(baseURL)을 기억하므로,
   여기서는 뒷부분 경로만 적어 둡니다.
       API_BASE_URL   axios 에게 한 번만 알려 준다
       STUDENTS_PATH  요청할 때마다 쓰는 뒷부분
   --------------------------------------------------------- */

// import.meta.env 는 Vite 가 .env 파일의 값을 넣어 주는 자리다.
//   ?.  왼쪽이 없으면(undefined) 멈추고 undefined 를 돌려준다.
//   ??  왼쪽이 null 이나 undefined 일 때만 오른쪽 값을 쓴다.
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8080";

// 학생 API 의 경로. axios 가 baseURL 뒤에 이어 붙인다.
export const STUDENTS_PATH = "/api/students";
