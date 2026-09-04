/* ===========================================================
   main.js — 앱을 조립하는 곳
   -----------------------------------------------------------
   지금까지 만든 모듈들을 가져와 이벤트에 연결합니다.
   화면(ui/)과 서버(api/)와 검사(lib/)를 이어 주는 것이
   이 파일의 유일한 역할입니다.

   form11.js 400여 줄이 여기서는 100줄 남짓으로 줄었습니다.
   코드가 사라진 것이 아니라 역할별로 나뉘어 간 것입니다.
   =========================================================== */

import "./style.css";

import {
    fetchStudents,
    fetchStudent,
    createStudent,
    updateStudent,
    deleteStudent,
} from "./api/studentApi.js";

import { validateStudent } from "./lib/validation.js";

import {
    studentForm,
    cancelButton,
    collectStudentData,
    fillForm,
    setEditMode,
    resetForm,
    scrollToForm,
} from "./ui/studentForm.js";

import {
    renderStudentTable, renderTableError, studentTableBody,
} from "./ui/studentTable.js";
import { showError, showSuccess, clearMessages, setLoading } from "./ui/message.js";

/** 수정 중인 학생 ID. 값이 있으면 수정 모드, null 이면 등록 모드.*/
let editingStudentId = null;


/* ---------------------------------------------------------
   목록 불러오기
   --------------------------------------------------------- */
async function loadStudents() {
    setLoading(true);

    try {
        const students = await fetchStudents();
        renderStudentTable(students);
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
        renderTableError();
    } finally {
        // 성공하든 실패하든 로딩 표시는 반드시 끈다.
        setLoading(false);
    }
}


/* ---------------------------------------------------------
   등록 / 수정 — 폼 제출
   --------------------------------------------------------- */
studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();          // 페이지 새로고침 막기
    clearMessages();

    const studentData = collectStudentData();

    // 검사에 걸리면 메시지만 보여 주고 끝낸다(early return).
    const errorMessage = validateStudent(studentData);
    if (errorMessage) {
        showError(errorMessage);
        return;
    }

    try {
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


/* ---------------------------------------------------------
   수정 / 삭제 — 표에서 일어난 클릭을 한곳에서 받는다 (이벤트 위임)
   --------------------------------------------------------- */
studentTableBody.addEventListener("click", async (event) => {
    // 클릭된 지점에서 가장 가까운 data-action 버튼을 찾는다.
    const button = event.target.closest("button[data-action]");
    if (!button) return;             // 버튼이 아닌 곳을 눌렀다

    const { action, id } = button.dataset;

    if (action === "edit") {
        await startEdit(Number(id));
    } else if (action === "delete") {
        await removeStudent(Number(id));
    }
});

/**
 * 수정할 학생 정보를 불러와 폼에 채우고 수정 모드로 바꾼다.
 * @param {number} studentId
 */
async function startEdit(studentId) {
    clearMessages();

    try {
        const student = await fetchStudent(studentId);

        fillForm(student);
        editingStudentId = studentId;
        setEditMode(true);
        scrollToForm();
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}

/**
 * 확인을 받은 뒤 학생을 삭제한다.
 * @param {number} studentId
 */
async function removeStudent(studentId) {
    if (!confirm("정말로 이 학생을 삭제하시겠습니까?")) {
        return;
    }

    try {
        await deleteStudent(studentId);
        showSuccess("학생이 성공적으로 삭제되었습니다.");

        // 수정 중이던 학생을 삭제했다면 폼도 등록 모드로 되돌린다.
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


/* ---------------------------------------------------------
   취소 버튼 — 수정 모드에서 빠져나온다
   --------------------------------------------------------- */
cancelButton.addEventListener("click", () => {
    editingStudentId = null;
    resetForm();
    clearMessages();
});


/* ---------------------------------------------------------
   시작
   -----------------------------------------------------------
   type="module" 스크립트는 HTML 을 다 읽은 뒤 실행되므로
   DOMContentLoaded 를 기다릴 필요가 없습니다.
   --------------------------------------------------------- */
loadStudents();
