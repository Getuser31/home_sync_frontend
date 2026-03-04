import React, {useState} from "react";
import {useMutation} from "@apollo/client/react";
import {JOIN_HOUSE_BY_INVITATION_CODE} from "../graphQl/mutation";
import {Link, useNavigate} from "react-router-dom";

const JoinHouse = () => {
    const [invitationCode, setInvitationCode] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [join_house, {loading}] = useMutation(JOIN_HOUSE_BY_INVITATION_CODE)

    const onSubmit = (e) => {
        e.preventDefault();

        join_house({variables: {inviteCode: invitationCode}}).then(
            (result) => {
                const payload = result.data.joinHouseByInvitationCode;
                console.log(payload)
                if (payload.__typename === 'HouseError') {
                    setErrors({global: payload.message});
                    return;
                }
                navigate("/");
            }
        ).catch((err) => {
            setErrors({global: err.message});
        })
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/50">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Join a House</h1>
                    <p className="text-gray-500 text-lg">Enter an invitation code to join a space</p>
                </div>
                <form className="flex flex-col gap-6" onSubmit={onSubmit}>
                    {errors.global && <p className="text-red-500 text-sm text-center">{errors.global}</p>}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="invitationCode" className="text-sm font-semibold text-gray-700 ml-1">Invitation Code</label>
                        <input
                            type="text"
                            id="invitationCode"
                            name="invitationCode"
                            value={invitationCode}
                            onChange={(e) => setInvitationCode(e.target.value)}
                            placeholder="Enter invitation code"
                            required
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Joining...' : 'Join House'}
                    </button>
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                            Back to Houses
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default JoinHouse;