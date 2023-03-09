import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import TwitterProvider from "next-auth/providers/twitter";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import WordpressProvider from "next-auth/providers/wordpress";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./../../../prisma/prismaContext"
import useDebug from "../../../hooks/useDebug";
const {debug, error} = useDebug({fileName: "api/auth/nextauth"})

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.NEXT_PUBLIC_EMAIL_SERVER_HOST,
        port: process.env.NEXT_PUBLIC_EMAIL_SERVER_PORT,
        auth: {
          user: process.env.NEXT_PUBLIC_EMAIL_SERVER_USER,
          pass: process.env.NEXT_PUBLIC_EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.NEXT_PUBLIC_EMAIL_FROM,
    }),
    TwitterProvider({
      clientId: process.env.NEXT_PUBLIC_TWITTER_ID!,
      clientSecret: process.env.NEXT_PUBLIC_TWITTER_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_ID!,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_SECRET!,
    }),
    WordpressProvider({
      clientId: process.env.NEXT_PUBLIC_WORDPRESS_ID!,
      clientSecret: process.env.NEXT_PUBLIC_WORDPRESS_SECRET!,
    }),
    // CredentialsProvider({
    //   credentials: {
    //     email: { label: 'Email', type: 'text ', placeholder: 'jsmith@example.com' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials, req) {
    //     // You need to provide your own logic here that takes the credentials
    //     // submitted and returns either a object representing a user or value
    //     // that is false/null if the credentials are invalid.
    //     // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
    //     // You can also use the `req` object to obtain additional parameters
    //     // (i.e., the request IP address)
    //     const res = await fetch('http://localhost:3000/api/login', {
    //       method: 'POST',
    //       body: JSON.stringify(credentials),
    //       headers: { 'Content-Type': 'application/json' },
    //     });
    //     const user = await res.json();

    //     // If no error and we have user data, return it
    //     if (res.ok && user) {
    //       return user;
    //     }
    //     // Return null if user data could not be retrieved
    //   },
    // }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
  ],

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.NEXT_PUBLIC_SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    strategy: "database",

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: "/login", // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    newUser: "/account", // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn(user, account, profile) { return true },
    // async redirect(url, baseUrl) { return baseUrl },
    // @ts-ignore
    // async session(session, user) { return session },
    // async jwt(token, user, account, profile, isNewUser) { return token }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {
    signIn: async ({ user, account, profile, isNewUser }) => {
      try {
        let prismaUser = await prisma.user.findUnique({
          where: { email: user.email || undefined },
          include: { membership: true },
        });
        if (isNewUser) {
          debug(`We have a new user!!!!!!!!!!`, user);
        }
      } catch (e) {
        error('signIn Error',{error: e,user})
      }
    },
  },

  // Enable debug messages in the console if you are having problems
  // debug: true,
});
