import NextAuth from "next-auth";

declare module "next-auth" {
  export interface User {
    id: string;
    username: string;
    mobile: string;
    verification: boolean;
  }

  export interface Session {
    user: {
      id: string;
      username: string;
      mobile: string;
      verification: boolean;
    };
  }
}
