import { graphqlClient } from "./graphql";
import type { LoginResponse, SignupResponse, User } from "../types/Authtypes";

export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const query = `
      mutation login($input: LoginInput!) {
        login(input: $input) {
         
          access_token
        }
      }
    `;

    const variables = {
      input: { email, password },
    };

    const response = await graphqlClient.request<{ login: LoginResponse }>(query, variables);
    return response.login;
  },

  signup: async (username: string, email: string, password: string, role: string): Promise<SignupResponse> => {
    const query = `
      mutation Signup($input: RegisterInput!) {
        signup(input: $input) {
          id
          username
          email
          role
        }
      }
    `;

    const variables = {
      input: { username, email, password, role },
    };

    const response = await graphqlClient.request<{ signup: SignupResponse }>(query, variables);
    return response.signup;
  },

  // Example protected query
  getCurrentUser: async (): Promise<User> => {
    const query = `
      query GetCurrentUser {
        me {
          id
          username
          email
          role
        }
      }
    `;

    const response = await graphqlClient.request<{ me: User }>(query);
    return response.me;
  },
};
