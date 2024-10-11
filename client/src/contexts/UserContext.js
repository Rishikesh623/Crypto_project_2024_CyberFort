import React, { createContext, useContext, useState } from 'react';
import { postRequest, getRequest, patchRequest } from '../utils/services';

// Create the context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUserContext = () => {
    return useContext(UserContext);
};

// UserProvider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to fetch user profile
    const fetchUserProfile = async () => {
        const response = await getRequest('/user/profile');
        if (!response.error) {
            setUser(response);
        }
        return response;
    };

    // Function to edit user profile
    const editUserProfile = async (updatedData) => {
        const response = await patchRequest('/user/profile', updatedData);
        if (!response.error) {
            setUser((prevUser) => ({ ...prevUser, ...updatedData }));
        }
        return response;
    };

    // Function to handle user login
    const login = async (email, password) => {
        const response = await postRequest('/user/login', { email, password });
        if (!response.error) {
            setUser(response);
        }
        return response;
    };

    // Function to handle user logout
    const logout = async () => {
        // Implement logout logic here
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, fetchUserProfile, editUserProfile, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
