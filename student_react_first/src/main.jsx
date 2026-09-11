/* ---------------------------------------------------------
   main.jsx — React 앱을 화면에 붙이는 곳
   4부에서는 index.html 이 화면 전체를 갖고 있었고,
   main.js 가 그 요소들을 찾아 이벤트를 걸었습니다.

   5부에서는 index.html 에 root 라는 빈 div 하나만 있고,
   그 자리에 App 컴포넌트를 그려 넣습니다.
   --------------------------------------------------------- */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

// StrictMode 는 개발 중에만 동작하며 실수하기 쉬운 코드를 찾아 준다.
// 그래서 개발 중에는 일부 코드가 두 번 실행되는 것처럼 보인다.
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
