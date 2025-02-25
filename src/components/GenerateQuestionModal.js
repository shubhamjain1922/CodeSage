// src/components/GenerateQuestionModal.js
import React, { useState } from "react";
import styles from "../css/GenerateQuestionModal.module.css";
import {
  QUESTION_DIFFICULTY,
  QUESTION_LANGUAGES,
  QUESTION_TYPES,
} from "../utils/constants";
import Button from "./button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prompt from "../utils/prompt";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";
import CryptoJS from 'crypto-js';
import { useNavigate } from "react-router-dom";

const GenerateQuestionModal = (props) => {
  const navigate = useNavigate();
  const [questionType, setQuestionType] = useState(props.questionType || "");
  const [difficulty, setDifficulty] = useState(props.difficulty || "");
  const [language, setLanguage] = useState(props.language || "");
  const [isLoading, setIsLoading] = useState(false);
  const [processStep, setProcessStep] = useState('Generate');

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleGenerateQuestion = async (e) => {
    e.preventDefault();
    if (!difficulty || !language || !questionType) {
      return
    }
    setProcessStep('Initializing question generation process...');
    
    try {
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
      const command = prompt({difficulty, language, questionType});
      setProcessStep('Considering parameters for content generation...');
      const result = await model.generateContent(command);
  
      setProcessStep('Processing question...');
      const response = result.response;
      const jsonString = response.text();
      const startIndex = jsonString.indexOf('{');
      const endIndex = jsonString.lastIndexOf('}');
  
      if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const jsonObjectString = jsonString.substring(startIndex, endIndex + 1);
        const questionObj = {
          ...JSON.parse(jsonObjectString),
          language,
          questionType,
          difficulty,
        };
        const hash = CryptoJS.SHA256(JSON.stringify(questionObj)).toString(CryptoJS.enc.Hex);
        await setDoc(doc(db, 'questions', hash), questionObj);
        setIsLoading(false);
        setProcessStep('Generate');
        navigate(`/question/${hash}`)
      }
  
      setIsLoading(false);
      setProcessStep('Generate');
    } catch (error) {
      console.error("Error evaluating code:", error);
      setIsLoading(false);
      setProcessStep('Generate');
    }
  };
  

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.closeIcon} onClick={props.handleCloseModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.closeIcon}
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h2>Generate Question</h2>
        <form onSubmit={handleGenerateQuestion}>
          <div className={styles.modalForm}>
            <div className={styles.dropdownContainer}>
              <label htmlFor="questionType">Question Type:</label>
              <select
                id="questionType"
                onChange={(e) => setQuestionType(e.target.value)}
                value={questionType}
                className={styles.dropdown}
                required
              >
                {QUESTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.dropdownContainer}>
              <label htmlFor="difficulty">Difficulty:</label>
              <select
                id="difficulty"
                onChange={handleDifficultyChange}
                value={difficulty}
                className={styles.dropdown}
                required
              >
                <option value="" disabled>
                  Select Difficulty Level
                </option>
                {QUESTION_DIFFICULTY.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.dropdownContainer}>
              <label htmlFor="language">Language:</label>
              <select
                id="language"
                onChange={handleLanguageChange}
                value={language}
                className={styles.dropdown}
                required
              >
                <option value="" disabled>
                  Select Language
                </option>
                {QUESTION_LANGUAGES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button
            loading={isLoading}
            text={processStep}
            disabled={!questionType || !language || !difficulty}
            loadingText={processStep}
          />
        </form>
      </div>
    </div>
  );
};

export default GenerateQuestionModal;
