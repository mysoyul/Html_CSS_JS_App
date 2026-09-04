/* ===========================================================
   학생 API — 서버와 대화하는 부분만 모아 둔 모듈
   -----------------------------------------------------------
   form11.js 에서는 loadStudents, createStudent, deleteStudent ...
   가 모두 한 파일에 있었고, 각 함수마다 fetch → then → then → catch
   가 반복됐습니다. 여기서는

     (1) 반복되는 부분을 request() 하나로 모으고
     (2) then 체인을 async / await 으로 바꾸고
     (3) 화면을 건드리는 코드(alert, innerHTML)를 전부 걷어냈습니다.

   이 파일은 "값을 돌려주거나 오류를 던지는" 일만 합니다.
   화면에 무엇을 보여줄지는 main.js 가 결정합니다.
   =========================================================== */

import { STUDENTS_URL, JSON_HEADERS } from "../config.js";

/** 상태 코드별 기본 메시지. 서버가 message 를 주지 않을 때 쓴다. */
const DEFAULT_MESSAGES = {
    400: "입력한 값이 올바르지 않습니다.",
    404: "존재하지 않는 학생입니다.",
    409: "이미 등록된 학번입니다.",
    500: "서버에서 오류가 발생했습니다.",
};

/**
 * fetch 를 감싼 공통 요청 함수.
 * @param {string} url 요청 주소
 * @param {object} [options] fetch 옵션 (기본값 {} — 인자를 생략해도 오류가 나지 않는다)
 * @returns {Promise<any|null>} 응답 본문. 본문이 없으면(204) null
 * @throws {Error} 응답이 실패(ok === false)면 서버 메시지를 담아 던진다
 */
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        // 서버가 JSON 이 아닌 오류 페이지를 줄 수도 있으므로 방어한다.
        const errorData = await response.json().catch(() => ({}));

        const message =
            errorData.message ??
            DEFAULT_MESSAGES[response.status] ??
            `요청에 실패했습니다. (${response.status})`;

        throw new Error(message);
    }

    // 204 No Content — 삭제 성공처럼 돌려줄 본문이 없는 경우.
    // 여기서 response.json() 을 부르면 "Unexpected end of JSON input" 이 난다.
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

/** 학생 목록을 가져온다. @returns {Promise<object[]>} */
export const fetchStudents = () => request(STUDENTS_URL);

/** 학생 한 명을 가져온다. @param {number} id @returns {Promise<object>} */
export const fetchStudent = (id) => request(`${STUDENTS_URL}/${id}`);

/** 학생을 새로 등록한다. @param {object} student @returns {Promise<object>} */
export const createStudent = (student) =>
    request(STUDENTS_URL, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(student),
    });

/** 학생 정보를 수정한다. @param {number} id @param {object} student @returns {Promise<object>} */
export const updateStudent = (id, student) =>
    request(`${STUDENTS_URL}/${id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(student),
    });

/** 학생을 삭제한다. @param {number} id @returns {Promise<null>} */
export const deleteStudent = (id) =>
    request(`${STUDENTS_URL}/${id}`, {
        method: "DELETE",
    });
