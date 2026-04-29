import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_URL || "http://localhost:/graphql";

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

export const setAuthToken = (token: string) => {
  if (!token) {
    graphqlClient.setHeader("Authorization", "");
    return;
  }

  graphqlClient.setHeader("Authorization", "Bearer " + token);
};
