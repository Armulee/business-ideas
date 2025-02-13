import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
// import AppleProvider from "next-auth/providers/apple"
import FacebookProvider from "next-auth/providers/facebook"
// import LinkedinProvider from "next-auth/providers/linkedin"
import TwitterProvider from "next-auth/providers/twitter"
import EmailProvider from "next-auth/providers/email"
import { MongooseAdapter } from "@brendon1555/authjs-mongoose-adapter"

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://debugger:debugger@cluster0.ezjbt6b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_ID as string,
            clientSecret: process.env.TWITTER_SECRET as string,
            version: "2.0",
        }),
        // AppleProvider({
        //     clientId: process.env.APPLE_ID as string,
        //     clientSecret: process.env.APPLE_SECRET as string,
        // }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID as string,
            clientSecret: process.env.FACEBOOK_SECRET as string,
        }),
        // LinkedinProvider({
        //     clientId: process.env.LINKEDIN_ID as string,
        //     clientSecret: process.env.LINKEDIN_SECRET as string,
        // }),
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
    ],
    adapter: MongooseAdapter(MONGODB_URI),
    session: {
        strategy: "jwt",
    },
    pages: { signIn: "/signin" },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
