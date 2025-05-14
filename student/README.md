### 주요 기능:
* 학생 등록 (이름, 학번, 주소, 전화번호, 이메일, 생년월일)
* 학생 목록 조회
* 학생 정보 수정
* 학생 삭제
* 입력 데이터 유효성 검사
* Ajax 통신을 통한 REST API 호출
* 사용자 친화적인 UI/UX

#### 사용된 기술:
* HTML5: 구조적인 마크업
* CSS3: 반응형 레이아웃과 스타일링
* JavaScript (ES6+): 동적 기능과 API 통신

#### 주요 특징:
* 점진적 개발 방식으로 단계별 완성
* 에러 처리 및 사용자 피드백
* 로딩 상태 표시
* 수정 모드와 등록 모드 전환
* 입력 필드별 실시간 유효성 검사

#### 각 Step 별 기능:
* step1 - html 만 작성
* step2 - form 내부의 input 과 table 에 CSS 추가
* step3 
    * - input 을 class가 form-group, form-grid인 div 로 감싸준다.
    * - form-group, form-grid css 를 추가한다.
    * - table에 id=studentTable, tbody에 id="studentTableBody" 추가한다.
* step4 
    * - javascript DOMContentLoaded 이벤트 처리추가
    * - style code를 main.css로 분리함
* step5 
    * - 입력항목 체크하는 js 추가
    * - 입력한 데이타를 검증하는 validate() 함수 구현하기
* step6
    * - get api/students 서버와 통신하는 loadStudents() fetch 사용
    * - renderStudentTable() table에 목록 출력하기
* step7
    * - studentDat 객체 구조 변경하기 및 validate() 함수 수정
    * - post api/students 서버와 통신하는 createStudent() 함수 구현
* step8
    * - delete api/students/1 student 삭제하는 deleteStudent() 함수 구현
* step9
    * - student 수정하기 전에 데이터 조회 먼저하기
    * - get api/students/1 student 조회하는 editStudent() 함수 구현
* step10
    * - update api/students/1 student 수정처리하는 updateStudent() 함수 구현
    





