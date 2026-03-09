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
            {path: "/manage_house/:name/:id", element: <ManageHouse/>},
            {path: "/add_new_task/:houseId", element: <AddNewTask/>},
            {path: "/consult_task/:houseId/:taskName/:taskId", element: <ConsultTask/>},
            {path: "/all_tasks/:houseId/", element: <AllTasks/>},
        ]
    },
])

export default Router