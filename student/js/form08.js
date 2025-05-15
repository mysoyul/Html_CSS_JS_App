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
    e.preventDefault();

    // 폼 데이터 수집
    const formData = new FormData(studentForm);
    // 학생과 상세정보를 분리한 요청 데이터 구성
    const studentData = {
        name: formData.get("name").trim(),
        studentNumber: formData.get("studentNumber").trim(),
        detailRequest: {
            address: formData.get("address").trim(),
            phoneNumber: formData.get("phoneNumber").trim(),
            email: formData.get("email").trim() || null,
            dateOfBirth: formData.get("dateOfBirth") || null,
        },
    };

    // 유효성 검사
    if (!validateStudent(studentData)) {
        return;
    }

    // 서버로 데이터 전송
    createStudent(studentData);
});

// 학생 생성 함수
function createStudent(studentData) {
    fetch(`${API_BASE_URL}/api/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
    })
        .then(async (response) => {
            if (!response.ok) {
                // 응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();

                // 상태 코드와 메시지를 확인하여 적절한 에러 처리
                if (response.status === 409) {
                    // 중복 오류 처리
                    throw new Error(errorData.message || "이미 등록된 학번입니다.");
                } else {
                    // 기타 오류 처리
                    throw new Error(errorData.message || "학생 등록에 실패했습니다.");
                }
            }
            return response.json();
        })
        .then((result) => {
            alert("학생이 성공적으로 등록되었습니다.");
            studentForm.reset();
            loadStudents(); // 목록 새로고침
        })
        .catch((error) => {
            console.error("Error:", error.message);
            alert(error.message);  // 실제 서버에서 온 에러 메시지 표시
        });
}

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

    if (!student.detailRequest.address) {
        alert("주소를 입력해주세요.");
        return false;
    }

    if (!student.detailRequest.phoneNumber) {
        alert("전화번호를 입력해주세요.");
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
    if (!phonePattern.test(student.detailRequest.phoneNumber)) {
        alert("올바른 전화번호 형식이 아닙니다.");
        return false;
    }

    // 이메일 형식 검사 (입력된 경우에만)
    if (student.detailRequest.email && !isValidEmail(student.detailRequest.email)) {
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

// 학생 삭제 함수
function deleteStudent(studentId) {
    if (!confirm('정말로 이 학생을 삭제하시겠습니까?')) {
        return;
    }

    fetch(`${API_BASE_URL}/api/students/${studentId}`, {
        method: 'DELETE'
    })
        .then(async (response) => {
            if (!response.ok) {
                // 응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();

                // 상태 코드와 메시지를 확인하여 적절한 에러 처리
                if (response.status === 404) {
                    // 중복 오류 처리
                    throw new Error(errorData.message || "존재하지 않는 학생입니다.");
                }
            }
            alert('학생이 성공적으로 삭제되었습니다.');
            loadStudents(); // 목록 새로고침
        })
        .catch(error => {
            console.error('Error:', error);
            //alert('학생 삭제에 실패했습니다.');
            alert(error.message);  // 실제 서버에서 온 에러 메시지 표시
        });
}