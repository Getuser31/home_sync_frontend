import React, {useState} from "react";
import {useMutation} from "@apollo/client/react";
import {LOGIN_MUTATION} from "../graphQl/mutation";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../AuthContext";
import {useTranslation} from "react-i18next";

const Login = () => {
    const [login, {loading}] = useMutation(LOGIN_MUTATION)
    const {login: authLogin} = useAuth()
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState({})


    const handleSubmit = (e) => {
        e.preventDefault()

        login({variables: {email, password, rememberMe}})
            .then((result) => {
                const payload = result.data.login;
                if (payload.__typename === 'UserError') {
                    setErrors({global: payload.message})
                } else {
                    authLogin(payload)
                    navigate("/")
                }
            }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/50">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">{t('login.title')}</h1>
                    <p className="text-gray-500 text-lg">{t('login.subtitle')}</p>
                </div>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {errors.global && <p className="text-red-500">{errors.global}</p>}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">{t('login.email')}</label>
                        <input
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('login.email_placeholder')}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">{t('login.password')}</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('login.password_placeholder')}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            id="rememberMe"
                            type="checkbox"
                            name="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <label htmlFor="rememberMe" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                            {t('login.remember_me')}
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? t('login.signing_in') : t('login.sign_in')}
                    </button>
                    <button
                        className="mt-4 bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30"
                    >
                        <Link to={"/register"}>{t('login.create_account')}</Link>
                    </button>
                    <div className="mt-4 text-center">
                        <a href="#"
                           className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">{t('login.forgot_password')}</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
