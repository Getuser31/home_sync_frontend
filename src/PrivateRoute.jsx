import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "./AuthContext";

const PrivateRoute = () => {
    const {user, loading} = useAuth();

    if (loading) return null;

    return user ? <Outlet/> : <Navigate to="/login" replace/>;
};

export default PrivateRoute;