import React, { createContext, useContext, useEffect, useState } from 'react';
import { postRequest, getRequest, patchRequest } from '../utils/services';
import { useNavigate } from 'react-router-dom';

//create the context
const UserContext = createContext();

//custom hook to use the UserContext
export const useUserContext = () => {
    return useContext(UserContext);
};

//UserProvider component 
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect (()=>{
        const getUserProfile = async ()=>{
            const response = await getRequest('/user/profile');
            if (!response.error) {
                // console.log(response);
                setUser(response);
            }
            return response;
        };

        getUserProfile();
        
    },[]);

    //function to handle user sign up
    const register = async (name,email, password) => {
        const response = await postRequest('/user/register', { name,email, password });
        if (!response.error) {
            setUser(response.quiz);
        }
        return response;
    };

    //function to change user password
    const changeUserPassword = async (oldPassword,newPassword) => {
        const response = await patchRequest('/user/change-password',{oldPassword,newPassword});
        if (!response.error) {
            alert("Password changes successfully.")
        }
        return response;
    };

    // Function to edit user profile
    const editUserProfile = async (updatedData) => {
        const response = await patchRequest('/user/profile/edit', updatedData);
        if (!response.error) {
            setUser((prevUser) => ({ ...prevUser, ...updatedData }));
        }
        return response;
    };

    // Function to handle user login
    const login = async (email, password,rememberMe) => {
        const response = await postRequest('/user/login', { email, password,rememberMe });
        if (!response.error) {
            setUser(response);
        }
        return response;
    };

    // function to handle user logout
    const logout = async () => {
        //clear token cookie by setting it to an empty value and expiry in the past
        const response = await postRequest('/user/logout');
        if (!response.error) {
            alert("Logged Out successfully");
        }else{
            alert(response?.message);
        }
        setUser(null);
        navigate("/");
    };
    
    return (
        <UserContext.Provider value={{ user, editUserProfile, login,register, changeUserPassword,logout }}>
            {children}
        </UserContext.Provider>
    );
};
