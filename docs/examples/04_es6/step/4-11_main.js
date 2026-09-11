/* ===========================================================
   [실습 4-11]  main.js 로 조립하기 (main.js 완성본)
   -----------------------------------------------------------
   놓을 위치 : student_ecma/src/main.js
   교재      : 05_ECMAScript_실습_단계별.docx
   =========================================================== */

// CSS 도 import 한다. Vite 가 이 줄을 보고 스타일을 끼워 넣는다.
import "./style.css";

// 서버와 대화하는 함수들
import {
    fetchStudents,
    fetchStudent,
    createStudent,
    updateStudent,
    deleteStudent,
} from "./api/studentApi.js";

// 입력값 검사
import { validateStudent } from "./lib/validation.js";

// 폼 다루기
import {
    studentForm,
    cancelButton,
    collectStudentData,
    fillForm,
    setEditMode,
    resetForm,
    scrollToForm,
} from "./ui/studentForm.js";

// 표 그리기
import {
    renderStudentTable,
    renderTableError,
    studentTableBody,
} from "./ui/studentTable.js";

// 메시지 표시
import {
    showError,
    showSuccess,
    clearMessages,
    setLoading,
} from "./ui/message.js";

// 이 파일이 기억하는 유일한 상태다.
// 값이 있으면 수정 모드, null 이면 등록 모드다.
let editingStudentId = null;


async function loadStudents() {
    setLoading(true);

    // try 안에서 오류가 나면 곧바로 catch 로 넘어간다.
    // finally 는 성공하든 실패하든 마지막에 반드시 실행된다.
    try {
        // await 은 서버 응답이 올 때까지 기다린다.
        // 3부의 fetch().then().then() 사슬이 두 줄이 되었다.
        const students = await fetchStudents();
        renderStudentTable(students);
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);    // studentApi 가 던진 메시지
        renderTableError();
    } finally {
        // 여기에 두면 성공 경로와 실패 경로에 두 번 적지 않아도 된다.
        setLoading(false);
    }
}


// 핸들러 안에서 await 을 쓰려면 함수에 async 를 붙여야 한다.
studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();          // 폼 제출로 페이지가 새로고침되는 것을 막는다
    clearMessages();

    const studentData = collectStudentData();

    // validateStudent 는 문제가 있으면 메시지를, 없으면 null 을 돌려준다.
    // 문제가 있으면 여기서 끝낸다(early return).
    const errorMessage = validateStudent(studentData);
    if (errorMessage) {
        showError(errorMessage);
        return;
    }

    try {
        // editingStudentId 에 값이 있으면 수정, 없으면 등록이다.
        if (editingStudentId) {
            await updateStudent(editingStudentId, studentData);
            showSuccess("학생 정보가 성공적으로 수정되었습니다.");
        } else {
            await createStudent(studentData);
            showSuccess("학생이 성공적으로 등록되었습니다.");
        }

        editingStudentId = null;
        resetForm();
        await loadStudents();         // 목록 새로고침
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);     // 서버가 보낸 실제 메시지
    }
});


/* 버튼마다 이벤트를 걸지 않는 이유는, 표를 다시 그릴 때마다
   버튼이 새로 만들어져 매번 다시 걸어야 하기 때문이다.
   사라지지 않는 부모인 tbody 에 한 번만 걸어 두면
   나중에 생기는 행의 버튼도 그대로 동작한다(이벤트 위임). */
studentTableBody.addEventListener("click", async (event) => {
    // tbody 안에서 일어난 클릭이 전부 여기로 들어온다.
    // 이름 칸을 눌렀는지 버튼을 눌렀는지 먼저 가려내야 한다.
    //
    //   event.target  이벤트를 건 tbody 가 아니라 실제로 눌린 가장 안쪽 요소
    //   closest(...)  자기 자신부터 부모 쪽으로 올라가며 조건에 맞는 첫 요소를 찾는다
    //                 끝까지 없으면 null 을 돌려준다
    const button = event.target.closest("button[data-action]");
    if (!button) return;             // 버튼이 아닌 곳을 눌렀다

    // data-action="edit" 은 button.dataset.action 으로 읽는다.
    const { action, id } = button.dataset;

    // dataset 값은 언제나 문자열이다. data-id="3" 이면 "3" 이 온다.
    // 그래서 Number() 로 숫자로 바꿔서 넘긴다.
    if (action === "edit") {
        await startEdit(Number(id));
    } else if (action === "delete") {
        await removeStudent(Number(id));
    }
});


// 수정할 학생 정보를 불러와 폼에 채우고 수정 모드로 바꾼다.
async function startEdit(studentId) {
    clearMessages();

    try {
        const student = await fetchStudent(studentId);

        fillForm(student);
        editingStudentId = studentId;   // 이제 제출하면 등록이 아니라 수정이 된다
        setEditMode(true);
        scrollToForm();
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}

// 확인을 받은 뒤 학생을 삭제한다.
async function removeStudent(studentId) {
    if (!confirm("정말로 이 학생을 삭제하시겠습니까?")) {
        return;
    }

    try {
        await deleteStudent(studentId);
        showSuccess("학생이 성공적으로 삭제되었습니다.");

        // 수정 중이던 학생을 삭제했다면 폼도 등록 모드로 되돌린다.
        // 이걸 빠뜨리면 없는 학생을 수정하려다 404 가 난다.
        if (editingStudentId === studentId) {
            editingStudentId = null;
            resetForm();
        }

        await loadStudents();
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}


cancelButton.addEventListener("click", () => {
    editingStudentId = null;
    resetForm();
    clearMessages();
});


/* ── 시작 ──────────────────────────────────────────────── */

// 3부에서는 DOMContentLoaded 안에서 불러야 했다.
// type="module" 은 HTML 을 다 읽은 뒤 실행되므로 여기서 바로 부른다.
loadStudents();
