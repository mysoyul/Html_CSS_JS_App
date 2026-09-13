# student_react_router_axios

`student_react_first` 에 **Axios** 와 **React Router** 를 적용한 것입니다.
하는 일은 같고, 서버를 부르는 방법과 화면을 나누는 방법만 달라졌습니다.

## 실행

```bash
npm install
npm run dev
```

Spring Boot 서버가 `http://localhost:8080` 에서 돌고 있어야 합니다.

## 주소 구성

| 주소 | 화면 | 맡는 파일 |
| --- | --- | --- |
| `/` | 학생 목록 | `pages/StudentListPage.jsx` |
| `/new` | 학생 등록 | `pages/StudentFormPage.jsx` |
| `/edit/:id` | 학생 수정 | `pages/StudentFormPage.jsx` |
| 그 밖 | 없는 주소 안내 | `pages/NotFoundPage.jsx` |

등록과 수정이 한 파일인 이유는 화면이 거의 같기 때문입니다.
주소에 `id` 가 있으면 수정, 없으면 등록입니다.

## 5부에서 달라진 것

### Axios

| | 5부 (fetch) | 6부 (axios) |
| --- | --- | --- |
| 요청 | `fetch(url, options)` | `client.get(path)` |
| 실패 확인 | `if (!response.ok)` 직접 | axios 가 스스로 오류를 던진다 |
| 본문 꺼내기 | `await response.json()` | `response.data` |
| 보낼 때 | `JSON.stringify(body)` | 객체를 그대로 넘긴다 |
| 헤더 | 함수마다 적음 | `client.js` 에서 한 번 |
| 오류 메시지 | `request()` 안에서 처리 | 가로채기(interceptor)가 처리 |

`api/client.js` 가 새로 생겼고, `api/studentApi.js` 의 함수들이 두 줄로 줄었습니다.

### React Router

`editingId` state 가 사라졌습니다. "몇 번 학생을 수정 중인가" 를 **주소가** 알고 있기 때문입니다.
덕분에 수정 화면에서 새로고침을 해도 그 학생의 수정 화면이 그대로 뜹니다.

| 5부 | 6부 |
| --- | --- |
| `const [editingId, setEditingId] = useState(null)` | `const { id } = useParams()` |
| `onClick={() => onEdit(id)}` | `<Link to={'/edit/' + id}>` |
| 등록 후 `loadStudents()` 를 직접 다시 부름 | `/` 로 옮겨 가면 목록 페이지가 새로 붙어 저절로 다시 부름 |
| 목록과 폼이 한 화면 | 페이지가 나뉨 |

머리말에는 `NavLink` 로 만든 내비게이션이 있습니다. `Link` 와 같지만
지금 보고 있는 주소와 맞으면 `className` 에 `isActive` 가 `true` 로 들어와서
"지금 여기 있다" 를 표시할 수 있습니다.

`/` 에 `end` 를 붙인 이유가 있습니다. 붙이지 않으면 `/new` 나 `/edit/3` 에서도
`/` 가 맞는 것으로 보아 두 링크가 동시에 표시됩니다.

## 그대로 쓰는 파일

`lib/validation.js` 와 `lib/studentData.js` 는 한 줄도 고치지 않았습니다.
값만 다루는 코드는 통신 방법이나 화면 구조가 바뀌어도 영향을 받지 않습니다.

## 배포할 때 주의할 점

주소를 여러 개 쓰므로, 서버가 `/edit/3` 같은 주소에도 `index.html` 을 돌려주도록
설정해야 합니다. 그러지 않으면 그 주소로 새로고침할 때 404 가 납니다.
`npm run preview` 는 이 설정이 되어 있습니다.
