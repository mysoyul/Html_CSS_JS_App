// 전역 변수
const API_BASE_URL = "http://localhost:8080";

// DOM 요소 참조
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

// 초기화
document.addEventListener("DOMContentLoaded", function () {
    loadStudents();
});

// 폼 제출 이벤트 핸들러
studentForm.addEventListener("submit", function (e) {
    console.log("form submit");
    e.preventDefault();

    // 폼 데이터 수집
    const formData = new FormData(studentForm);
    const studentData = {
        name: formData.get("name").trim(),
        studentNumber: formData.get("studentNumber").trim(),
        address: formData.get("address").trim(),
        phoneNumber: formData.get("phoneNumber").trim(),
        email: formData.get("email").trim(),
        dateOfBirth: formData.get("dateOfBirth"),
    };

    // 유효성 검사
    if (!validateStudent(studentData)) {
        return;
    }

    console.log("유효한 데이터:", studentData);
    // 서버로 데이터 전송
    createStudent(studentData);
});

// 학생 데이터 유효성 검사
function validateStudent(student) {
    // 필수 필드 검사
    if (!student.name) {
        alert("이름을 입력해주세요.");
        return false;
    }

    if (!student.studentNumber) {
        alert("학번을 입력해주세요.");
        return false;
    }

    if (!student.address) {
        alert("주소를 입력해주세요.");
        return false;
    }

    if (!student.phoneNumber) {
        alert("전화번호를 입력해주세요.");
        return false;
    }

    if (!student.email) {
        alert("이메일을 입력해주세요.");
        return false;
    }

    // 학번 형식 검사 (예: 영문과 숫자 조합)
    const studentNumberPattern = /^[A-Za-z0-9]+$/;
    if (!studentNumberPattern.test(student.studentNumber)) {
        alert("학번은 영문과 숫자만 입력 가능합니다.");
        return false;
    }

    // 전화번호 형식 검사
    const phonePattern = /^[0-9-\s]+$/;
    if (!phonePattern.test(student.phoneNumber)) {
        alert("올바른 전화번호 형식이 아닙니다.");
        return false;
    }

    // 이메일 형식 검사 (입력된 경우에만)
    if (student.email && !isValidEmail(student.email)) {
        alert("올바른 이메일 형식이 아닙니다.");
        return false;
    }

    return true;
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// 학생 목록 로드 함수
function loadStudents() {
    console.log("학생 목록 로드 중...");
    fetch(`${API_BASE_URL}/api/students`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("학생 목록을 불러오는데 실패했습니다.");
            }
            return response.json();
        })
        .then((students) => {
            renderStudentTable(students);
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("학생 목록을 불러오는데 실패했습니다.");
        });
}

// 학생 테이블 렌더링
function renderStudentTable(students) {
    studentTableBody.innerHTML = "";

    students.forEach((student) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.studentNumber}</td>
                    <td>${student.detail ? student.detail.address : "-"}</td>
                    <td>${student.detail ? student.detail.phoneNumber : "-"}</td>
                    <td>${student.detail ? student.detail.email || "-" : "-"}</td>
                    <td>${student.detail ? student.detail.dateOfBirth || "-" : "-"}</td>
                    <td>
                        <button class="edit-btn" onclick="editStudent(${student.id})">수정</button>
                        <button class="delete-btn" onclick="deleteStudent(${student.id})">삭제</button>
                    </td>
                `;

        studentTableBody.appendChild(row);
    });
}