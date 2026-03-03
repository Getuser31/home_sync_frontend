import React, {useState} from 'react';
import {useMutation} from "@apollo/client/react";
import {REGISTER_MUTATION} from "../graphQl/mutation";

const Register = () => {
    const [register, {loading}] = useMutation(REGISTER_MUTATION)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [errors, setErrors] = useState({})

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (password !== passwordConfirmation) {
            newErrors.password = "Passwords do not match";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        register({variables: {username, password, email}})
            .then((result) => {
                const payload = result.data.createUser;
                if (payload.__typename === 'UserError') {
                    setErrors({ global: payload.message });
                } else {
                    console.log("Registration successful");
                }

            })
            .catch((err) => {
                setErrors({global: err.message})
            })

    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/50">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Create Account</h1>
                    <p className="text-gray-500 text-lg">Fill in your details to get started</p>
                </div>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {errors.global && <p className="text-red-500">{errors.global}</p>}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your Email"
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                        />
                        {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email}</p>}
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
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            name="passwordConfirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="Re-enter your password"
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                        />
                        {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <div className="mt-4 text-center">
                        <span className="text-sm text-gray-500">Already have an account? </span>
                        <a href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;