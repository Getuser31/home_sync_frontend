module.exports = {
    useQuery: (query, options) => ({
        loading: false,
        error: undefined,
        data: {},
        refetch: jest.fn(),
    }),
    useMutation: () => [
        jest.fn(),
        {loading: false, error: undefined, data: {}},
    ],
    useApolloClient: () => ({
        query: () => Promise.resolve({data: {}}),
        mutate: () => Promise.resolve({data: {}}),
        resetStore: () => Promise.resolve(),
        stop: () => {
        },
    }),
    useLazyQuery: () => [
        jest.fn(),
        {loading: false, error: undefined, data: {}},
    ],
    useSubscription: () => ({
        loading: false,
        error: undefined,
        data: {},
    }),
    ApolloProvider: ({children}) => children,
    ApolloConsumer: ({children}) => {
        if (typeof children === 'function') {
            return children({
                query: () => Promise.resolve({data: {}}),
                mutate: () => Promise.resolve({data: {}}),
            });
        }
        return children;
    },
};
