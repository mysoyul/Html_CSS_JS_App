/* ===========================================================
   [실습 4-7]  폼 값 수집 다시 쓰기
   -----------------------------------------------------------
   놓을 위치 : student_ecma/src/ui/studentForm.js
   교재      : 05_ECMAScript_실습_단계별.docx
   =========================================================== */

// export 를 붙이면 다른 파일에서 import 로 가져다 쓸 수 있다.
// main.js 가 submit 이벤트를 걸어야 하므로 밖으로 내보낸다.
export const studentForm = document.getElementById("studentForm");

// 폼에 입력된 값을 서버가 받는 구조로 모은다.
export function collectStudentData() {
    // FormData 는 폼 안의 입력칸을 name 속성으로 꺼내 쓸 수 있게 모아 준다.
    // id 가 아니라 name 이 열쇠다.
    const formData = new FormData(studentForm);

    // 서버는 학생 기본 정보와 상세 정보를 나눠서 받는다.
    return {
        name: formData.get("name").trim(),
        studentNumber: formData.get("studentNumber").trim(),
        detailRequest: {
            address: formData.get("address").trim(),
            phoneNumber: formData.get("phoneNumber").trim(),
            // 여기서만 ?? 가 아니라 || 를 쓴다.
            // 아무것도 입력하지 않으면 빈 문자열("")이 오는데,
            // ?? 는 빈 문자열을 통과시켜 서버로 "" 이 나가 버린다.
            email: formData.get("email").trim() || null,
            dateOfBirth: formData.get("dateOfBirth") || null,
        },
    };
}
