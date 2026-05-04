import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client/react";
import {GET_HOUSE_BY_ID} from "../graphQl/query";
import generatePeriodKey from "../utils/periodKeyService";
import AdminNavigationBar from "./AdminNavigationBar";
import {useTranslation} from "react-i18next";

export const today = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const startOfCurrentWeek = () => {
    const d = new Date()
    const day = d.getDay()
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
    d.setHours(0, 0, 0, 0)
    return d
}

export const countPeriodsBetween = (start, end, recurrenceName, frequencyDays) => {
    const seen = new Set()
    const cursor = new Date(start)
    const endDate = new Date(end)
    while (cursor <= endDate) {
        seen.add(generatePeriodKey(recurrenceName, cursor))
        cursor.setDate(cursor.getDate() + frequencyDays)
    }
    seen.add(generatePeriodKey(recurrenceName, endDate))
    return seen.size
}

export const formatDuration = (minutes) => {
    if (!minutes) return '—'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h === 0) return `${m}min`
    return m === 0 ? `${h}h` : `${h}h ${m}min`
}

const parseLocalDate = (s) => {
    const [y, m, d] = s.split('-').map(Number)
    return new Date(y, m - 1, d)
}

export const taskStats = (task, startDate, endDate) => {
    const rangeStart = parseLocalDate(startDate)
    const rangeEnd = parseLocalDate(endDate)
    rangeEnd.setHours(23, 59, 59, 999)

    return task.taskLives.map(taskLife => {
        const expected = countPeriodsBetween(rangeStart, rangeEnd, taskLife.recurrence.name, taskLife.recurrence.frequencyDays)
        const filteredCompletions = taskLife.completions.filter(c => {
            const d = new Date(c.completedAt)
            return d >= rangeStart && d <= rangeEnd
        })
        const actual = filteredCompletions.length
        return {
            recurrence: taskLife.recurrence.name,
            total: actual,
            expected,
            percentage: Math.min(100, Math.round((actual / expected) * 100)),
            timeSpent: task.timeToComplete ? actual * task.timeToComplete : null,
        }
    })
}

const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"

const HouseStatistics = () => {
    const {id: houseId} = useParams();
    const {t} = useTranslation()
    const {loading, error, data: houseData} = useQuery(GET_HOUSE_BY_ID, {variables: {id: parseInt(houseId)}})
    const [selectedUserId, setSelectedUserId] = useState('all')
    const [endDate, setEndDate] = useState(today())
    const [startDate, setStartDate] = useState(() => {
        const d = startOfCurrentWeek()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    })
    const [earliestTaskDate, setEarliestTaskDate] = useState('')

    useEffect(() => {
        if (houseData?.getHouseById?.tasks?.length > 0) {
            const earliest = houseData.getHouseById.tasks
                .map(t => t.dateCreated)
                .reduce((min, d) => d < min ? d : min)
                .split('T')[0]
            setEarliestTaskDate(earliest)
        }
    }, [houseData])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    const house = houseData?.getHouseById
    const users = house?.users

    const tasks = house?.tasks
        .filter(task => new Date(task.dateCreated) <= new Date(endDate))
        .filter(task => selectedUserId === 'all' || task.taskLives.some(tl =>
            tl.assignedUsers.some(u => u.id === parseInt(selectedUserId))
        ))

    return (
        <>            <AdminNavigationBar house={house}/>

            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-6">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/50">
                    <div className="mb-8">
                        <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">{t('statistics.title')}</p>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{house?.name}</h1>
                    </div>

                    <div className="flex flex-col gap-3 mb-6">
                        <select
                            value={selectedUserId}
                            onChange={e => setSelectedUserId(e.target.value)}
                            className={inputClass}
                        >
                            <option value="all">{t('statistics.all_users')}</option>
                            {users?.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                        </select>

                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">{t('statistics.from')}</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    min={earliestTaskDate}
                                    max={endDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">{t('statistics.to')}</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate}
                                    max={today()}
                                    onChange={e => setEndDate(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    {!tasks || tasks.length === 0 ? (
                        <p className="text-gray-400 italic text-sm">{t('statistics.no_tasks_period')}</p>
                    ) : (() => {
                        const allStats = tasks.map(task => ({task, stats: taskStats(task, startDate, endDate)}))
                        const totalMinutes = allStats.reduce((sum, {stats}) =>
                            sum + stats.reduce((s, stat) => s + (stat.timeSpent ?? 0), 0), 0)

                        return (
                            <>
                                <div className="flex flex-col gap-4">
                                    {allStats.map(({task, stats}) => {
                                        const taskMinutes = stats.reduce((s, stat) => s + (stat.timeSpent ?? 0), 0)
                                        return (
                                            <div key={task.id}
                                                 className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h2 className="text-sm font-bold text-gray-800">{task.title}</h2>
                                                        {task.description && (
                                                            <p className="text-xs text-gray-400 mt-0.5">{task.description}</p>
                                                        )}
                                                    </div>
                                                    {taskMinutes > 0 && (
                                                        <span
                                                            className="text-xs font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full shrink-0 ml-3">
                                                        {formatDuration(taskMinutes)}
                                                    </span>
                                                    )}
                                                </div>

                                                {stats.map((stat, i) => (
                                                    <div key={i} className="mt-3">
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <span
                                                                className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.recurrence}</span>
                                                            <span className="text-xs text-gray-400">
                                                            {t('statistics.completions', {actual: stat.total, expected: stat.expected})}
                                                        </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                                            <div
                                                                className="bg-indigo-500 h-2 rounded-full transition-all"
                                                                style={{width: `${stat.percentage}%`}}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-right text-indigo-600 font-bold mt-1">{stat.percentage}%</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>

                                {totalMinutes > 0 && (
                                    <div
                                        className="mt-6 flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4">
                                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">{t('statistics.total_time_spent')}</span>
                                        <span
                                            className="text-lg font-extrabold text-indigo-600">{formatDuration(totalMinutes)}</span>
                                    </div>
                                )}
                            </>
                        )
                    })()}
                </div>
            </div>
        </>
    )
}

export default HouseStatistics;
