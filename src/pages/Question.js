import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { db } from "../utils/Firebase";
import {
  addDoc,
  collection,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../css/Question.module.css";
import { Editor } from "@monaco-editor/react";
import Button from "../components/button";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/spinner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { submissionPrompt } from "../utils/submissionPrompt";
import { useModal } from "../context/ModalContext";

const Question = () => {
  const navigate = useNavigate();
  const { id: questionId } = useParams();
  const [questionData, setQuestionData] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [attemptData, setAttemptData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const {setIsLoginOpen} = useModal();

  const getQuestionData = async () => {
    try {
      const questionDocRef = doc(db, "questions", questionId);
      const docSnap = await getDoc(questionDocRef);

      if (docSnap.exists()) {
        const data = { ...docSnap.data(), id: questionId };
        setUserCode(data.code);
        setQuestionData(data);
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error getting documents: ", error);
      navigate("/home");
    }
  };

  const getAttemptData = async () => {
    try {
      if (!user || !user.id) {
        return;
      }
      let attemptsDoc = query(
        collection(db, "attempts"),
        where("userId", "==", user.id),
        where("questionId", "==", questionId)
      );
      const attemptsQuerySnapshot = await getDocs(attemptsDoc);
      attemptsQuerySnapshot.docs.forEach((doc) => {
        setAttemptData(doc.data());
        setUserCode(doc.data().code);
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
      navigate("/home");
    }
  };

  useEffect(() => {
    getQuestionData();
  }, [questionId]);

  useEffect(() => {
    getAttemptData();
  }, [user, questionId]);

  const submitCode = async () => {
    try {
      if (!user || !user.id) {
        setIsLoginOpen(true);
        return;
      }
      setIsLoading(true);
  
      // Initialize AI model
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        tools: [
          {
            codeExecution: {},
          },
        ],
      });
  
      // Generate prompt for the AI
      const command = submissionPrompt({questionData, userCode});
      const result = await model.generateContent(command);

      const response = result.response;
      const jsonString = response.text();
      const startIndex = jsonString.indexOf('{');
      const endIndex = jsonString.lastIndexOf('}');
  
      if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const jsonObjectString = jsonString.substring(startIndex, endIndex + 1);
        const {score = 0, total = 5} = JSON.parse(jsonObjectString) || {};
        const attemptData = {
          code: userCode,
          questionId,
          score,
          total,
          userId: user.id,
        };
        const questionsCollectionRef = collection(db, 'attempts');
        await addDoc(questionsCollectionRef, attemptData);
        setAttemptData(attemptData);
        const userDocRef = doc(db, 'users', user.id);
        await updateDoc(userDocRef, {
          score: score+user.score,
        });
        setIsLoading(false);
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error("Error evaluating code:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.body}>
        {
          !questionData ?
<Spinner className={styles.customSpinner} />
          :
        <div className={styles.flexRow}>
          <div className={styles.leftPanel}>
            <div className={styles.tagContainer}>
              <div>
                Question Type:{" "}
                <span className={styles.tag}>{questionData.questionType}</span>
              </div>
              <div>
                Language:{" "}
                <span className={styles.tag}>{questionData.language}</span>
              </div>
              <div>
                Difficulty:{" "}
                <span className={styles.tag}>
                  {questionData.difficulty_level}
                </span>
              </div>
            </div>
            <p className={styles.title}>{questionData.question_statement}</p>
            <Editor
              height="70%"
              language={questionData.language || ""}
              value={questionData.code}
              theme="vs-dark"
              options={{
                minimap: {
                  enabled: false,
                },
                scrollBeyondLastLine: false,
                padding: {
                  top: 10,
                  bottom: 10,
                },
                readOnly: true,
                automaticLayout: true,
              }}
            />
          </div>
          <div className={styles.rightPanel}>
            <div className={styles.editorContainer}>
              <Editor
                height="100%"
                language={questionData.language || ""}
                value={userCode}
                onChange={(value) => setUserCode(value)}
                theme="vs-dark"
                options={{
                  minimap: {
                    enabled: false,
                  },
                  scrollBeyondLastLine: false,
                  padding: {
                    top: 10,
                    bottom: 10,
                  },
                  readOnly: !!attemptData,
                }}
              />
            </div>
            {attemptData ? <div className={styles.footerCompleted}>
                <p className={styles.attemptHead}>Attempt Completed</p>
                <p className={styles.score}>{attemptData?.score}/{attemptData?.total}</p>
                {
                  questionData?.parameters?.issues ? 
                  <div className={styles.issues}>
                    <p className={styles.compSecHeading}>Issues</p>
                    <ul>
                    {
                      questionData?.parameters?.issues.map((item, index) => (
                        <li key={'issue'+index} className={styles.issueItem}>
                          <p>{item}</p>
                        </li>
                      ))
                    }
                    </ul>
                    </div>
                    : null
                }
                {
                  questionData?.parameters?.suggestions ? 
                  <div className={styles.suggestions}>
                    <p className={styles.compSecHeading}>Suggestions</p>
                    <ul>
                    {
                      questionData?.parameters?.suggestions.map((item, index) => (
                        <li key={'suggestion'+index} className={styles.issueItem}>
                          <p>{item}</p>
                        </li>
                      ))
                    }
                    </ul>
                    </div>
                    : null
                }
            </div> : (
              <div className={styles.footer}>
                <AiOutlineInfoCircle className={styles.infoIcon} />
                <span className={styles.warningText}>
                  Be careful, you can submit only once!
                </span>
                <div className={styles.buttonContainer}>
                  <Button onClick={submitCode} loading={isLoading} />
                </div>
              </div>
            )}
          </div>
        </div>
        }
      </div>
    </div>
  );
};

export default Question;
