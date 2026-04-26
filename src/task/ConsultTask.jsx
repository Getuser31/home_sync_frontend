import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_HOUSE_BY_ID, GET_TASK_BY_ID} from "../graphQl/query";
import {ASSIGN_TASK_TO_USER, DELETE_TASK, REMOVE_USER_FROM_TASK} from "../graphQl/mutation";
import generatePeriodKey from "../utils/periodKeyService";
import AdminNavigationBar from "../house/AdminNavigationBar";
import {useTranslation} from "react-i18next";

const ConsultTask = () => {
    const {houseId, taskId} = useParams()
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {loading, error, data} = useQuery(GET_TASK_BY_ID, {variables: {id: parseInt(taskId)}})
    const {
        loading: loadingHouse,
        error: errorHouse,
        data: houseData
    } = useQuery(GET_HOUSE_BY_ID, {variables: {id: parseInt(houseId)}})
    const [assignUserToTask] = useMutation(ASSIGN_TASK_TO_USER)
    const [removeUserFromTaskMutation] = useMutation(REMOVE_USER_FROM_TASK)
    const [deleteTaskMutation] = useMutation(DELETE_TASK)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])

    const isLoading = loading || loadingHouse;
    const combinedError = error || errorHouse;

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-indigo-800 font-medium animate-pulse">{t('task.loading_tasks')}</p>
                </div>
            </div>
        );
    }

    if (combinedError) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-l-4 border-red-500">
                    <h3 className="text-lg font-bold text-red-600 mb-2">{t('task.error_title')}</h3>
                    <p className="text-gray-600">{combinedError.message}</p>
                </div>
            </div>
        );
    }

    const task = data?.getTaskById;
    const house = houseData?.getHouseById;

    if (!task || !house) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                    <p className="text-gray-500 font-medium">{t('task.no_data')}</p>
                </div>
            </div>
        );
    }

    const userAlreadyAssigned = task.taskLives.flatMap(life => life.assignedUsers);
    const assignedNewUser = house.users.filter(user => !userAlreadyAssigned.some(u => u.id === user.id));

    const assignUser = (e) => {
        const userId = parseInt(e.target.value);
        if (userId) {
            assignUserToTask({
                variables: { task_id: task.id, user_id: userId },
                refetchQueries: [{ query: GET_TASK_BY_ID, variables: { id: parseInt(taskId) } }]
            }).catch((error) => {
                setErrorMessage(`Failed to assign user: ${error.message}`)
            })
        }
    }

    const removeUserFromTask = (userId) => {
        if (!userId) return;
        removeUserFromTaskMutation({
            variables: {task_id: task.id, user_id: userId},
            refetchQueries: [{ query: GET_TASK_BY_ID, variables: { id: parseInt(taskId) } }]
        }).catch((error) => {
            setErrorMessage(`Failed to remove user: ${error.message}`)
        })
    }

    const deleteTask = () => {
        deleteTaskMutation({variables: {taskId: parseInt(taskId)}, refetchQueries: [{ query: GET_HOUSE_BY_ID, variables: { id: parseInt(houseId) } }]})
            .then(() => navigate(-1))
            .catch((error) => {
                setErrorMessage(`Failed to delete task: ${error.message}`)
                setShowDeleteModal(false)
            })
    }

    const periodKey = (recurrenceName, date) => {
        return generatePeriodKey(recurrenceName, date ? new Date(date) : undefined)
    }

    const completionsForDate = (taskLife, date) => {
        const key = periodKey(taskLife.recurrence.name, date)
        return taskLife.completions.filter(c => c.periodKey === key)
    }

    const taskCompletionForCurrentMonth = (taskLife) => {
        const recurrence = taskLife.recurrence.name
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const actualDayNumber = new Date().getDate();
        const weekOfTheMonth = (date = new Date()) => {
            return Math.ceil(date.getDate() / 7);
        }

        const thisMonth = taskLife.completions.filter(c => {
            const date = new Date(c.completedAt);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        if (recurrence === 'Daily'){
            return (Math.round((thisMonth.length * 100) / actualDayNumber))
        }
        if (recurrence === 'Weekly'){
            return (Math.round((thisMonth.length * 100) / weekOfTheMonth()))
        }
        else {
            if(taskLife.completions.length > 0) {
                return '100'
            }
            return '0'
        }
    }


    return (
        <>
            <AdminNavigationBar house={house}/>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-6">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/50">
                    <div className="mb-8">
                        <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">{t('task.task_label')}</p>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{task.title}</h1>
                        {task.description && (
                            <p className="mt-2 text-sm text-gray-500">{task.description}</p>
                        )}
                    </div>

                    {errorMessage && (
                        <div className="mb-4 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl">
                            <span>{errorMessage}</span>
                            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600 shrink-0">✕</button>
                        </div>
                    )}

                    <div className="mb-6 flex items-center gap-3">
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 text-red-500 hover:text-white border border-red-200 hover:bg-red-500 hover:border-red-500 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                            {t('task.delete_task')}
                        </button>
                        <button
                            onClick={() => navigate(`/update_task/${houseId}/${task.title}/${taskId}`)}
                            className="flex items-center gap-2 text-indigo-500 hover:text-white border border-indigo-200 hover:bg-indigo-500 hover:border-indigo-500 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                            {t('task.update_task')}
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {task.taskLives.map((taskLife) => (
                            <div key={taskLife.id} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{taskLife.recurrence.name}</h2>
                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                        {t('task.every_days', {days: taskLife.recurrence.frequencyDays})}
                                    </span>
                                </div>

                                {taskLife.completions.filter((completion) => completion.periodKey === periodKey(taskLife.recurrence.name)).length > 0 ? (
                                    <ul className="flex flex-col gap-2">
                                        {taskLife.completions.filter((completion) => completion.periodKey === periodKey(taskLife.recurrence.name)).map((completion) => (
                                            <li key={completion.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                                                <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"/>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-gray-700">
                                                        {taskLife.assignedUsers.find((user) => String(user.id) === String(completion.userWhoCompletedId))?.name ?? "Unknown"}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(completion.completedAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">{t('task.no_completions')}</p>
                                )}


                                <div className="mt-4 flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">{t('task.this_month')}</span>
                                    <span className="text-lg font-extrabold text-indigo-600">{taskCompletionForCurrentMonth(taskLife) ?? "—"}<span className="text-xs font-semibold ml-0.5">%</span></span>
                                </div>

                                <div className="mt-4 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                        {t('task.check_specific_date')}
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                    />
                                    {selectedDate && (() => {
                                        const results = completionsForDate(taskLife, selectedDate)
                                        return results.length > 0 ? (
                                            <ul className="mt-3 flex flex-col gap-2">
                                                {results.map((completion) => (
                                                    <li key={completion.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                                                        <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"/>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-semibold text-gray-700">
                                                                {taskLife.assignedUsers.find((user) => String(user.id) === String(completion.userWhoCompletedId))?.name ?? "Unknown"}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(completion.completedAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="mt-3 text-xs text-gray-400 italic">{t('task.no_completions_period')}</p>
                                        )
                                    })()}
                                </div>

                                {taskLife.assignedUsers.length > 0 ? (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">{t('task.assigned_to_label')}</h3>
                                        <ul className="flex flex-col gap-2">
                                            {taskLife.assignedUsers.map((user) => (
                                                <li key={user.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                                                    <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"/>
                                                    <span className="text-xs text-gray-600 font-medium">{user.name}</span>
                                                    <button
                                                        onClick={() => removeUserFromTask(user.id)}
                                                        className="ml-auto text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                                        </svg>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic mt-4">{t('task.no_users_assigned')}</p>
                                )}

                                <div className="mt-5">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                        {t('task.assign_to_member')}
                                    </label>
                                    <select
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                        disabled={assignedNewUser.length === 0}
                                        onChange={assignUser}
                                    >
                                        <option value="">{t('task.select_member')}</option>
                                        {assignedNewUser.map((user) => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}/>
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h2 className="text-lg font-extrabold text-gray-900 text-center mb-1">{t('task.delete_task')}</h2>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            {t('task.delete_task_confirm', {taskTitle: task.title})}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                {t('task.cancel_delete')}
                            </button>
                            <button
                                onClick={deleteTask}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-bold text-white transition-colors"
                            >
                                {t('task.confirm_delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ConsultTask;
