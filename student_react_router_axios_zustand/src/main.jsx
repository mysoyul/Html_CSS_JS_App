/* ---------------------------------------------------------
   main.jsx — React 앱을 화면에 붙이는 곳
   5부와 달라진 것은 BrowserRouter 한 겹이 늘어난 것입니다.

   BrowserRouter 는 "지금 주소가 무엇인가" 를 지켜보다가
   그 안의 컴포넌트들에게 알려 주는 역할을 합니다.
   이것이 없으면 useParams 나 Link 가 동작하지 않습니다.
   --------------------------------------------------------- */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

// StrictMode 는 개발 중에만 동작하며 실수하기 쉬운 코드를 찾아 준다.
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
