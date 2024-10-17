import React, { createContext, useContext, useState } from 'react';
import {postRequest,getRequest,patchRequest} from '../utils/services';
// Create the QuizContext
const QuizContext = createContext();

// Provider component
export const QuizProvider = ({ children }) => {
    const [createdQuizzes,setCreatedQuizzes] = useState([]);
    const [quiz,setQuiz] = useState({});
    const [questions] = useState([
        {
            question: "What is the capital of France?",
            options: ["Paris", "London", "Berlin", "Madrid"],
            selectedOption: null,
        },
        {
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            selectedOption: null,
        },
        {
            question: "What is the color of the sky?",
            options: ["Blue", "Green", "Red", "Yellow"],
            selectedOption: null,
        },
        // Add more questions as needed
    ]);

    const [answers, setAnswers] = useState({});

    // Function to update the selected option for a question
    const selectOption = (questionIndex, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption,
        }));
    };

    const createQuiz = async (quizData) => {
        const response = await postRequest('/create-quiz',quizData);
        if (!response.error) {
            setQuiz(response.quiz);
        }
        return response;
    }

    const getQuiz = async (quizId) =>{
        
        const response = await getRequest(`/get-quiz/${quizId}`);
        console.log(response);

        if (!response?.error) {
            setQuiz(response);
        }

        return response;
    }
    const getCreatedQuizHistory = async () =>{
        const response = await getRequest('/get-created-quiz-history');

        if (!response.error) {
            // console.log(response);
            setCreatedQuizzes(response);
        }

        return response;

    }

    const submitQuiz = async (info) =>{
        const response = await postRequest('/submit-quiz',info);
        return response;
    }
    return (
        <QuizContext.Provider value={{ questions, answers,quiz,createdQuizzes ,getQuiz,getCreatedQuizHistory,selectOption,createQuiz,submitQuiz }}>
            {children}
        </QuizContext.Provider>
    );
};

// Hook to use the QuizContext
export const useQuiz = () => useContext(QuizContext);
