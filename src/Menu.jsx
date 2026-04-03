import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./AuthContext";

const Menu = () => {
    const navigate = useNavigate()
    const {user, logout} = useAuth()
    const [isHouseMenuDisplay, setIsHouseMenuDisplay] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleNavigate = (path) => {
        navigate(path)
        setIsMobileMenuOpen(false)
        setIsHouseMenuDisplay(false)
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/home"}>
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            HouseSync
                        </span>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden sm:flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsHouseMenuDisplay(!isHouseMenuDisplay)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 text-sm font-semibold transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        Houses
                                        <svg className={`w-3.5 h-3.5 transition-transform ${isHouseMenuDisplay ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </button>
                                    {isHouseMenuDisplay && (
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                            {user.roleHouseUsers.map((house) => (
                                                <button
                                                    key={house.house.id}
                                                    onClick={() => handleNavigate(`/profile_house/${house.house.name}/${house.house.id}`)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                >
                                                    {house.house.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 text-sm font-semibold transition-colors"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors border border-gray-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={() => navigate("/login")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
                    {user ? (
                        <>
                            <button
                                onClick={() => setIsHouseMenuDisplay(!isHouseMenuDisplay)}
                                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-sm font-semibold transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                    </svg>
                                    Houses
                                </span>
                                <svg className={`w-3.5 h-3.5 transition-transform ${isHouseMenuDisplay ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                            {isHouseMenuDisplay && (
                                <div className="ml-4 flex flex-col gap-1 mb-1">
                                    {user.roleHouseUsers.map((house) => (
                                        <button
                                            key={house.house.id}
                                            onClick={() => handleNavigate(`/profile_house/${house.house.name}/${house.house.id}`)}
                                            className="text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        >
                                            {house.house.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={() => handleNavigate("/profile")}
                                className="px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-sm font-semibold transition-colors"
                            >
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-gray-100 text-sm font-semibold transition-colors border border-gray-200 mt-1"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => handleNavigate("/login")}
                            className="px-3 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
                        >
                            Login
                        </button>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Menu;