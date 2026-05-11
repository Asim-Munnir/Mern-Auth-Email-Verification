import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isloggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthState = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/v1/auth/is-auth', { withCredentials: true })
            if (res.data.success) {
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            console.log(error)

            if (error.response?.status !== 401) {
                toast.error(
                    error.response?.data?.message || error.message
                )
            }
        }
    }

    const getUserData = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/v1/user/userdata', { withCredentials: true })
            if (res.data.success) {
                setUserData(res.data.userData);
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(
                error.response?.data?.message || error.message
            )
        }
    }


    useEffect(() => {
        getAuthState()
    }, [])



    const value = {
        backendUrl,
        isloggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}