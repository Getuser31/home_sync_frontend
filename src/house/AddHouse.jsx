import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {CREATE_NEW_HOUSE} from "../graphQl/mutation";
import {useMutation} from "@apollo/client/react";

const AddHouse = () => {
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [createHouse, {loading}] = useMutation(CREATE_NEW_HOUSE)

    const handleSubmit = (e) => {
        e.preventDefault();
        createHouse({variables: {name}}).then((result) => {
            const payload = result.data.createHouse;
            if (payload.__typename === 'HouseError') {
                setErrors({global: payload.message});
                return;
            }
            navigate("/");
        }).catch((err) => {
            setErrors({global: err.message});
        });
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/50">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Create a New House</h1>
                    <p className="text-gray-500 text-lg">Set up a new space for your household</p>
                </div>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {errors.global && <p className="text-red-500 text-sm text-center">{errors.global}</p>}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="houseName" className="text-sm font-semibold text-gray-700 ml-1">House Name</label>
                        <input
                            type="text"
                            id="houseName"
                            name="houseName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter house name"
                            required
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating...' : 'Create House'}
                    </button>
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                            Back to Houses
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddHouse;