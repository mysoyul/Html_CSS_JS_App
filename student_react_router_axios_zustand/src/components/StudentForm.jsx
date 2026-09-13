/* ---------------------------------------------------------
   학생 등록 · 수정 폼
   5부에서 쓰던 것을 거의 그대로 가져왔습니다. 입력칸의 값이
   DOM 이 아니라 부모가 준 form 객체에서 온다는 점도 같습니다.

     화면에 보이는 값 = props.form
     값이 바뀌면      = props.onChange 로 부모에게 알린다

   7부에서 message props 도 없어졌습니다. 메시지가 store 로 옮겨가
   화면 위쪽의 AppMessage 가 한 번만 그리기 때문입니다.
   이 컴포넌트는 이제 폼만 그립니다.
   --------------------------------------------------------- */

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

/* 부모(StudentFormPage)가 넘겨주는 값들
     form       화면에 보일 입력값
     isEditing  수정 모드인가 (주소에 id 가 있으면 true)
     onChange   한 칸이 바뀔 때 부를 함수
     onSubmit   제출할 때 부를 함수
     onCancel   취소를 누를 때 부를 함수 */
function StudentForm({ form, isEditing, onChange, onSubmit, onCancel }) {
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
                </div>
            </form>
        </div>
    );
}

export default StudentForm;
