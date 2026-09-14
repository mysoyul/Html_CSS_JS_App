import PropTypes from 'prop-types';
import './Form.css';

const FunctionalForm = ({ myTodo, myEnter, myChange, myCreate }) => {
  return (
    <div className="form">
      <input 
        value={myTodo} 
        onChange={myChange}
        onKeyDown={myEnter} 
      />
      <div className="create-button" onClick={myCreate}>
        추가
      </div>
    </div>
  );
};

FunctionalForm.propTypes = {
  myTodo: PropTypes.string,
  myEnter: PropTypes.func,
  myChange: PropTypes.func,
  myCreate: PropTypes.func
};

export default FunctionalForm;