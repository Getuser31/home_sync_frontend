import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_HOUSE_BY_ID, GET_ROLES} from "../graphQl/query";
import {CREATE_DUMMY_USER_FOR_HOUSE, REMOVE_USER_FROM_HOUSE, UPDATE_USER_ROLE} from "../graphQl/mutation";

const ManageUsers = () => {
    const {houseId} = useParams()
    const {loading, error, data} = useQuery(GET_HOUSE_BY_ID, {variables: {id: parseInt(houseId)}})
    const {data: roleData} = useQuery(GET_ROLES)
    const [mutationError, setMutationError] = useState(null)
    const [confirmUserId, setConfirmUserId] = useState(null)
    const [updateUserRole] = useMutation(UPDATE_USER_ROLE)
    const [addDummyUserMutation] = useMutation(CREATE_DUMMY_USER_FOR_HOUSE)
    const [username, setUsername] = useState('')
    const [removeUserMutation] = useMutation(REMOVE_USER_FROM_HOUSE)

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data found.</div>;

    const house = data?.getHouseById;
    const roles = roleData?.getRoles;

    const handleUserRoleUpdate = (newRole, userId) => {
        if (newRole) {
            setMutationError(null)
            updateUserRole({
                variables: {roleId: parseInt(newRole), houseId: parseInt(houseId), userId: parseInt(userId)},
                refetchQueries: [{query: GET_HOUSE_BY_ID, variables: {id: parseInt(houseId)}}]
            }).then(({data}) => {
                const typename = data?.updateUserRole?.__typename
                if (typename === "UserError" || typename === "HouseError") {
                    setMutationError(data.updateUserRole.message)
                }
            })
        }
    }

    const handleDummyUser = (e) => {
        e.preventDefault()
        addDummyUserMutation({
            variables: {houseId: parseInt(houseId), username},
            refetchQueries: [{query: GET_HOUSE_BY_ID, variables: {id: parseInt(houseId)}}]
        }).then(({data}) => {
            const typename = data?.createDummyUserForHouse?.__typename
            if (typename === "UserError" || typename === "HouseError") {
                setMutationError(data.createDummyUserForHouse.message)
            }
            setUsername('')
        })
    }

    const handleRemoveUser = () => {
        removeUserMutation({
            variables: {houseId: parseInt(houseId), userId: parseInt(confirmUserId)},
            refetchQueries: [{query: GET_HOUSE_BY_ID, variables: {id: parseInt(houseId)}}]
        }).then(({data}) => {
            const typename = data?.removeUserFromHouse?.__typename
            if (typename === "UserError" || typename === "HouseError") {
                setMutationError(data.removeUserFromHouse.message)
            }
        }).finally(() => setConfirmUserId(null))
    }


    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-2xl border border-white/50">
                <div className="mb-8 text-center">
                    <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider mb-1">Management</p>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Users</h1>
                </div>

                {mutationError && (
                    <div
                        className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                        {mutationError}
                    </div>
                )}

                <table className="w-full">
                    <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 px-2">Name</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 px-2">Email</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 px-2">Role</th>
                        <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 px-2">Remove</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {house.users.map(user => (
                        <tr key={user.email} className="group hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-110 transition-transform">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold text-gray-800">{user.name}</span>
                                </div>
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-500">{user.email}</td>
                            <td className="py-3 px-2">
                                <select onChange={(e) => handleUserRoleUpdate(e.target.value, user.id)}
                                        value={user.roleHouseUsers[0]?.role?.id}
                                        className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {!user.roleHouseUsers[0]?.role && (
                                        <option value="" disabled selected>No role</option>
                                    )}
                                    {roles?.map(role => (
                                        <option key={role.id} value={role.id}
                                                selected={user.roleHouseUsers[0]?.role?.id === role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="py-3 px-2">
                                <button
                                    onClick={() => setConfirmUserId(user.id)}
                                    className="text-red-400 hover:text-red-600 text-xs font-bold transition-colors"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Add User Without
                        Account</h2>
                    <form className="flex gap-3" onSubmit={handleDummyUser}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
                        >
                            Add User
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {confirmUserId && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
                    <h3 className="text-lg font-extrabold text-gray-900 mb-2">Remove user?</h3>
                    <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setConfirmUserId(null)}
                            className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRemoveUser}
                            className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default ManageUsers;