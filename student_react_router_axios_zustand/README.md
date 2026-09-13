# student_react_router_axios_zustand

`student_react_router_axios` 에 **Zustand** 를 적용한 것입니다.
하는 일은 같고, 여러 페이지가 함께 보는 값을 두는 자리만 달라졌습니다.

## 실행

```bash
npm install
npm run dev
```

Spring Boot 서버가 `http://localhost:8080` 에서 돌고 있어야 합니다.

## 무엇이 달라졌나

이전 단계에서는 `students`, `loading`, `listError`, `message` 를
`StudentListPage` 안의 `useState` 에 두었습니다. 그래서 두 가지가 불편했습니다.

**하나.** 목록 페이지를 떠났다 돌아오면 값이 사라져 서버를 매번 다시 불렀습니다.

**둘.** 등록 성공 문구를 목록 페이지로 나르려고 라우터에 실어 보내야 했습니다.

```jsx
// 이전 — 보내는 쪽
navigate("/", { state: { message: "등록되었습니다." } });

// 이전 — 받는 쪽
const location = useLocation();
const [message, setMessage] = useState(
    location.state?.message ? { text: location.state.message, type: "success" } : null
);
```

Zustand 를 넣으면 둘 다 사라집니다. store 는 컴포넌트 트리 밖에 있어서
페이지가 바뀌어도 살아 있고, 어느 컴포넌트든 직접 꺼내 쓸 수 있습니다.

```jsx
// 지금 — 넣는 쪽은 store 에 넣기만 한다
showSuccess("등록되었습니다.");

// 지금 — 보여 주는 쪽은 store 에서 꺼내기만 한다
const message = useStudentStore((s) => s.message);
```

## store 에 둔 것과 두지 않은 것

| 값 | 어디에 | 이유 |
| --- | --- | --- |
| `students` | store | 목록 페이지와 폼 페이지가 함께 본다 |
| `loading`, `listError` | store | 목록을 불러오는 일과 한 몸이다 |
| `message` | store | 어느 페이지에서 넣든 한곳에서 보여 준다 |
| `form` (입력 중인 값) | 폼 페이지의 `useState` | 그 화면에서만 쓰고 버린다 |
| `loading` (폼의 불러오기) | 폼 페이지의 `useState` | 목록의 로딩과 다른 값이다 |

**모든 값을 store 에 넣지 않습니다.** 한 화면에서만 쓰는 값은 그 화면에 두는 편이
읽기 쉽습니다.

## 파일 구성

| 파일 | 하는 일 |
| --- | --- |
| `store/studentStore.js` | 값과 그 값을 바꾸는 함수 (새로 생김) |
| `components/AppMessage.jsx` | 화면 위쪽 메시지 한 줄과 3초 타이머 (새로 생김) |
| `pages/StudentListPage.jsx` | `useState` 가 한 줄도 없어짐 |
| `pages/StudentFormPage.jsx` | 저장은 store 에 맡기고, `form` 만 직접 들고 있음 |
| `components/StudentForm.jsx` | `message` props 가 없어짐 |
| `App.jsx` | `AppMessage` 를 `Routes` 바깥에 둠 |

## 선택자를 쓰는 이유

```jsx
// 좋지 않다 — loading 이 바뀌어도 이 컴포넌트가 다시 그려진다
const store = useStudentStore();

// 이렇게 — students 가 바뀔 때만 다시 그려진다
const students = useStudentStore((s) => s.students);
```

괄호 안의 함수를 선택자(selector)라고 합니다. 필요한 조각만 꺼내면
상관없는 값이 바뀔 때 다시 그려지지 않습니다.

## 그대로 쓰는 파일

`api/`, `lib/`, `config.js` 는 한 줄도 고치지 않았습니다.
서버를 부르는 일과 값을 다루는 일은 상태를 어디에 두든 달라지지 않기 때문입니다.
