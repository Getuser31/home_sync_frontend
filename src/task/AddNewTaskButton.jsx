import React from "react";
import {useNavigate} from "react-router-dom";

const AddNewTaskButton = ({houseId, className}) => {
    const navigate = useNavigate()
    return (
        <button
        className={`w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 ${className ?? ''}`}
        onClick={() => navigate(`/add_new_task/${houseId}`)}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
             fill="currentColor">
            <path fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"/>
        </svg>
        Add New Task
    </button>
    )
}

export default AddNewTaskButton;