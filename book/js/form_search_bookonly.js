// 도서 관리 시스템 JavaScript
const BookManager = {
    API_BASE_URL: 'http://localhost:8080/api/books',
    
    // DOM 요소들
    bookForm: null,
    booksTableBody: null,
    editModal: null,
    editForm: null,
    searchBtn: null,
    showAllBtn: null,
    closeBtn: null,
    
    // 애플리케이션 초기화
    init() {
        // DOM 요소 가져오기
        this.bookForm = document.getElementById('bookForm');
        this.booksTableBody = document.getElementById('booksTableBody');
        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.searchBtn = document.getElementById('searchBtn');
        this.showAllBtn = document.getElementById('showAllBtn');
        this.closeBtn = document.querySelector('.close');
        
        // 이벤트 리스너 바인딩
        this.bindEvents();
        
        // 초기 데이터 로드
        this.loadAllBooks();
    },
    
    // 모든 이벤트 리스너 바인딩
    bindEvents() {
        // 폼 제출
        this.bookForm.addEventListener('submit', (e) => this.handleCreateBook(e));
        
        // 검색 기능
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.showAllBtn.addEventListener('click', () => this.loadAllBooks());
        
        // 모달 이벤트
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.editForm.addEventListener('submit', (e) => this.handleUpdateBook(e));
        
        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', (event) => {
            if (event.target === this.editModal) {
                this.closeModal();
            }
        });
        
        // 검색에서 엔터키 활성화
        document.getElementById('searchTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        document.getElementById('searchAuthor').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
    },
    
    // 도서 생성 폼 제출 처리
    async handleCreateBook(e) {
        e.preventDefault();
        
        const formData = this.getFormData();
        
        if (!this.validateBookForm(formData.title, formData.author, formData.isbn)) {
            return;
        }
        
        try {
            this.showLoading('도서 추가 중...');
            await this.createBook(formData);
            this.bookForm.reset();
            this.showSuccessMessage('도서가 성공적으로 추가되었습니다!');
            this.loadAllBooks();
        } catch (error) {
            this.showErrorMessage('도서 추가 실패: ' + error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // 폼 데이터 가져오기
    getFormData() {
        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const isbn = document.getElementById('isbn').value.trim();
        const price = document.getElementById('price').value;
        const publishDate = document.getElementById('publishDate').value;
        
        return {
            title,
            author,
            isbn,
            price: price ? parseInt(price) : null,
            publishDate: publishDate || null
        };
    },
    
    // 입력 검증
    validateBookForm(title, author, isbn) {
        if (!title) {
            this.showErrorMessage('제목을 입력해주세요');
            return false;
        }
        if (!author) {
            this.showErrorMessage('저자를 입력해주세요');
            return false;
        }
        if (!isbn) {
            this.showErrorMessage('ISBN을 입력해주세요');
            return false;
        }
        // ISBN 검증 (기본)
        const isbnRegex = /^[0-9-]{10,17}$/;
        if (!isbnRegex.test(isbn)) {
            this.showErrorMessage('올바른 ISBN을 입력해주세요');
            return false;
        }
        return true;
    },
    
    // API 메서드들
    async createBook(bookData) {
        const response = await fetch(this.API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '도서 생성에 실패했습니다');
        }
        
        return response.json();
    },
    
    async loadAllBooks() {
        try {
            this.showLoading('도서 목록 로딩 중...');
            const response = await fetch(this.API_BASE_URL);
            if (!response.ok) {
                throw new Error('도서 목록을 가져오는데 실패했습니다');
            }
            const books = await response.json();
            this.displayBooks(books);
        } catch (error) {
            console.error('도서 로딩 에러:', error);
            this.booksTableBody.innerHTML = '<tr><td colspan="7">도서를 불러오는 중 오류가 발생했습니다</td></tr>';
            this.showErrorMessage('도서 목록 로드 실패');
        } finally {
            this.hideLoading();
        }
    },
    
    // 테이블에 도서 표시
    displayBooks(books) {
        this.booksTableBody.innerHTML = '';
        
        if (books.length === 0) {
            this.booksTableBody.innerHTML = '<tr><td colspan="7">등록된 도서가 없습니다</td></tr>';
            return;
        }
        
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.id}</td>
                <td>${this.escapeHtml(book.title)}</td>
                <td>${this.escapeHtml(book.author)}</td>
                <td>${this.escapeHtml(book.isbn)}</td>
                <td>${book.price ? book.price.toLocaleString() + '원' : '미지정'}</td>
                <td>${book.publishDate || '미지정'}</td>
                <td>
                    <button class="edit-btn" onclick="BookManager.editBook(${book.id})">수정</button>
                    <button class="delete-btn" onclick="BookManager.deleteBook(${book.id})">삭제</button>
                </td>
            `;
            this.booksTableBody.appendChild(row);
        });
    },
    
    // 검색 기능
    async handleSearch() {
        const titleQuery = document.getElementById('searchTitle').value.trim();
        const authorQuery = document.getElementById('searchAuthor').value.trim();
        
        try {
            this.showLoading('검색 중...');
            let url = this.API_BASE_URL;
            if (titleQuery) {
                url += `/search/title?title=${encodeURIComponent(titleQuery)}`;
            } else if (authorQuery) {
                url += `/search/author?author=${encodeURIComponent(authorQuery)}`;
            } else {
                this.loadAllBooks();
                return;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('검색에 실패했습니다');
            }
            const books = await response.json();
            this.displayBooks(books);
        } catch (error) {
            console.error('검색 에러:', error);
            this.showErrorMessage('검색 실패: ' + error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // 도서 삭제
    async deleteBook(id) {
        if (!confirm('정말로 이 도서를 삭제하시겠습니까?')) {
            return;
        }
        
        try {
            this.showLoading('도서 삭제 중...');
            const response = await fetch(`${this.API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('도서 삭제에 실패했습니다');
            }
            
            this.showSuccessMessage('도서가 성공적으로 삭제되었습니다!');
            this.loadAllBooks();
        } catch (error) {
            console.error('삭제 에러:', error);
            this.showErrorMessage('도서 삭제 실패: ' + error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // 도서 수정 - 모달 열기
    async editBook(id) {
        try {
            this.showLoading('도서 정보 로딩 중...');
            const response = await fetch(`${this.API_BASE_URL}/${id}`);
            if (!response.ok) {
                throw new Error('도서 정보를 가져오는데 실패했습니다');
            }
            const book = await response.json();
            
            // 모달에 도서 데이터 입력
            document.getElementById('editId').value = book.id;
            document.getElementById('editTitle').value = book.title;
            document.getElementById('editAuthor').value = book.author;
            document.getElementById('editIsbn').value = book.isbn;
            document.getElementById('editPrice').value = book.price || '';
            document.getElementById('editPublishDate').value = book.publishDate || '';
            
            // 모달 표시
            this.editModal.style.display = 'block';
        } catch (error) {
            console.error('수정용 도서 로드 에러:', error);
            this.showErrorMessage('도서 정보 불러오기 실패');
        } finally {
            this.hideLoading();
        }
    },
    
    // 도서 수정
    async handleUpdateBook(e) {
        e.preventDefault();
        
        const id = document.getElementById('editId').value;
        const title = document.getElementById('editTitle').value.trim();
        const author = document.getElementById('editAuthor').value.trim();
        const isbn = document.getElementById('editIsbn').value.trim();
        const price = document.getElementById('editPrice').value;
        const publishDate = document.getElementById('editPublishDate').value;
        
        if (!this.validateBookForm(title, author, isbn)) {
            return;
        }
        
        try {
            this.showLoading('도서 수정 중...');
            const updateData = {
                title,
                author,
                isbn,
                price: price ? parseInt(price) : null,
                publishDate: publishDate || null
            };
            
            const response = await fetch(`${this.API_BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || '도서 수정에 실패했습니다');
            }
            
            this.closeModal();
            this.showSuccessMessage('도서가 성공적으로 수정되었습니다!');
            this.loadAllBooks();
        } catch (error) {
            console.error('수정 에러:', error);
            this.showErrorMessage('도서 수정 실패: ' + error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // 모달 메서드들
    closeModal() {
        this.editModal.style.display = 'none';
    },
    
    // 유틸리티 메서드들
    escapeHtml(text) {
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
    }
};

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    BookManager.init();
});

// onclick 핸들러를 위해 BookManager를 전역으로 접근 가능하게 만들기
window.BookManager = BookManager;