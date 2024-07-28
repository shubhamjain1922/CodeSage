import styles from '../css/QuestionTable.module.css';
import { FaCheck } from 'react-icons/fa';

const QuestionTable = ({questionData = [], handleQuestionClick}) => {

  if (!questionData?.length) {
    return <div className={styles.empty}>No Questions found. But you can create one by clicking Generate Question!!</div>
  }

  return (
    <table className={styles.questionTable}>
    <thead>
      <tr>
        <th>Status</th>
        <th>Title</th>
        <th>Language</th>
        <th>Difficulty</th>
      </tr>
    </thead>
    <tbody>
      {questionData.map((entry, index) => (
        <tr key={'question' + index} onClick={handleQuestionClick(entry.id)}>
          <td>{entry.attempted && <FaCheck className={styles.checkIcon} />}</td>
          <td className={styles.nameColumn}>{entry.question_statement}</td>
          <td className={styles.infoColumn}>{entry.language}</td>
          <td className={styles.infoColumn}>{entry.difficulty_level}</td>
        </tr>
      ))}
    </tbody>
  </table>
  );
};

export default QuestionTable;
