import React, {useState} from "react";
import {useAuth} from "../AuthContext";
import {useMutation} from "@apollo/client/react";
import {UPDATE_EMAIL, UPDATE_PASSWORD} from "../graphQl/mutation";
import {GET_ME} from "../graphQl/query";

const Profile = () => {
    const {user} = useAuth()
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [oldPassword, setOldPassword] = React.useState("")
    const [passwordForEmail, setPasswordForEmail] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [isPasswordFormDisplay, setIsPasswordFormDisplay] = React.useState(false)
    const [isEmailFormDisplay, setIsEmailFormDisplay] = React.useState(false)
    const [updatePassword] = useMutation(UPDATE_PASSWORD)
    const [updateEmail] = useMutation(UPDATE_EMAIL)
    const [passwordError, setPasswordError] = useState(null)
    const [passwordSuccess, setPasswordSuccess] = useState("")
    const [emailError, setEmailError] = useState(null)
    const [emailSuccess, setEmailSuccess] = useState("")


    const initials = user.name
        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    const handleUpdatePassword = (e) => {
        e.preventDefault()
        setPasswordError(null)
        setPasswordSuccess("")
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match")
            return
        }
        updatePassword({variables: {oldPassword, password}, refetchQueries: [{query: GET_ME}]})
            .then((result) => {
                if (result.data.updatePassword.__typename === "UserError") {
                    setPasswordError(result.data.updatePassword.message)
                    return
                }
                setPasswordSuccess("Password updated successfully")
                setPassword("")
                setConfirmPassword("")
                setOldPassword("")
                setTimeout(() => setIsPasswordFormDisplay(false), 2000)
            })
            .catch((err) => setPasswordError(err.message))
    }

    const handleUpdateEmail = (e) => {
        e.preventDefault()
        setEmailError(null)
        setEmailSuccess("")
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError("Please enter a valid email address")
            return
        }
        updateEmail({variables: {email, password: passwordForEmail}, refetchQueries: [{query: GET_ME}]})
            .then((result) => {
                if (result.data.updateEmail.__typename === "UserError") {
                    setEmailError(result.data.updateEmail.message)
                    return
                }
                setEmailSuccess("Email updated successfully")
                setEmail("")
                setPasswordForEmail("")
                setTimeout(() => setIsEmailFormDisplay(false), 2000)
            })
            .catch((err) => setEmailError(err.message))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/50">

                {/* Avatar + name */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mb-4">
                        <span className="text-2xl font-extrabold text-white">{initials}</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{user.name}</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
                </div>

                {/* Details */}
                <div className="mb-8">
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">Account details</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs text-gray-400">Full name</span>
                                <span className="text-sm font-bold text-gray-800 truncate">{user.name}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs text-gray-400">Email address</span>
                                <span className="text-sm font-bold text-gray-800 truncate">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        {/* Update Password */}
                        <div className="border border-gray-100 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => setIsPasswordFormDisplay(v => !v)}
                                className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                            >
                                <span className="text-sm font-semibold text-gray-700">Update Password</span>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isPasswordFormDisplay ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                            {isPasswordFormDisplay && (
                                <form onSubmit={(e) => handleUpdatePassword(e)} className="flex flex-col gap-3 px-5 py-4 border-t border-gray-100">
                                    <input
                                        type="password"
                                        placeholder="Current password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="password"
                                        placeholder="New password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {passwordError && (
                                        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{passwordError}</p>
                                    )}
                                    {passwordSuccess && (
                                        <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">{passwordSuccess}</p>
                                    )}
                                    <button
                                        type="submit"
                                        className="self-end bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                                    >
                                        Save
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Update Email */}
                        <div className="border border-gray-100 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => setIsEmailFormDisplay(v => !v)}
                                className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                            >
                                <span className="text-sm font-semibold text-gray-700">Update Email</span>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isEmailFormDisplay ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                            {isEmailFormDisplay && (
                                <form onSubmit={(e) => {e.preventDefault(); handleUpdateEmail(e)}} className="flex flex-col gap-3 px-5 py-4 border-t border-gray-100">
                                    <input
                                        type="email"
                                        placeholder="New email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Current password"
                                        value={passwordForEmail}
                                        onChange={(e) => setPasswordForEmail(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {emailError && (
                                        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{emailError}</p>
                                    )}
                                    {emailSuccess && (
                                        <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">{emailSuccess}</p>
                                    )}
                                    <button
                                        type="submit"
                                        className="self-end bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                                    >
                                        Save
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Houses */}
                <div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">Houses</p>
                    {user.roleHouseUsers?.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">You are not part of any house yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {user.roleHouseUsers.map((rhu) => (
                                <li key={`${rhu.house.id}-${rhu.role.id}`}
                                    className="flex items-center justify-between gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="bg-indigo-100 p-2 rounded-xl shrink-0">
                                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                            </svg>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800 truncate">{rhu.house.name}</span>
                                    </div>
                                    <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full shrink-0 capitalize">
                                        {rhu.role.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;