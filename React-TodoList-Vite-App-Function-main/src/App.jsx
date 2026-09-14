import { useState } from 'react';
import FunctionalTodoItemList from './components/FunctionalTodoItemList';
import FuctionalTodoListTemplate from './components/FuntionalTodoListTemplate';
import FunctionalForm from './components/FuctionalForm';

const App = () => {
  // useState 훅을 사용하여 상태 관리
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([
      { id: 0, text: '함수형 소개', checked: false },
      { id: 1, text: '함수형 구조', checked: true },
      { id: 2, text: '함수형 사용', checked: false }
    ]);
  const [nextId, setNextId] = useState(3); // 이미 0,1,2 가 존재하므로 3으로 설정

  // 이벤트핸들러 함수 선언
  const handleChange = (e) => {
    setTodo(e.target.value); // input field의 다음 바뀔 값
  };

  const handleCreate = () => {
    const newTodo = {
      id: nextId,
      text: todo,
      checked: false
    };

    setTodos([...todos, newTodo]);
    setTodo(''); // input 초기화
    setNextId(nextId + 1);
  };

  const handleEnter = (e) => {
    // 눌려진 키가 Enter Key 이면 handleCreate 호출
    if (e.keyCode === 13) {
      handleCreate();
    }
  };

  const handleToggle = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  const handleRemove = (id) => {
    setTodos(
      todos.filter(todo => todo.id !== id)
    );
  };

  return (
    <FuctionalTodoListTemplate 
      form={
        <FunctionalForm
          myTodo={todo}
          myEnter={handleEnter}
          myChange={handleChange}
          myCreate={handleCreate} 
        />
      }
    >
      <FunctionalTodoItemList 
        myTodos={todos} 
        myToggle={handleToggle}
        myRemove={handleRemove}
      />
    </FuctionalTodoListTemplate>
  );
};
export default App;