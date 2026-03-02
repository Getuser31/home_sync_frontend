import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import {ApolloProvider} from '@apollo/client/react';
import HomeComponent from "./HomeComponent";

const link = createHttpLink({
    uri: "http://127.0.0.1:8000/graphql"
})
const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <h1>HouseSync: Home Automation</h1>
                    <HomeComponent />
            </div>
        </ApolloProvider>
    );
}

export default App;
