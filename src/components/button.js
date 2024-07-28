import styles from '../css/Button.module.css';
import Spinner from './spinner';

const Button = (props) => {
const {
    text = 'Submit',
    disabled = false,
    loading = false,
    loadingText = '',
} = props || {};
  return (
    <button className={styles.button} disabled={disabled} type="submit" {...props}>{loading ? <>
    <Spinner /> &nbsp;
    {loadingText}
    </>
    : text}</button>
  );
};

export default Button;
