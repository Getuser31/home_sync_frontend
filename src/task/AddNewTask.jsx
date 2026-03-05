import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_HOUSE_BY_ID, GET_TASK_RECURRENCES} from "../graphQl/query";
import {ADD_NEW_TASK} from "../graphQl/mutation";

const AddNewTask = () => {
    const navigate = useNavigate();
    const houseId = useParams().houseId;
    const {loading, error, data} = useQuery(GET_TASK_RECURRENCES)
    const houseData = useQuery(GET_HOUSE_BY_ID, {variables: {id: parseInt(houseId)}})
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [taskRecurrence, setTaskRecurrence] = useState("")
    const [userId, setUserId] = useState("")
    const [addTask, {loading: addTaskLoading}] = useMutation(ADD_NEW_TASK)

    const house = houseData.data?.getHouseById

    console.log(house)


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data found.</div>;

    const taskRecurrences = data.getTaskRecurrences;

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask({
            variables: {
                title,
                description,
                task_recurrence_id: parseInt(taskRecurrence),
                house_id: parseInt(houseId),
                weight: 1,
                user_id: parseInt(userId)
            }
        }).then(() => {
           navigate(-1)
        }).catch((err) => {});
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-white/50">
                <div className="mb-8 text-center">
                    <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider mb-1">Task Management</p>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Add Some
                        Work!</h1>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide ml-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="e.g. Grocery Shopping"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label
                            className="text-sm font-bold text-gray-700 uppercase tracking-wide ml-1">Description</label>
                        <textarea
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[100px] resize-none"
                            placeholder="Describe the task details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label
                                className="text-sm font-bold text-gray-700 uppercase tracking-wide ml-1">Recurrence</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                value={taskRecurrence}
                                onChange={(e) => setTaskRecurrence(e.target.value)}
                            >
                                {taskRecurrences.map((recurrence) => (
                                    <option key={recurrence.id} value={recurrence.id}>{recurrence.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide ml-1">Assigned
                                To</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            >
                                {house.users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200"
                        >
                            Create Task
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full text-sm font-bold text-gray-500 hover:text-gray-700 py-2 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddNewTask;