/* ---------------------------------------------------------
   axios 인스턴스 — 모든 요청이 지나가는 통로
   5부의 request() 함수가 하던 일을 axios 가 대신합니다.

     5부 request()                      axios
     --------------------------------   ------------------------------
     fetch 로 요청                      client.get / post / put / delete
     response.ok 를 직접 확인           실패하면 스스로 오류를 던진다
     response.json() 을 직접 호출       response.data 에 이미 들어 있다
     JSON.stringify(body) 를 직접       객체를 그대로 넘기면 된다
     헤더를 함수마다 적음               여기서 한 번만 적는다

   덕분에 studentApi.js 의 함수들이 두 줄로 줄어듭니다.
   --------------------------------------------------------- */

import axios from "axios";

import { API_BASE_URL } from "../config.js";

// 서버가 message 를 주지 않을 때 대신 쓸 문구 — 5부와 같다.
const DEFAULT_MESSAGES = {
    400: "입력한 값이 올바르지 않습니다.",
    404: "존재하지 않는 학생입니다.",
    409: "이미 등록된 학번입니다.",
    500: "서버에서 오류가 발생했습니다.",
};

/* create 로 "내 설정이 담긴 axios" 를 하나 만들어 둔다.
   baseURL 을 적어 두면 요청할 때는 뒷부분만 적으면 된다.
     client.get("/api/students")
       → http://localhost:8080/api/students */
export const client = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

/* 가로채기(interceptor) — 응답이 돌아오는 길목에 세워 두는 검문소다.
   성공은 그대로 통과시키고, 실패는 우리 메시지로 바꿔서 넘긴다.
   이 다섯 줄 덕분에 화면 쪽 코드는 error.message 만 읽으면 된다. */
client.interceptors.response.use(
    (response) => response,
    (error) => {
        // 서버가 응답을 준 경우에만 status 와 data 가 있다.
        // 서버가 꺼져 있으면 error.response 자체가 없다.
        const status = error.response?.status;

        const message =
            error.response?.data?.message ??
            DEFAULT_MESSAGES[status] ??
            "서버와 통신하지 못했습니다. 서버가 켜져 있는지 확인하세요.";

        // 5부의 throw new Error(message) 와 같은 뜻이다.
        return Promise.reject(new Error(message));
    }
);
