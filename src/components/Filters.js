import styles from "../css/Filters.module.css";
import {
  QUESTION_DIFFICULTY,
  QUESTION_LANGUAGES,
  QUESTION_STATUS,
} from "../utils/constants";

const Filters = (props) => {
  const {language, handleLanguageChange, difficulty, handleDifficultyChange, status, handleStatusChange} = props;
  return (
    <>
      <div className="dropdown-container">
        <select
          onChange={handleLanguageChange}
          value={language}
          id="difficulty"
          className={styles.dropdown}
        >
          <option value="">Select Language</option>
          {QUESTION_LANGUAGES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="dropdown-container">
        <select
          onChange={handleDifficultyChange}
          value={difficulty}
          id="difficulty"
          className={styles.dropdown}
        >
          <option value="">Select Difficulty Level</option>
          {QUESTION_DIFFICULTY.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="dropdown-container">
        <select
          onChange={handleStatusChange}
          value={status}
          id="status"
          className={styles.dropdown}
        >
          <option value="">Select Status</option>
          {QUESTION_STATUS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Filters;
