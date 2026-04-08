import React, {useState, useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_TASK_BY_ID} from "../graphQl/query";
import {UPDATE_TASK} from "../graphQl/mutation";

const UpdateTask = () => {
    const {taskId} = useParams()
    const {loading, error, data} = useQuery(GET_TASK_BY_ID, {variables: {id: parseInt(taskId)}})
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [weight, setWeight] = useState(0)
    const [timeToComplete, setTimeToComplete] = useState(0)
    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState("")
    const [updateTask] = useMutation(UPDATE_TASK)
    const navigate = useNavigate()

    useEffect(() => {
        if (data?.getTaskById) {
            setTitle(data.getTaskById.title)
            setDescription(data.getTaskById.description)
            setWeight(data.getTaskById.weight)
            setTimeToComplete(data.getTaskById.timeToComplete)
        }
    }, [data])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = {}
        if (!title) newErrors.title = "Title is required"
        if (!description) newErrors.description = "Description is required"
        if (!weight) newErrors.weight = "Weight is required"
        if (!timeToComplete) newErrors.timeToComplete = "Time to complete is required"
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        setErrors({})
        updateTask({variables: {id: parseInt(taskId), title, description, weight, timeToComplete}}).then((result) => {
            if (result.errors) {
                setErrors({server: result.errors.map(e => e.message).join(", ")})
            } else {
                setSuccessMessage("Task updated successfully")
                setTimeout(() => setSuccessMessage(""), 2000)
                setTimeout(() => navigate(-1), 2000)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/50">
                <div className="mb-8">
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">Task</p>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Update Task</h1>
                </div>

                {successMessage && <p className="mb-4 text-green-600 text-xs font-medium bg-green-50 border border-green-200 rounded-xl px-4 py-3">{successMessage}</p>}
                {errors.server && <p className="mb-4 text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded-xl px-4 py-3">{errors.server}</p>}

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                        />
                        {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                        />
                        {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="flex items-baseline justify-between">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Weight</label>
                                <span className="text-xs text-gray-400">Penibility 1 – 10</span>
                            </div>
                            <input
                                type="number"
                                value={weight}
                                min={1}
                                max={10}
                                onChange={(e) => setWeight(Math.min(10, Math.max(1, parseFloat(e.target.value))))}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                            />
                            {errors.weight && <p className="text-red-500 text-xs">{errors.weight}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="flex items-baseline justify-between">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Time to Complete</label>
                                <span className="text-xs text-gray-400">Max 480 min (8h)</span>
                            </div>
                            <input
                                type="number"
                                value={timeToComplete}
                                min={1}
                                max={480}
                                onChange={(e) => setTimeToComplete(Math.min(480, Math.max(1, parseFloat(e.target.value))))}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                            />
                            {errors.timeToComplete && <p className="text-red-500 text-xs">{errors.timeToComplete}</p>}
                        </div>
                    </div>

                    <button
                        className="mt-2 w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-sm font-bold text-white transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    )
}

export default UpdateTask