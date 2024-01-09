/**
 * AppProvider Component
 *
 * This component is the provider for the AppContext, which is used to manage global state
 * across the application. It uses React's Context API to pass down state and state setter
 * functions to child components without the need to prop-drill.
 *
 * States managed by this provider:
 * - currentProjectName: Stores the name of the current project.
 * - currentProjectId: Stores the ID of the current project.
 * - retryQuiz: A boolean flag to indicate if the quiz should be retried.
 * - showNav: A boolean flag to control the visibility of the navigation.
 * - MAX_FILE_SIZE: A constant to define the maximum file size allowed (set to 30MB).
 *
 * @param {Object} props - Contains the children elements wrapped by the AppProvider.
 * @returns {React.Component} The AppProvider component with the AppContext.Provider.
 */
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentProjectName, setCurrentProjectName] = useState('');
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const [retryQuiz, setRetryQuiz] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const [MAX_FILE_SIZE] = useState(30 * 1024 * 1024); //30MB

    return (
        <AppContext.Provider
            value={{
                currentProjectName,
                setCurrentProjectName,
                currentProjectId,
                setCurrentProjectId,
                MAX_FILE_SIZE,
                showNav,
                setShowNav,
                retryQuiz,
                setRetryQuiz,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
