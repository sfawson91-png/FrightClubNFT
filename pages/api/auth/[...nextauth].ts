import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Minimal placeholder: no real login, just avoids 404s and satisfies hooks
export default NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { username: {}, password: {} },
      async authorize() {
        // No actual login. Return null to keep user logged-out.
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
});
