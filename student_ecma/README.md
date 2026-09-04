# student_ecma — 학생 관리 시스템 (ECMAScript + Vite)

`student/student-client-step11.html` + `js/form11.js` + `css/form10.css` 로 만든
학생 관리 시스템을, **ES6+ 문법과 모듈로 다시 작성**하고 **Vite** 위에 올린 버전입니다.

기능은 step11 과 완전히 같습니다. 달라진 것은 코드를 쓰는 방식뿐입니다.

## 실행

```bash
npm install       # 처음 한 번
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # 배포용 빌드 → dist/
npm run preview   # 빌드 결과 확인
```

서버(Spring Boot)가 `http://localhost:8080` 에서 실행 중이어야 합니다.
주소는 `.env.development` 의 `VITE_API_BASE_URL` 로 바꿀 수 있습니다.

## 폴더 구조

```
student_ecma/
├─ index.html                 화면 마크업 (step11 과 거의 동일)
├─ .env.development           개발용 서버 주소
├─ .env.production            배포용 서버 주소
└─ src/
   ├─ main.js                 앱 조립 — 이벤트 연결과 초기 로드
   ├─ style.css               form10.css 이식
   ├─ config.js               API 주소 (import.meta.env)
   ├─ api/
   │  └─ studentApi.js        서버 통신 (async/await, CRUD 5개)
   ├─ lib/
   │  └─ validation.js        유효성 검사 (순수 함수)
   └─ ui/
      ├─ message.js           성공·실패·로딩 표시
      ├─ studentForm.js       폼 값 수집·채우기·모드 전환
      └─ studentTable.js      목록 표 그리기
```

## form11.js 와 무엇이 달라졌나

| 주제 | form11.js (3부) | student_ecma (ECMAScript) |
|---|---|---|
| 파일 구성 | 1개 파일 400여 줄 | 역할별 7개 모듈 |
| 서버 주소 | 코드에 하드코딩 | `.env` + `import.meta.env` |
| 비동기 | `fetch().then().then().catch()` | `async / await` + `try / catch` |
| 오류 처리 | 함수마다 반복 | `request()` 하나로 통합 |
| 폼 값 수집 | `formData.get()` 6번 | `Object.fromEntries` + 구조 분해 |
| 없는 값 방어 | `student.detail ? ... : "-"` | `detail?.address ?? "-"` |
| 표의 버튼 | `onclick="editStudent(3)"` | `data-action` + 이벤트 위임 |
| 값 출력 | `innerHTML` 에 문자열 조합 | `textContent` (태그가 실행되지 않음) |
| 검사 결과 | 함수 안에서 `alert()` | 메시지를 돌려주고 호출한 쪽이 표시 |
| 취소 버튼 | 선언만 하고 미사용 | 수정 모드에서 표시·동작 |
| 로딩 표시 | 선언만 하고 미사용 | 목록 로드 중 표시 |

## 단계별 설명 문서

`docs/05_ECMAScript_실습_단계별.docx` 에 이 프로젝트를 처음부터 만드는 과정이
`[실습 4-1] ~ [실습 4-10]` 으로 정리되어 있습니다.

## 참고

`src/counter.js`, `src/assets/*`, `public/icons.svg` 는 Vite 스캐폴드가 만든
데모 파일이며 이 앱은 사용하지 않습니다. 지워도 동작에 문제가 없습니다.
