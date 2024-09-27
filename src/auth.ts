import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from "next-auth/providers/github"
import { authConfig } from '../auth.config';
import {z} from "zod"
import { AdapterUser } from 'next-auth/adapters';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from '@/lib/db';
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";  
import bcrypt from "bcryptjs";

interface User{ 
  email:string; 
  password:string;
}

export const {handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // adapter: MongoDBAdapter(client),
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
            .object({name: z.string(),email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);
         
            if (!parsedCredentials.success) {
              return {
                  errors: parsedCredentials.error.flatten().fieldErrors,
                  message: 'Missing Fields. Failed to Create Invoice.',
              };
            }

            await connectDB();
            const user = await User.findOne({
              email: credentials?.email,
            }).select("+password");
 
            if (!user){
              return {
                errors: [{email:"wrong email"}],
                message: 'Wrong Email',
              };
            }

            const passwordMatch = await bcrypt.compare(
              credentials!.password,
              user.password
            );

            if (!passwordMatch){
              return  {
                errors: [{password:"wrong password"}],
                message: 'Wrong password',
              };
            };
            let obj = {email:user.email,id:user._id}
            console.log(obj)
            return obj;

            if(!credentials.email){
              throw new CredentialsSignin({cause:"Email is required"})
            }
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
 