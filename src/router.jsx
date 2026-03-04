import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import Login from "./user/Login";
import Register from "./user/Register";
import AddHouse from "./house/AddHouse";
import HomeComponent from "./HomeComponent";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "/", element: <HomeComponent/>},
            {path: "/login", element: <Login/>},
            {path: "/register", element: <Register/>},
            {path: "/create_house", element: <AddHouse/>},
        ]
    },
])

export default Router