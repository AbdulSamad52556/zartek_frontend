import React, { createContext, useState, useContext } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        access: localStorage.getItem(ACCESS_TOKEN) || null ,
        refresh: localStorage.getItem(REFRESH_TOKEN) || null ,
        role: localStorage.getItem('ROLE') || null,
        username: localStorage.getItem('USERNAME') || null,
        id: localStorage.getItem('id') || null,
    });

    const setUserDetails = (role, username, access, refresh, id) => {
        setUser({ role, username, access, refresh, id });
    };

    return (
        <UserContext.Provider value={{ user, setUserDetails }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
