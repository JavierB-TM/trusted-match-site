// app/lib/authOptions.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const hardcodedUser = {
          id: "1",
          email: "client@trustedmatch.com",
          password: "$2b$10$PZ09Rd0/5d1sp8fJPhmT4OYEYq.T3.Mxp0vMdgsxoJzQkybtXiRha", // "trusted123"
        };

        const isValid =
          credentials?.email === hardcodedUser.email &&
          (await bcrypt.compare(credentials.password || "", hardcodedUser.password));

        if (isValid) {
          return { id: hardcodedUser.id, email: hardcodedUser.email };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};
