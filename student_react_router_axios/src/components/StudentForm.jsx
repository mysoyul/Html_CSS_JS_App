/* ---------------------------------------------------------
   학생 등록 · 수정 폼
   5부에서 쓰던 것을 거의 그대로 가져왔습니다. 입력칸의 값이
   DOM 이 아니라 부모가 준 form 객체에서 온다는 점도 같습니다.

     화면에 보이는 값 = props.form
     값이 바뀌면      = props.onChange 로 부모에게 알린다

   달라진 것은 containerRef 가 없어진 것뿐입니다. 5부에서는
   목록과 폼이 한 화면에 있어서 수정 버튼을 누르면 폼으로
   스크롤해야 했지만, 이제는 폼이 아예 다른 페이지이기 때문입니다.
   --------------------------------------------------------- */

import MessageBox from "./MessageBox.jsx";

/* 입력칸 한 개를 그리는 작은 컴포넌트 — 실습 5-12 에서 만든 것 그대로다.
   여섯 칸에서 달라지는 것은 name · label · type · required 네 가지뿐이라,
   그것만 밖에서 받는다. value 와 onChange 는 받은 것을 그대로 넘긴다.

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
                onChange={onChange}
            />
        </div>
    );
}

/* 부모(StudentFormPage)가 넘겨주는 값들
     form       화면에 보일 입력값
     isEditing  수정 모드인가 (주소에 id 가 있으면 true)
     message    폼 아래 보여 줄 메시지
     onChange   한 칸이 바뀔 때 부를 함수
     onSubmit   제출할 때 부를 함수
     onCancel   취소를 누를 때 부를 함수 */
function StudentForm({ form, isEditing, message, onChange, onSubmit, onCancel }) {
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
        <div className={containerClass}>
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

                    {/* 등록이든 수정이든 목록으로 돌아갈 길이 필요하므로
                        6부에서는 취소 버튼을 언제나 보여 준다. */}
                    <button type="button" className="cancel-btn" onClick={onCancel}>
                        취소
                    </button>

                    <MessageBox message={message} />
                </div>
            </form>
        </div>
    );
}

export default StudentForm;
