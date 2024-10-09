import React, { createContext, useContext, useState } from 'react';

// Create the QuizContext
const QuizContext = createContext();

// Provider component
export const QuizProvider = ({ children }) => {
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

    return (
        <QuizContext.Provider value={{ questions, answers, selectOption }}>
            {children}
        </QuizContext.Provider>
    );
};

// Hook to use the QuizContext
export const useQuiz = () => useContext(QuizContext);
