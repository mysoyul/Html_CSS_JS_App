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

/** 성공 메시지가 저절로 사라지기까지의 시간(ms) */
const MESSAGE_TIMEOUT = 3000;

/** 자동 초기화 예약. 새 메시지가 오면 이전 예약을 취소한다. */
let messageTimer = null;

/**
 * 폼 아래에 메시지를 표시한다.
 * @param {string} text 표시할 문구
 * @param {"error"|"success"} [type] 메시지 종류 (기본값 "error")
 * @param {number} [timeout] 자동으로 지우기까지의 ms. 0 이면 지우지 않는다(기본값)
 */
export function showMessage(text, type = "error", timeout = 0) {
    clearTimeout(messageTimer);          // 앞선 예약을 취소한다

    formError.textContent = text;
    formError.style.color = COLORS[type] ?? COLORS.error;
    formError.style.display = "block";

    // 오류는 사용자가 고칠 때까지 남겨 두고, 성공만 시간이 지나면 지운다.
    if (timeout > 0) {
        messageTimer = setTimeout(clearMessages, timeout);
    }
}

/** 실패 메시지를 표시한다. 화면에 그대로 남는다. @param {string} text */
export const showError = (text) => showMessage(text, "error");

/** 성공 메시지를 표시한다. MESSAGE_TIMEOUT 뒤에 저절로 사라진다. @param {string} text */
export const showSuccess = (text) => showMessage(text, "success", MESSAGE_TIMEOUT);

/** 표시 중인 메시지를 지운다. 예약된 자동 초기화도 함께 취소한다. */
export function clearMessages() {
    clearTimeout(messageTimer);
    messageTimer = null;

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
