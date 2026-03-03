import React, {useState} from "react";
import {useMutation} from "@apollo/client/react";
import {LOGIN_MUTATION} from "../graphQl/mutation";
import {Link, useNavigate} from "react-router-dom";

const Login = () => {
    const [login, {loading}] = useMutation(LOGIN_MUTATION)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})


    const handleSubmit = (e) => {
        e.preventDefault()

        login({variables: {email, password}})
            .then((result) => {
                const payload = result.data.login;
                if (payload.__typename === 'UserError') {
                    setErrors({global: payload.message})
                } else {
                    localStorage.setItem("userTokenHomeSync", payload.token)
                    navigate(
                        "/"
                    )
                }
            }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/50">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-lg">Please enter your details to sign in</p>
                </div>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {errors.global && <p className="text-red-500">{errors.global}</p>}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <button
                        className="mt-4 bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30"
                    >
                        <Link to={"/register"}>Create An Account</Link>
                    </button>
                    <div className="mt-4 text-center">
                        <a href="#"
                           className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">Forgot
                            password?</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;