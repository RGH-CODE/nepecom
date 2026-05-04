export const IsAuthenticated = () => {
    return !!localStorage.getItem("access");

};