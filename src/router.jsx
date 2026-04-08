import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import Login from "./user/Login";
import Register from "./user/Register";
import AddHouse from "./house/AddHouse";
import HomeComponent from "./HomeComponent";
import JoinHouse from "./house/JoinHouse";
import ManageHouse from "./house/Managehouse";
import AddNewTask from "./task/AddNewTask";
import ConsultTask from "./task/ConsultTask";
import AllTasks from "./task/AllTasks";
import ConsultHouse from "./house/ConsultHouse";
import ManageUsers from "./house/ManageUsers";
import Profile from "./user/Profile";
import PrivateRoute from "./PrivateRoute";
import LandingPage from "./LandingPage";
import UpdateTask from "./task/UpdateTask";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage/>,
    },
    {
        element: <App/>,
        children: [
            {path: "/login", element: <Login/>},
            {path: "/register", element: <Register/>},
            {
                element: <PrivateRoute/>,
                children: [
                    {path: "/home", element: <HomeComponent/>},
                    {path: "/profile", element: <Profile/>},
                    {path: "/create_house", element: <AddHouse/>},
                    {path: "/join_house", element: <JoinHouse/>},
                    {path: "/manage_house/:name/:id", element: <ManageHouse/>},
                    {path: "/profile_house/:name/:id", element: <ConsultHouse/>},
                    {path: "/add_new_task/:houseId", element: <AddNewTask/>},
                    {path: "/update_task/:houseId/:taskName/:taskId", element: <UpdateTask/>},
                    {path: "/consult_task/:houseId/:taskName/:taskId", element: <ConsultTask/>},
                    {path: "/all_tasks/:houseId/", element: <AllTasks/>},
                    {path: "/manage_users/:houseId/", element: <ManageUsers/>},
                ]
            }
        ]
    },
])

export default Router