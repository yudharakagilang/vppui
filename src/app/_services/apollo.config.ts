import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink } from 'apollo-link';


@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule]
})
export class GraphQLConfigModule {
  constructor(apollo: Apollo, private httpClient: HttpClient) {
    // const httpLink = new HttpLink(httpClient).create({
    //   uri: 'http://35.173.73',

    // });

    // const subscriptionLink = new WebSocketLink({
    //   uri:
    //     'ws://35.1',
    //     options: {
    //         reconnect: true,
    //         connectionParams: {
    //         headers: {
    //           "x-hasura-admin-secret": "mylongsecretkey"
    //         }
    //     }
    //   }
    // });

    // const auth = setContext((operation, context) => ({
    //   headers: {
    //     "x-hasura-admin-secret": "mylongsecretkey"
    //   },
    // }));

    // const link =split(
    //   ({ query }) => {  
    //     let definition  = getMainDefinition(query);
    //     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    //   },
    //   subscriptionLink,
    //   auth.concat(httpLink),
    // );

    // apollo.create({
    //   link,
    //   cache: new InMemoryCache()
    // });
  }
}