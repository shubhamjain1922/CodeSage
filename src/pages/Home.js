// src/Home.js
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import styles from "../css/Home.module.css";
import Leaderboard from "../components/Leaderboard";
import { QUESTION_STATUS, QUESTION_TYPES } from "../utils/constants";
import QuestionTable from "../components/QuestionTable";
import Filters from "../components/Filters";
import GenerateQuestionModal from "../components/GenerateQuestionModal";
import { db } from "../utils/Firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/spinner";

const Home = () => {
  const navigate = useNavigate();
  const [questionType, setQuestionType] = useState(QUESTION_TYPES[0].value);
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState("");
  const [questionData, setQuestionData] = useState([]);
  const [finalQuestionData, setFinalQuestionData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getFilteredDocuments = async () => {
    setIsLoading(true);
    let questionDoc = query(collection(db, "questions"));
    if (questionType) {
      questionDoc = query(
        questionDoc,
        where("questionType", "==", questionType)
      );
    }

    if (language) {
      questionDoc = query(questionDoc, where("language", "==", language));
    }

    if (difficulty) {
      questionDoc = query(questionDoc, where("difficulty", "==", difficulty));
    }

    try {
      const querySnapshot = await getDocs(questionDoc);
      const questionIds = [];

      let data = querySnapshot.docs.map((doc) => {
        questionIds.push(doc.id);
        return {
          ...doc.data(),
          id: doc.id,
        };
      });

      let attemptsDoc = query(
        collection(db, "attempts"),
        where("userId", "==", user.id)
      );
      if (questionIds.length) {
        attemptsDoc = query(attemptsDoc, where("questionId", "in", questionIds));
      }
      const attemptsQuerySnapshot = await getDocs(attemptsDoc);
      const attemptsData = {};
      attemptsQuerySnapshot.docs.forEach((doc) => {
        const attemptData = doc.data();
        attemptsData[attemptData.questionId] = true;
      });
      data.forEach((item) => {
        item.attempted = attemptsData[item.id];
      });
      if (status) {
        data = data.filter((item) => {
          if (status === QUESTION_STATUS[0].value) {
            return !item.attempted;
          }
          return item.attempted;
        });
      }
      setQuestionData(data);
      setFinalQuestionData(data);
      setIsLoading(false);
    } catch (error) {
      alert("Error getting documents: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFilteredDocuments();
  }, [questionType, difficulty, language]);

  const handleCardClick = (type) => () => {
    setQuestionType(type);
    setDifficulty("");
    setLanguage("");
    setStatus("");
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleStatusChange = (event) => {
    setIsLoading(true);
    if (event.target.value) {
      const data = finalQuestionData.filter((item) => {
        if (event.target.value === QUESTION_STATUS[0].value) {
          return !item.attempted;
        }
        return item.attempted;
      });
      setQuestionData(data);
    } else {
      setQuestionData(finalQuestionData);
    }
    setStatus(event.target.value);
    setIsLoading(false);
  };

  const handleGenerateNewQuestion = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleQuestionClick = (id) => () => {
    navigate(`/question/${id}`);
  };

  return (
    <div>
      <Navbar />
      <div className={[styles.body, styles.flexRow].join(" ")}>
        <div className={styles.leftPanel}>
          <div className={[styles.cardContainer, styles.flexRow].join(" ")}>
            {QUESTION_TYPES.map((type, index) => (
              <div
                key={type.value}
                onClick={handleCardClick(type.value)}
                className={[
                  styles.card,
                  index === 0 ? styles.prodCode : styles.debug,
                ].join(" ")}
              >
                <div
                  className={[
                    styles.overlay,
                    questionType === type.value && styles.selected,
                  ].join(" ")}
                >
                  <p>{type.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.header}>
            <div className={styles.filterContainer}>
              <Filters
                language={language}
                handleLanguageChange={handleLanguageChange}
                difficulty={difficulty}
                handleDifficultyChange={handleDifficultyChange}
                status={status}
                handleStatusChange={handleStatusChange}
              />
            </div>
            <button
              onClick={handleGenerateNewQuestion}
              className={styles.generateQuestion}
            >
              Generate Question
            </button>
          </div>
          {
            isLoading ?
            <Spinner className={styles.customSpinner} />
            :
          <QuestionTable
            questionData={questionData}
            handleQuestionClick={handleQuestionClick}
          />
          }
        </div>
        <div className={styles.rightPanel}>
          <Leaderboard />
        </div>
      </div>
      {modalOpen && (
        <GenerateQuestionModal
          handleCloseModal={handleCloseModal}
          language={language}
          difficulty={difficulty}
          questionType={questionType}
        />
      )}
    </div>
  );
};

export default Home;
