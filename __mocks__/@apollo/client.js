const React = require('react');

const gql = (strings, ...args) => {
    const raw = typeof strings === 'string' ? strings : String.raw(strings, ...args);
    return {
        kind: 'Document',
        definitions: [],
        loc: {
            source: {
                body: raw,
                name: 'gql',
                locationOffset: {line: 1, column: 1},
            },
        },
    };
};

class ApolloClient {
    constructor(config) {
        this.config = config;
    }

    query() {
        return Promise.resolve({data: {}});
    }

    mutate() {
        return Promise.resolve({data: {}});
    }

    resetStore() {
        return Promise.resolve();
    }

    stop() {
    }
}

const useQuery = (query, options) => ({
    loading: false,
    error: undefined,
    data: {},
    refetch: jest.fn(),
});

const useMutation = () => [
    jest.fn(),
    {loading: false, error: undefined, data: {}},
];

const useApolloClient = () => new ApolloClient();

const useLazyQuery = () => [
    jest.fn(),
    {loading: false, error: undefined, data: {}},
];

const useSubscription = () => ({
    loading: false,
    error: undefined,
    data: {},
});

module.exports = {
    gql,
    ApolloClient,
    useQuery,
    useMutation,
    useApolloClient,
    useLazyQuery,
    useSubscription,
    InMemoryCache: class {
        constructor() {
            this.data = {};
        }

        readQuery() {
            return null;
        }

        writeQuery() {
        }

        evict() {
            return true;
        }

        gc() {
            return [];
        }
    },
};

module.exports.default = module.exports;
