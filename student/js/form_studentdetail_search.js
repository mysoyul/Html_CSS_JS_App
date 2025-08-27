// 학생 관리 시스템 JavaScript (검색 기능 포함)
const StudentManager = {
    API_BASE_URL: "http://localhost:8080/api/students",
    
    // DOM 요소들
    studentForm: null,
    studentTableBody: null,
    editModal: null,
    editForm: null,
    detailModal: null,
    searchBtn: null,
    showAllBtn: null,
    editModalClose: null,
    detailModalClose: null,
    
    // 현재 수정 중인 학생 ID
    editingStudentId: null,

    // 애플리케이션 초기화
    init() {
        // DOM 요소 가져오기
        this.studentForm = document.getElementById("studentForm");
        this.studentTableBody = document.getElementById("studentTableBody");
        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.detailModal = document.getElementById('detailModal');
        this.searchBtn = document.getElementById('searchBtn');
        this.showAllBtn = document.getElementById('showAllBtn');
        this.editModalClose = document.getElementById('editModalClose');
        this.detailModalClose = document.getElementById('detailModalClose');
        
        // 이벤트 리스너 바인딩
        this.bindEvents();
        
        // 초기 데이터 로드
        this.loadAllStudents();
    },
    
    // 모든 이벤트 리스너 바인딩
    bindEvents() {
        // 폼 제출
        this.studentForm.addEventListener("submit", (e) => this.handleCreateStudent(e));
        
        // 검색 기능
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.showAllBtn.addEventListener('click', () => this.loadAllStudents());
        
        // 모달 이벤트
        this.editModalClose.addEventListener('click', () => this.closeEditModal());
        this.detailModalClose.addEventListener('click', () => this.closeDetailModal());
        this.editForm.addEventListener('submit', (e) => this.handleUpdateStudent(e));
        
        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', (event) => {
            if (event.target === this.editModal) {
                this.closeEditModal();
            }
            if (event.target === this.detailModal) {
                this.closeDetailModal();
            }
        });
        
        // 검색에서 엔터키 활성화
        document.getElementById('searchName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        document.getElementById('searchStudentNumber').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        document.getElementById('searchAddress').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
    },

    // 학생 생성 폼 제출 처리
    async handleCreateStudent(e) {
        e.preventDefault();

        const formData = this.getFormData();

        if (!this.validateStudent(formData)) {
            return;
        }

        try {
            this.showLoading('학생 등록 중...');
            
            if (this.editingStudentId) {
                await this.updateStudent(this.editingStudentId, formData);
            } else {
                await this.createStudent(formData);
            }
            
            this.resetForm();
            this.showSuccessMessage('학생이 성공적으로 등록되었습니다!');
            this.loadAllStudents();
        } catch (error) {
            this.showErrorMessage('학생 등록 실패: ' + error.message);
        } finally {
            this.hideLoading();
        }
    },

    // 폼 데이터 가져오기
    getFormData() {
        const formData = new FormData(this.studentForm);
        
        return {
            name: formData.get("name").trim(),
            studentNumber: formData.get("studentNumber").trim(),
            detailRequest: {
                address: formData.get("address").trim(),
                phoneNumber: formData.get("phoneNumber").trim(),
                email: formData.get("email").trim() || null,
                dateOfBirth: formData.get("dateOfBirth") || null,
            },
        };
    },

    // 학생 데이터 유효성 검사
    validateStudent(student) {
        // 필수 필드 검사
        if (!student.name) {
            this.showErrorMessage("이름을 입력해주세요.");
            return false;
        }

        if (!student.studentNumber) {
            this.showErrorMessage("학번을 입력해주세요.");
            return false;
        }

        if (!student.detailRequest.address) {
            this.showErrorMessage("주소를 입력해주세요.");
            return false;
        }

        if (!student.detailRequest.phoneNumber) {
            this.showErrorMessage("전화번호를 입력해주세요.");
            return false;
        }

        // 학번 형식 검사 (예: 영문과 숫자 조합)
        const studentNumberPattern = /^[A-Za-z0-9]+$/;
        if (!studentNumberPattern.test(student.studentNumber)) {
            this.showErrorMessage("학번은 영문과 숫자만 입력 가능합니다.");
            return false;
        }

        // 전화번호 형식 검사
        const phonePattern = /^[0-9-\s]+$/;
        if (!phonePattern.test(student.detailRequest.phoneNumber)) {
            this.showErrorMessage("올바른 전화번호 형식이 아닙니다.");
            return false;
        }

        // 이메일 형식 검사 (입력된 경우에만)
        if (student.detailRequest.email && !this.isValidEmail(student.detailRequest.email)) {
            this.showErrorMessage("올바른 이메일 형식이 아닙니다.");
            return false;
        }

        return true;
    },

    // 이메일 유효성 검사
    isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    },

    // API 메서드들
    async createStudent(studentData) {
        const response = await fetch(this.API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 409) {
                throw new Error(errorData.message || "이미 등록된 학번입니다.");
            } else {
                throw new Error(errorData.message || "학생 등록에 실패했습니다.");
            }
        }

        return response.json();
    },

    async loadAllStudents() {
        alert("loadAllStudents");
        try {
            this.showLoading('학생 목록 로딩 중...');
            const response = await fetch(this.API_BASE_URL);
            if (!response.ok) {
                throw new Error('학생 목록을 가져오는데 실패했습니다');
            }
            const students = await response.json();
            this.displayStudents(students);
        } catch (error) {
            console.error('학생 로딩 에러:', error);
            this.studentTableBody.innerHTML = '<tr><td colspan="8">학생을 불러오는 중 오류가 발생했습니다</td></tr>';
            this.showErrorMessage('학생 목록 로드 실패');
        } finally {
            this.hideLoading();
        }
    },

    // 테이블에 학생 표시
    displayStudents(students) {
        console.log(students);
        this.studentTableBody.innerHTML = "";

        if (students.length === 0) {
            this.studentTableBody.innerHTML = '<tr><td colspan="8">등록된 학생이 없습니다</td></tr>';
            return;
        }

        students.forEach((student) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.id}</td>
                <td>${this.escapeHtml(student.name)}</td>
                <td>${this.escapeHtml(student.studentNumber)}</td>
                <td>${student.detail ? this.escapeHtml(student.detail.address) : "-"}</td>
                <td>${student.detail ? this.escapeHtml(student.detail.phoneNumber) : "-"}</td>
                <td>${student.detail ? (student.detail.email || "-") : "-"}</td>
                <td>${student.detail ? (student.detail.dateOfBirth || "-") : "-"}</td>
                <td>
                    <button class="detail-btn" onclick="StudentManager.showStudentDetail(${student.id})">상세</button>
                    <button class="edit-btn" onclick="StudentManager.editStudent(${student.id})">수정</button>
                    <button class="delete-btn" onclick="StudentManager.deleteStudent(${student.id})">삭제</button>
                </td>
            `;

            this.studentTableBody.appendChild(row);
        });
    },

    // 학생 상세 정보 표시
    async showStudentDetail(id) {
        try {
            this.showLoading('학생 정보 로딩 중...');
            const response = await fetch(`${this.API_BASE_URL}/${id}`);
            if (!response.ok) {
                throw new Error('학생 정보를 가져오는데 실패했습니다');
            }
            const student = await response.json();
            
            const detailContent = document.getElementById('studentDetailContent');
            detailContent.innerHTML = `
                <div class="detail-info">
                    <div class="detail-section">
                        <h3>기본 정보</h3>
                        <div class="detail-item">
                            <span class="detail-label">이름:</span>
                            <span class="detail-value">${this.escapeHtml(student.name)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">학번:</span>
                            <span class="detail-value">${this.escapeHtml(student.studentNumber)}</span>
                        </div>
                    </div>
                    ${student.detail ? `
                    <div class="detail-section">
                        <h3>상세 정보</h3>
                        <div class="detail-item">
                            <span class="detail-label">주소:</span>
                            <span class="detail-value">${this.escapeHtml(student.detail.address)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">전화번호:</span>
                            <span class="detail-value">${this.escapeHtml(student.detail.phoneNumber)}</span>
                        </div>
                        ${student.detail.email ? `
                        <div class="detail-item">
                            <span class="detail-label">이메일:</span>
                            <span class="detail-value">${this.escapeHtml(student.detail.email)}</span>
                        </div>` : ''}
                        ${student.detail.dateOfBirth ? `
                        <div class="detail-item">
                            <span class="detail-label">생년월일:</span>
                            <span class="detail-value">${student.detail.dateOfBirth}</span>
                        </div>` : ''}
                    </div>` : '<div class="detail-section"><p>상세 정보가 등록되지 않았습니다.</p></div>'}
                </div>
            `;
            
            this.detailModal.style.display = 'block';
        } catch (error) {
            console.error('상세 정보 로드 에러:', error);
            this.showErrorMessage('학생 상세 정보 불러오기 실패');
        } finally {
            this.hideLoading();
        }
    },

    // 검색 기능
    async handleSearch() {
        const nameQuery = document.getElementById('searchName').value.trim();
        const studentNumberQuery = document.getElementById('searchStudentNumber').value.trim();
        const addressQuery = document.getElementById('searchAddress').value.trim();
        
        try {
            this.showLoading('검색 중...');
            
            if (nameQuery) {
                // 이름으로 검색 (클라이언트 사이드 필터링)
                const response = await fetch(this.API_BASE_URL);
                if (!response.ok) {
                    throw new Error('검색에 실패했습니다');
                }
                const allStudents = await response.json();
                const filteredStudents = allStudents.filter(student => 
                    student.name.toLowerCase().includes(nameQuery.toLowerCase())
                );
                this.displayStudents(filteredStudents);
            } else if (studentNumberQuery) {
                // 학번으로 검색
                try {
                    const response = await fetch(`${this.API_BASE_URL}/number/${encodeURIComponent(studentNumberQuery)}`);
                    if (response.ok) {
                        const student = await response.json();
                        this.displayStudents([student]);
                    } else if (response.status === 404) {
                        this.displayStudents([]);
                    } else {
                        throw new Error('검색에 실패했습니다');
                    }
                } catch (error) {
                    // 정확한 학번 매치가 실패하면 부분 검색으로 변경
                    const response = await fetch(this.API_BASE_URL);
                    const allStudents = await response.json();
                    const filteredStudents = allStudents.filter(student => 
                        student.studentNumber.toLowerCase().includes(studentNumberQuery.toLowerCase())
                    );
                    this.displayStudents(filteredStudents);
                }
            } else if (addressQuery) {
                // 주소로 검색 (클라이언트 사이드 필터링)
                const response = await fetch(this.API_BASE_URL);
                if (!response.ok) {
                    throw new Error('검색에 실패했습니다');
                }
                const allStudents = await response.json();
                const filteredStudents = allStudents.filter(student => 
                    student.detail?.address?.toLowerCase().includes(addressQuery.toLowerCase())
                );
                this.displayStudents(filteredStudents);
            } else {
                this.loadAllStudents();
                return;
            }
        } catch (error) {
            console.error('검색 에러:', error);
            this.showErrorMessage('검색 실패: ' + error.message);
        } finally {
            this.hideLoading();
        }
    },

    // 학생 삭제
    async deleteStudent(studentId) {
        if (!confirm('정말로 이 학생을 삭제하시겠습니까?')) {
            return;
        }

        try {
            this.showLoading('학생 삭제 중...');
            const response = await fetch(`${this.API_BASE_URL}/${studentId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 404) {
                    throw new Error(errorData.message || "존재하지 않는 학생입니다.");
                }
                throw new Error(errorData.message || "학생 삭제에 실패했습니다.");
            }

            this.showSuccessMessage('학생이 성공적으로 삭제되었습니다.');
            this.loadAllStudents();
        } catch (error) {
            console.error('Error:', error);
            this.showErrorMessage(error.message);
        } finally {
            this.hideLoading();
        }
    },

    // 학생 수정 - 모달 열기
    async editStudent(studentId) {
        try {
            this.showLoading('학생 정보 로딩 중...');
            const response = await fetch(`${this.API_BASE_URL}/${studentId}`);
            if (!response.ok) {
                throw new Error('학생 정보를 가져오는데 실패했습니다');
            }
            const student = await response.json();

            // 기본 정보 입력
            document.getElementById('editId').value = student.id;
            document.getElementById('editName').value = student.name;
            document.getElementById('editStudentNumber').value = student.studentNumber;

            // 상세 정보 입력
            if (student.detail) {
                document.getElementById('editAddress').value = student.detail.address;
                document.getElementById('editPhoneNumber').value = student.detail.phoneNumber;
                document.getElementById('editEmail').value = student.detail.email || '';
                document.getElementById('editDateOfBirth').value = student.detail.dateOfBirth || '';
            } else {
                // 상세 정보가 없으면 빈 값으로 초기화
                document.getElementById('editAddress').value = '';
                document.getElementById('editPhoneNumber').value = '';
                document.getElementById('editEmail').value = '';
                document.getElementById('editDateOfBirth').value = '';
            }

            // 모달 표시
            this.editModal.style.display = 'block';
        } catch (error) {
            console.error('수정용 학생 로드 에러:', error);
            this.showErrorMessage('학생 정보 불러오기 실패');
        } finally {
            this.hideLoading();
        }
    },

    // 학생 수정 제출 처리
    async handleUpdateStudent(e) {
        e.preventDefault();

        const id = document.getElementById('editId').value;
        const name = document.getElementById('editName').value.trim();
        const studentNumber = document.getElementById('editStudentNumber').value.trim();
        const address = document.getElementById('editAddress').value.trim();
        const phoneNumber = document.getElementById('editPhoneNumber').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const dateOfBirth = document.getElementById('editDateOfBirth').value;

        const updateData = {
            name,
            studentNumber,
            detailRequest: {
                address,
                phoneNumber,
                email: email || null,
                dateOfBirth: dateOfBirth || null,
            },
        };

        if (!this.validateStudent(updateData)) {
            return;
        }

        try {
            this.showLoading('학생 수정 중...');
            const response = await fetch(`${this.API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || '학생 수정에 실패했습니다');
            }

            this.closeEditModal();
            this.showSuccessMessage('학생이 성공적으로 수정되었습니다!');
            this.loadAllStudents();
        } catch (error) {
            console.error('수정 에러:', error);
            this.showErrorMessage('학생 수정 실패: ' + error.message);
        } finally {
            this.hideLoading();
        }
    },

    // 학생 수정 처리하는 함수 (기존 폼에서 수정)
    async updateStudent(studentId, studentData) {
        const response = await fetch(`${this.API_BASE_URL}/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 409) {
                throw new Error(errorData.message || "학생정보가 중복됩니다.");
            } else {
                throw new Error(errorData.message || "학생정보 수정에 실패했습니다.");
            }
        }

        return response.json();
    },

    // 폼 초기화 함수
    resetForm() {
        this.studentForm.reset();
        this.editingStudentId = null;
        const submitButton = this.studentForm.querySelector('button[type="submit"]');
        const cancelButton = this.studentForm.querySelector('.cancel-btn');
        submitButton.textContent = '학생 등록';
        cancelButton.style.display = 'none';
        this.clearMessages();
    },

    // 모달 메서드들
    closeEditModal() {
        this.editModal.style.display = 'none';
    },

    closeDetailModal() {
        this.detailModal.style.display = 'none';
    },

    // 유틸리티 메서드들
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    showLoading(message = '로딩 중...') {
        // 로딩 오버레이가 없으면 생성
        let loadingOverlay = document.getElementById('loadingOverlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loadingOverlay';
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                font-size: 16px;
            `;
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.innerHTML = `<div class="loading">${message}</div>`;
        loadingOverlay.style.display = 'flex';
    },

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    },

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    },

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    },

    showMessage(message, type = 'info') {
        // 기존 메시지 제거
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // 새 메시지 생성
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;

        // 페이지 상단에 삽입
        document.body.insertBefore(messageDiv, document.body.firstChild);

        // 5초 후 자동 숨김
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    },

    // 메시지 초기화
    clearMessages() {
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
    }
};

// DOM 로드 시 초기화
document.addEventListener("DOMContentLoaded", function () {
    StudentManager.init();
});

// onclick 핸들러를 위해 StudentManager를 전역으로 접근 가능하게 만들기
window.StudentManager = StudentManager;