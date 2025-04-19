import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
export const config = {
	pages: {
		signIn: "/sign-in",
		error: "/sign-in",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
		async session({ session, token }) {
			// set user id from token
			session.user.id = token.sub as string;
			return session;
		},
		// async session({ session, user, trigger, token }: any) {
		// 	// set user id from token
		// 	session.user.id = token.sub as string;
		// 	if (trigger === "update") {
		// 		session.user.name = user.name;
		// 	}
		// 	return session;
		// },
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			credentials: {
				email: { type: "email" },
				password: { type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					throw new Error("Invalid credentials");
				}
				const user = await prisma.user.findUnique({
					where: { email: credentials.email as string },
				});
				// check if user exists and if password is correct
				if (user && user.password) {
					const isMatched = compareSync(
						credentials.password as string,
						user.password
					);
					if (!isMatched) {
						throw new Error("Invalid User Password");
					}
					return {
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role,
					};
				}

				// if user does not exist or password does not match then return null
				return null;
			},
		}),
	],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
