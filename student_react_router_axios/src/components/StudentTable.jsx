/* ---------------------------------------------------------
   학생 목록 표
   5부와 달라진 곳은 수정 버튼 하나뿐입니다.

     5부 : <button onClick={() => onEdit(id)}>수정</button>
     6부 : <Link to={`/edit/${id}`}>수정</Link>

   수정은 "다른 화면으로 옮겨 가는 일" 이므로 Link 가 맞습니다.
   삭제는 옮겨 가지 않고 그 자리에서 하는 일이므로 버튼 그대로입니다.
   --------------------------------------------------------- */

import { Link } from "react-router-dom";

// 표의 열 개수. colSpan 에 쓴다.
const COLUMN_COUNT = 7;

/* 부모(StudentListPage)가 넘겨주는 값들
     students  학생 배열
     loading   불러오는 중인가
     error     목록을 못 불러왔을 때의 메시지 (없으면 null)
     onDelete  삭제 버튼을 눌렀을 때 부를 함수 */
function StudentTable({ students, loading, error, onDelete }) {
    // tbody 안에 무엇을 그릴지 세 경우로 나눠서 정한다.
    function renderRows() {
        // (1) 목록을 못 불러왔다
        if (error) {
            return (
                <tr>
                    <td colSpan={COLUMN_COUNT} className="error-row">{error}</td>
                </tr>
            );
        }

        // (2) 목록이 비었다. 불러오는 중일 때는 안내를 내지 않는다.
        if (students.length === 0 && !loading) {
            return (
                <tr>
                    <td colSpan={COLUMN_COUNT} className="empty-row">등록된 학생이 없습니다.</td>
                </tr>
            );
        }

        // (3) 학생 한 명을 행 하나로 그린다.
        return students.map((student) => (
            <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.studentNumber}</td>
                <td>{student.detail?.address ?? "-"}</td>
                <td>{student.detail?.phoneNumber ?? "-"}</td>
                <td>{student.detail?.email ?? "-"}</td>
                <td>{student.detail?.dateOfBirth ?? "-"}</td>
                <td>
                    {/* to 에 넣은 주소로 옮겨 간다. /edit/3 처럼 만들어진다.
                        주소가 바뀌면 StudentFormPage 가 useParams 로 3 을 읽는다. */}
                    <Link to={`/edit/${student.id}`} className="edit-btn">수정</Link>

                    <button type="button" className="delete-btn"
                            onClick={() => onDelete(student.id)}>삭제</button>
                </td>
            </tr>
        ));
    }

    return (
        <div className="table-container">
            <h2>학생 목록</h2>

            {loading && <div className="loading">로딩 중...</div>}

            <table>
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>학번</th>
                        <th>주소</th>
                        <th>전화번호</th>
                        <th>이메일</th>
                        <th>생년월일</th>
                        <th>액션</th>
                    </tr>
                </thead>
                <tbody>{renderRows()}</tbody>
            </table>
        </div>
    );
}

export default StudentTable;
