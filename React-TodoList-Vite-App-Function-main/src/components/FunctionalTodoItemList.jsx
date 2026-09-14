import { memo } from 'react';
import PropTypes from 'prop-types';
import FunctionalTodoItem from './FunctionalTodoItem';

const FunctionalTodoItemList = ({ myTodos, myToggle, myRemove }) => {
  const todoList = myTodos.map(
    ({ id, text, checked }) => (
      <FunctionalTodoItem
        id={id}
        text={text}
        checked={checked}
        onToggle={myToggle}
        onRemove={myRemove}
        key={id}
      />
    )
  );

  return (
    <div>
      {todoList}
    </div>
  );
};

FunctionalTodoItemList.propTypes = {
  myTodos: PropTypes.array,
  myToggle: PropTypes.func,
  myRemove: PropTypes.func
};

// memo를 사용하여 shouldComponentUpdate 대체
// myTodos가 변경될 때만 리렌더링
export default memo(
  FunctionalTodoItemList,
  (prevProps, nextProps) => prevProps.myTodos === nextProps.myTodos
);