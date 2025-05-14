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
1. step1 - html 만 작성
2. step2 - form 내부의 input 과 table 에 CSS 추가
3. step3 - input 을 class가 form-group, form-grid인 div 로 감싸준다.
4. step4 - form-group, form-grid css 를 추가한다.
5. step5 - table에 id=studentTable, tbody에 id="studentTableBody" 추가한다.
6. step6 
    - javascript DOMContentLoaded 이벤트 처리추가
    - style code를 main.css로 분리함
7. step7 
    - 입력항목 체크하는 js 추가
    - input 엘리먼트에 required 속성 제거함
8. step8
    - js에 서버와 통신하는 fetch 함수추가
    - table에 목록 출력하기
    - get api/students 호출하기
9. step9
    - student 등록
    - post api/students 호출하기    
10. step10
    - student 삭제
    - delete api/students 호출하기    
11. step11
    - student 수정처리를 하기 위한 첫번째 단계
12. step12
    - student 수정처리를 하기 위한 두번째 단계
    


