import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import React, { useState, useEffect } from 'react'
import { useUserContext } from "../context/userContext";

const ProtectedRoute = ({children, allowedRoles}) => {
    const [isAuthorized, setIsAuthorized] = useState(null)
    const { user } = useUserContext();

    const role = localStorage.getItem('ROLE')
    const username = localStorage.getItem('USERNAME')

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    },[])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/api/token.refresh/", {
                refresh: refreshToken
            });
            if (res.status === 200) {
                localStorage.getItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }

    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decode =  jwtDecode(token)
        const tokenExpiration = decode.exp 
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }
    if (isAuthorized === null){
        return <div>Loading...</div>
    }
  const isAuth = user && allowedRoles.includes(role);
  return !isAuth ? <Navigate to='/'/> : isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute
