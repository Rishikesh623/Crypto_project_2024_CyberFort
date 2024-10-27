import React, { createContext, useContext, useState } from 'react';
import { postRequest, getRequest, patchRequest } from '../utils/services';
// Create the QuizContext
const QuizContext = createContext();

// Provider component
export const QuizProvider = ({ children }) => {
    const [createdQuizzes, setCreatedQuizzes] = useState([]);
    const [givenQuizzes, setGivenQuizzes] = useState([]);

    const [quiz, setQuiz] = useState(null);
    const [result, setResult] = useState(null);
    // const [questions] = useState([
    //     {
    //         question: "What is the capital of France?",
    //         options: ["Paris", "London", "Berlin", "Madrid"],
    //         selectedOption: null,
    //     },
    //     {
    //         question: "What is 2 + 2?",
    //         options: ["3", "4", "5", "6"],
    //         selectedOption: null,
    //     },
    //     {
    //         question: "What is the color of the sky?",
    //         options: ["Blue", "Green", "Red", "Yellow"],
    //         selectedOption: null,
    //     },
    //     // Add more questions as needed
    // ]);

    const [answers, setAnswers] = useState({});

    // Function to update the selected option for a question
    const selectOption = (questionIndex, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption,
        }));
    };

    const createQuiz = async (quizData) => {
        const response = await postRequest('/create-quiz', quizData);
        if (!response.error) {
            setQuiz(response.quiz);
        }
        return response;
    }

    const getQuiz = async (quizId) => {

        const response = await getRequest(`/get-quiz/${quizId}`);
        // console.log(response);

        if (!response?.error) {
            setQuiz(response);
        }

        return response;
    }

    const getdetailedQuizResult = async (quizId) => {
        const response = await getRequest(`/get-quiz-and-result/${quizId}`);
        // console.log(response);

        if (!response?.error) {
            setQuiz(response.quiz);
            setResult(response.result);
        }

        return response;
    }

    const getQuizResult = async (quizId) => {

        const response = await getRequest(`/get-summarized-quiz_result/${quizId}`);
        // console.log(response);

        // if (!response?.error) {
        //     setQuiz(response.quiz);
        // }

        return response;
    }

    const getCreatedQuizResults = async (quizId) => {
        const response = await getRequest(`/get-created-quiz_result/${quizId}`);
        // console.log(response);

        // if (!response?.error) {
        //     setQuiz(response.quiz);
        // }

        return response;
    }

    const getCreatedQuizHistory = async () => {
        const response = await getRequest('/get-created-quiz-history');

        if (!response.error) {
            setCreatedQuizzes(response);
        }

        return response;

    }
    const getGivenQuizHistory = async () => {
        const response = await getRequest('/get-given-quiz-history');

        if (!response.error) {
            setGivenQuizzes(response);
        }

        return response;

    }

    const submitQuiz = async (info) => {
        console.log(info);
        const response = await postRequest('/submit-quiz', info);
        return response;
    }
    
    const updateQuiz = async (quizId,changes) =>{
        const response = await patchRequest('/update-quiz',{quizId,changes});
        if(!response?.error){
            setQuiz({ ...quiz, ...changes });//make changes visible instantly
        }
        return response;
    }
    return (
        <QuizContext.Provider value={{
            answers, quiz,setQuiz,result,setResult, createdQuizzes, givenQuizzes,
            getQuiz, getCreatedQuizHistory, getGivenQuizHistory, getdetailedQuizResult, getQuizResult,getCreatedQuizResults, selectOption, createQuiz, submitQuiz
            ,updateQuiz}}>
            {children}
        </QuizContext.Provider>
    );
};

// Hook to use the QuizContext
export const useQuiz = () => useContext(QuizContext);
