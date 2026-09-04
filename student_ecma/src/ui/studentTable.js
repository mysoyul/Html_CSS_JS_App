/* ===========================================================
   학생 목록 표 그리기
   -----------------------------------------------------------
   form11.js 와 달라진 점 두 가지입니다.

   (1) onclick="deleteStudent(3)" 을 쓰지 않습니다.
       모듈 안의 함수는 전역(window)에 없기 때문에
       HTML 속성에서 이름으로 부를 수 없습니다.
       대신 버튼에 data-action, data-id 를 심어 두고
       main.js 가 tbody 한 곳에서 클릭을 받습니다(이벤트 위임).

   (2) 값은 innerHTML 이 아니라 textContent 로 넣습니다.
       사용자가 입력한 글자에 태그가 섞여 있어도 그대로 글자로
       표시되어 안전합니다.
   =========================================================== */

const studentTableBody = document.getElementById("studentTableBody");

/** 표의 열 개수. colspan 에 쓴다. */
const COLUMN_COUNT = 7;

/**
 * 한 줄짜리 안내 행을 만든다.
 * @param {string} message 표시할 문구
 * @param {string} [className] 행에 붙일 클래스 (기본값 "empty-row")
 * @returns {HTMLTableRowElement}
 */
function createMessageRow(message, className = "empty-row") {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = COLUMN_COUNT;
    cell.className = className;
    cell.textContent = message;
    row.appendChild(cell);

    return row;
}

/**
 * 학생 한 명을 표의 한 행으로 만든다.
 * @param {object} student 서버가 보낸 학생 객체
 * @returns {HTMLTableRowElement}
 */
function createStudentRow(student) {
    const { id, name, studentNumber, detail } = student;
    const row = document.createElement("tr");

    // detail 이 없거나 값이 비어 있으면 "-" 를 보여 준다.
    const values = [
        name,
        studentNumber,
        detail?.address ?? "-",
        detail?.phoneNumber ?? "-",
        detail?.email ?? "-",
        detail?.dateOfBirth ?? "-",
    ];

    values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;      // 태그가 실행되지 않는다
        row.appendChild(cell);
    });

    // 액션 칸 — 버튼에 어떤 동작인지, 어떤 학생인지를 data 속성으로 새겨 둔다.
    const actionCell = document.createElement("td");

    [
        { action: "edit", label: "수정", className: "edit-btn" },
        { action: "delete", label: "삭제", className: "delete-btn" },
    ].forEach(({ action, label, className }) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = className;
        button.textContent = label;
        button.dataset.action = action;   // data-action="edit"
        button.dataset.id = id;           // data-id="3"

        actionCell.appendChild(button);
    });

    row.appendChild(actionCell);
    return row;
}

/**
 * 학생 목록을 표에 그린다.
 * @param {object[]} [students] 학생 배열 (기본값 [])
 * @param {{ emptyMessage?: string }} [options] 빈 목록일 때 문구
 */
export function renderStudentTable(students = [], { emptyMessage = "등록된 학생이 없습니다." } = {}) {
    // 먼저 비우지 않으면 목록을 새로고침할 때마다 같은 학생이 쌓인다.
    studentTableBody.innerHTML = "";

    if (students.length === 0) {
        studentTableBody.appendChild(createMessageRow(emptyMessage));
        return;
    }

    // 여러 행을 한 번에 붙이기 위한 임시 그릇 (화면을 한 번만 다시 그린다)
    const fragment = document.createDocumentFragment();
    students.forEach((student) => fragment.appendChild(createStudentRow(student)));

    studentTableBody.appendChild(fragment);
}

/**
 * 목록을 불러오지 못했을 때 표 자리에 오류를 표시한다.
 * @param {string} [message] 기본값 "오류: 데이터를 불러올 수 없습니다."
 */
export function renderTableError(message = "오류: 데이터를 불러올 수 없습니다.") {
    studentTableBody.innerHTML = "";
    studentTableBody.appendChild(createMessageRow(message, "error-row"));
}

/** 클릭 이벤트를 위임받을 tbody. main.js 에서 사용한다. */
export { studentTableBody };
