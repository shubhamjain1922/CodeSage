import '../css/Button.css';
import Spinner from './spinner';

const Button = (props) => {
const {
    text = 'Submit',
    disabled = false,
    loading = false,
} = props || {};
  return (
    <button disabled={disabled} type="submit">{loading ? <Spinner /> : text}</button>
  );
};

export default Button;
