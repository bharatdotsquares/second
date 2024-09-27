import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from "next-auth/providers/github"
import { authConfig } from '../auth.config';
import {z} from "zod"
import { AdapterUser } from 'next-auth/adapters';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from '@/lib/db';


interface User{
  name:string;
  email:string;
  image:string;
  emailVerified:string;
}

export const {handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(client),
  providers: [
    Credentials({
        credentials: {
            email: {
              label:'Email',
              type:"email",
              placeholder:"Enter Email"
            },
            password: {
              label:'Password',
              type:"password",
              placeholder:"Enter password"
            },
        },
        authorize:async (credentials)=> { // you have access to the original request as well
            // console.log(request)
            const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

            
            if(parsedCredentials.success) return {username:"hello",password:"world",name:"hello world"}

            return null;
            // return await getUser(credentials) // assuming it returns a User or null
          } 
    }),
    GithubProvider({
     clientId: process.env.GITHUB_ID!,
     clientSecret: process.env.GITHUB_SECRET!,
    }),
   ],
   callbacks: {
    async session({ session, token, user }) {
      session.user = token.user as AdapterUser & User
      return session;
    }, 
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});
