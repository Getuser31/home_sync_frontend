const setContext = () => {
    return (operation, next) => {
        if (next) {
            return next(operation);
        }
        return (prev) => prev;
    };
};

module.exports = {
    setContext,
};
