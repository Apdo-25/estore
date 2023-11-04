import { User as NextAuthUser } from "next-auth";
import { JWT as NextAuthJWT, Session as NextAuthSession } from "next-auth";

declare module "next-auth" {
  interface User extends NextAuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "admin" | "user";
  }

  interface Session extends NextAuthSession {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "admin" | "user";
    };
    guestSessionId?: string;
  }

  interface JWT extends NextAuthJWT {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: "admin" | "user";
    guestSessionId?: string;
  }
}
