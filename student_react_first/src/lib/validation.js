/* ===========================================================
   유효성 검사 — 화면도 서버도 모르는 순수 함수
   -----------------------------------------------------------
   form11.js 의 validateStudent 는 검사에 실패하면 그 자리에서
   alert() 을 띄우고 false 를 돌려줬습니다. 그러면

     - alert 을 다른 방식으로 바꾸려면 이 함수를 고쳐야 하고
     - 테스트하기도 어렵습니다.

   여기서는 "무엇이 잘못됐는지"만 돌려주고,
   그것을 어떻게 보여줄지는 부르는 쪽이 정하게 했습니다.
   =========================================================== */

/** 학번: 영문과 숫자만 */
const STUDENT_NUMBER_PATTERN = /^[A-Za-z0-9]+$/;

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
 * 학생 데이터를 검사해 첫 번째 오류 메시지를 돌려준다.
 * @param {object} student 등록·수정 요청 데이터
 * @returns {string|null} 문제가 없으면 null, 있으면 메시지
 */
export function validateStudent(student) {
    // 구조 분해로 필요한 값만 꺼낸다. detailRequest 가 없을 때를 대비해 기본값 {} 를 둔다.
    const { name, studentNumber, detailRequest = {} } = student;
    const { address, phoneNumber, email } = detailRequest;

    if (!name) return "이름을 입력해주세요.";
    if (!studentNumber) return "학번을 입력해주세요.";
    if (!address) return "주소를 입력해주세요.";
    if (!phoneNumber) return "전화번호를 입력해주세요.";

    if (!STUDENT_NUMBER_PATTERN.test(studentNumber)) {
        return "학번은 영문과 숫자만 입력 가능합니다.";
    }

    if (!PHONE_PATTERN.test(phoneNumber)) {
        return "올바른 전화번호 형식이 아닙니다.";
    }

    // 이메일은 선택 항목이므로 입력된 경우에만 검사한다.
    if (email && !isValidEmail(email)) {
        return "올바른 이메일 형식이 아닙니다.";
    }

    return null;
}
