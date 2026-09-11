/* ---------------------------------------------------------
   학생 등록 · 수정 폼
   4부까지는 폼이 index.html 에 있었고, ui/studentForm.js 가
   그 요소를 찾아 값을 읽고 쓰고 버튼 글자를 바꿨습니다.

   React 에서는 폼이 이 파일 안에 있습니다. 그리고 입력칸의
   값은 DOM 이 아니라 부모가 준 form 객체에서 옵니다.

     화면에 보이는 값 = props.form
     값이 바뀌면      = props.onChange 로 부모에게 알린다

   이런 입력을 제어 컴포넌트(controlled component)라고 합니다.
   이 컴포넌트는 값을 저장하지 않습니다. 그리기만 합니다.
   --------------------------------------------------------- */

import MessageBox from "./MessageBox.jsx";

/* 입력칸 한 개를 그리는 작은 컴포넌트.
   여섯 칸이 생김새가 같으므로 한 번만 만들어 두고 여섯 번 쓴다.
   컴포넌트 이름은 반드시 대문자로 시작해야 한다.
   소문자로 쓰면 React 가 <div> 같은 HTML 태그로 본다. */
function Field({ name, label, type, required, value, onChange }) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}:</label>
            <input
                id={name}
                name={name}
                type={type}
                required={required}
                value={value}
                // 값이 바뀌면 부모에게 알린다. 저장은 부모가 한다.
                onChange={(event) => onChange(name, event.target.value)}
            />
        </div>
    );
}

/* 부모(App)가 넘겨주는 값들
     form         화면에 보일 입력값
     isEditing    수정 모드인가
     message      폼 아래 보여 줄 메시지
     onChange     한 칸이 바뀔 때 부를 함수
     onSubmit     제출할 때 부를 함수
     onCancel     취소를 누를 때 부를 함수
     containerRef 수정 시 이 위치로 스크롤하기 위한 참조 */
function StudentForm({ form, isEditing, message, onChange, onSubmit, onCancel, containerRef }) {
    // 4부 setEditMode 가 classList.toggle 로 하던 일을 문자열로 표현한다.
    let containerClass = "form-container";
    if (isEditing) {
        containerClass = "form-container editing";
    }

    // 등록 모드와 수정 모드에서 글자만 달라진다.
    let actionLabel = "등록";
    if (isEditing) {
        actionLabel = "수정";
    }

    return (
        <div className={containerClass} ref={containerRef}>
            <h2>학생 {actionLabel}</h2>

            {/* onSubmit 안에서 event.preventDefault() 를 부르는 것은 4부와 같다. */}
            <form onSubmit={onSubmit}>
                <div className="form-grid">
                    <Field name="name" label="이름" type="text" required={true}
                           value={form.name} onChange={onChange} />
                    <Field name="studentNumber" label="학번" type="text" required={true}
                           value={form.studentNumber} onChange={onChange} />
                    <Field name="address" label="주소" type="text" required={true}
                           value={form.address} onChange={onChange} />
                    <Field name="phoneNumber" label="전화번호" type="tel" required={true}
                           value={form.phoneNumber} onChange={onChange} />
                    <Field name="email" label="이메일" type="email" required={true}
                           value={form.email} onChange={onChange} />
                    <Field name="dateOfBirth" label="생년월일" type="date" required={false}
                           value={form.dateOfBirth} onChange={onChange} />
                </div>

                <div className="button-group">
                    <button type="submit">학생 {actionLabel}</button>

                    {/* 4부에서는 style.display 를 바꿨지만, 여기서는 아예 그리지 않는다.
                        조건 && 화면 은 "조건이 참일 때만 그린다"는 뜻이다. */}
                    {isEditing && (
                        <button type="button" className="cancel-btn" onClick={onCancel}>
                            취소
                        </button>
                    )}

                    <MessageBox message={message} />
                </div>
            </form>
        </div>
    );
}

export default StudentForm;
