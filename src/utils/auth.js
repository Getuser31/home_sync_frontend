export const isAuthenticated = () => {
    return (localStorage.getItem('userTokenHomeSync') !== null);
}