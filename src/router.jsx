import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import Login from "./user/Login";
import Register from "./user/Register";
import AddHouse from "./house/AddHouse";
import HomeComponent from "./HomeComponent";
import JoinHouse from "./house/JoinHouse";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "/", element: <HomeComponent/>},
            {path: "/login", element: <Login/>},
            {path: "/register", element: <Register/>},
            {path: "/create_house", element: <AddHouse/>},
            {path: "/join_house", element: <JoinHouse/>},
        ]
    },
])

export default Router