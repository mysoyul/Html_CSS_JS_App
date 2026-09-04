/* ===========================================================
   폼 다루기 — 값 모으기 / 채우기 / 모드 전환
   -----------------------------------------------------------
   form11.js 에서 폼과 관련된 코드는 세 군데에 흩어져 있었습니다.
   여기서는 한 모듈로 모으고, ECMAScript 문법으로 짧게 다듬었습니다.

     - Object.fromEntries + 구조 분해로 입력값 수집
     - ?. 와 ?? 로 detail 이 없을 때 방어
     - 기본 매개변수로 모드 전환 함수 단순화
   =========================================================== */

/** 폼 요소. main.js 에서 submit 이벤트를 걸기 위해 밖으로 내보낸다. */
export const studentForm = document.getElementById("studentForm");

/** 취소 버튼. main.js 에서 click 이벤트를 건다. */
export const cancelButton = document.getElementById("cancelButton");

const submitButton = studentForm.querySelector('button[type="submit"]');
const formContainer = studentForm.closest(".form-container");

/**
 * 폼에 입력된 값을 서버가 받는 구조로 모은다.
 * @returns {object} { name, studentNumber, detailRequest: { ... } }
 */
export function collectStudentData() {
    // FormData 를 한 번에 객체로 바꾼 뒤, 필요한 값만 구조 분해로 꺼낸다.
    const { name, studentNumber, address, phoneNumber, email, dateOfBirth } =
        Object.fromEntries(new FormData(studentForm).entries());

    return {
        name: name.trim(),
        studentNumber: studentNumber.trim(),
        detailRequest: {
            address: address.trim(),
            phoneNumber: phoneNumber.trim(),
            // 빈 문자열("")도 걸러야 하므로 여기서는 ?? 가 아니라 || 를 쓴다.
            email: email.trim() || null,
            dateOfBirth: dateOfBirth || null,
        },
    };
}

/**
 * 서버에서 받은 학생 정보로 폼을 채운다.
 * @param {object} student 서버 응답 (detail 이 없을 수도 있다)
 */
export function fillForm(student) {
    const { name, studentNumber, detail } = student;

    studentForm.name.value = name;
    studentForm.studentNumber.value = studentNumber;

    // detail 이 없으면 ?. 가 undefined 를 돌려주고, ?? 가 빈 문자열로 바꿔 준다.
    studentForm.address.value = detail?.address ?? "";
    studentForm.phoneNumber.value = detail?.phoneNumber ?? "";
    studentForm.email.value = detail?.email ?? "";
    studentForm.dateOfBirth.value = detail?.dateOfBirth ?? "";
}

/**
 * 등록 모드와 수정 모드를 전환한다.
 * @param {boolean} [isEditing] 기본값 false (등록 모드)
 */
export function setEditMode(isEditing = false) {
    submitButton.textContent = isEditing ? "학생 수정" : "학생 등록";
    cancelButton.style.display = isEditing ? "inline-block" : "none";
    formContainer.classList.toggle("editing", isEditing);
}

/** 폼을 비우고 등록 모드로 되돌린다. */
export function resetForm() {
    studentForm.reset();
    setEditMode(false);
}

/** 폼이 보이도록 부드럽게 스크롤한다. */
export function scrollToForm() {
    studentForm.scrollIntoView({ behavior: "smooth" });
}
