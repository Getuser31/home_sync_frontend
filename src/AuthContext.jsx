import React, {createContext, useContext, useState, useEffect} from "react";
import {useApolloClient} from "@apollo/client/react";
import {GET_ME} from "./graphQl/query";

const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const client = useApolloClient();

    useEffect(() => {
        const token = localStorage.getItem("userTokenHomeSync")

        if(!token){
            setLoading(false)
            return;
        }

        client.query({query: GET_ME})
            .then(
                (result) => {
                    if(result?.data?.getMe){
                        setUser({
                            token,
                            ...result.data.getMe
                        })
                    }
                }
            )
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })

    }, []);

    const login = (loginPayload) => {
        if (loginPayload?.token && loginPayload?.user) {
            const {token, user: userData} = loginPayload;
            localStorage.setItem("userTokenHomeSync", token)
            setUser({
                  token,
                  ...userData
            })
        }
    }

    const logout = () => {
        localStorage.removeItem("userTokenHomeSync")
        setUser(null)
        client.resetStore()
    }

    return <AuthContext.Provider value={{user, login, logout, loading}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)