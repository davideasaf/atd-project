import React, { Component } from 'react';
import './App.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import BobRossDashboard from './components/BobRossDashboard';
import GlobalStyle from './theme/GlobalStyle';

const client = new ApolloClient({
  // TODO: Add to environment variable
  uri: 'http://35.245.122.227/graphql'
});

class App extends Component<{}, {}> {
  render() {
    return (
      <ApolloProvider client={client}>
        <GlobalStyle />
        <BobRossDashboard />
      </ApolloProvider>
    );
  }
}

export default App;
