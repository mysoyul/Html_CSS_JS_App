/* ===========================================================
   [실습 4-9]  메시지 모듈
   -----------------------------------------------------------
   놓을 위치 : student_ecma/src/ui/message.js
   교재      : 05_ECMAScript_실습_단계별.docx
   =========================================================== */

const formError = document.getElementById("formError");
const loadingMessage = document.getElementById("loadingMessage");

const COLORS = { error: "#dc3545", success: "#28a745" };

/** @param {"error"|"success"} [type] 기본값 "error" */
export function showMessage(text, type = "error") {
    formError.textContent = text;
    formError.style.color = COLORS[type] ?? COLORS.error;
    formError.style.display = "block";
}

export const showError = (text) => showMessage(text, "error");
export const showSuccess = (text) => showMessage(text, "success");

export function clearMessages() {
    formError.textContent = "";
    formError.style.display = "none";
}

/** @param {boolean} [isLoading] 기본값 true */
export function setLoading(isLoading = true) {
    loadingMessage.style.display = isLoading ? "block" : "none";
}
