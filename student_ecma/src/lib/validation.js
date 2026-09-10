/* ===========================================================
   유효성 검사 — 화면도 서버도 모르는 순수 함수
   -----------------------------------------------------------
   form12.js 의 validateStudent 는 검사에 실패하면 그 자리에서
   alert() 을 띄우고 false 를 돌려줍니다. 그러면

     - alert 을 다른 방식으로 바꾸려면 이 함수를 고쳐야 하고
     - 테스트하기도 어렵습니다.

   여기서는 "무엇이 잘못됐는지"만 돌려주고,
   그것을 어떻게 보여줄지는 부르는 쪽이 정하게 했습니다.

   검사 규칙은 form12.js 와 같습니다.
     - 학번은 영문 2자 + 숫자 3자 (예: EE002)
     - 전화번호와 이메일은 필수
     - 주소는 검사하지 않는다 (index.html 의 required 가 막는다)
   =========================================================== */

/** 학번: 영문 2자 + 숫자 3자. i 플래그라 대소문자를 가리지 않는다 */
const STUDENT_NUMBER_PATTERN = /^[A-Z]{2}\d{3}$/i;

/** 전화번호: 숫자, 하이픈, 공백만 */
const PHONE_PATTERN = /^[0-9-\s]+$/;

/** 이메일: @ 앞뒤와 점 뒤에 공백 아닌 글자가 있어야 한다 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 이메일 형식이 올바른지 검사한다.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => EMAIL_PATTERN.test(email);

/**
 * 학번 형식이 올바른지 검사한다.
 * 공백이 섞여 들어올 수 있으므로 양끝 공백을 지운 뒤 검사한다.
 * @param {string} studentNumber
 * @returns {boolean}
 */
export const isValidStudentNumber = (studentNumber) =>
    STUDENT_NUMBER_PATTERN.test(studentNumber.trim());

/**
 * 학생 데이터를 검사해 첫 번째 오류 메시지를 돌려준다.
 * @param {object} student 등록·수정 요청 데이터
 * @returns {string|null} 문제가 없으면 null, 있으면 메시지
 */
export function validateStudent(student) {
    // 구조 분해로 필요한 값만 꺼낸다. detailRequest 가 없을 때를 대비해 기본값 {} 를 둔다.
    const { name, studentNumber, detailRequest = {} } = student;
    const { phoneNumber, email } = detailRequest;

    if (!name) return "이름을 입력해주세요.";

    // 앞의 조건이 먼저 걸러 주므로 isValidStudentNumber 안의 trim() 이 안전하다.
    if (!studentNumber || !isValidStudentNumber(studentNumber)) {
        return "학번을 입력하지 않거나 올바른 형식이 아닙니다.";
    }

    if (!phoneNumber || !PHONE_PATTERN.test(phoneNumber)) {
        return "전화번호를 입력하지 않거나 올바른 전화번호 형식이 아닙니다.";
    }

    // 이메일은 선택 항목이 아니라 필수입니다.
    // collectStudentData 가 빈 문자열을 null 로 바꾸므로 여기서 걸립니다.
    if (!email || !isValidEmail(email)) {
        return "이메일을 입력하지 않거나 올바른 이메일 형식이 아닙니다.";
    }

    return null;
}
