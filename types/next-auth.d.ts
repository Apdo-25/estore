import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
  interface User extends NextAuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "admin" | "user";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "admin" | "user";
    };
  }
}
