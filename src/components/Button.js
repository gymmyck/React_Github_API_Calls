import "../styles.css";

const Button = ({ text, handleClear }) => {
  return <button onClick={handleClear}>{text}</button>;
};

export default Button;

const RemoveButton = ({ text, handleRemove }) => {
  return <button onClick={handleRemove}>{text}</button>;
};

export { RemoveButton };
