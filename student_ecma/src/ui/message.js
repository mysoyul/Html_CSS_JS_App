/* ===========================================================
   메시지 표시 — 성공 / 실패 / 로딩
   -----------------------------------------------------------
   form11.js 의 showError, showSuccess, clearMessages 를 옮기고
   기본 매개변수를 써서 하나의 showMessage 로 합쳤습니다.

   <script type="module"> 은 기본적으로 defer 로 동작합니다.
   HTML 을 모두 읽은 뒤에 실행되므로, 모듈 맨 위에서 바로
   getElementById 를 해도 null 이 되지 않습니다.
   =========================================================== */

const formError = document.getElementById("formError");
const loadingMessage = document.getElementById("loadingMessage");

/** 메시지 종류별 글자색 */
const COLORS = {
    error: "#dc3545",
    success: "#28a745",
};

/**
 * 폼 아래에 메시지를 표시한다.
 * @param {string} text 표시할 문구
 * @param {"error"|"success"} [type] 메시지 종류 (기본값 "error")
 */
export function showMessage(text, type = "error") {
    formError.textContent = text;
    formError.style.color = COLORS[type] ?? COLORS.error;
    formError.style.display = "block";
}

/** 실패 메시지를 표시한다. @param {string} text */
export const showError = (text) => showMessage(text, "error");

/** 성공 메시지를 표시한다. @param {string} text */
export const showSuccess = (text) => showMessage(text, "success");

/** 표시 중인 메시지를 지운다. */
export function clearMessages() {
    formError.textContent = "";
    formError.style.display = "none";
}

/**
 * "로딩 중..." 표시를 켜고 끈다.
 * @param {boolean} [isLoading] 기본값 true
 */
export function setLoading(isLoading = true) {
    loadingMessage.style.display = isLoading ? "block" : "none";
}
