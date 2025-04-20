import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
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
		async jwt({ token, user, trigger, session }: any) {
			if (user) {
				token.role = user.role;
				if (user.name === "NO_NAME") {
					token.name = user.email.split("@")[0];
				}
				// update the db to reflect the new name
				await prisma.user.update({
					where: { id: user.id },
					data: { name: token.name },
				});
			}
			return token;
		},
		async session({ session, user, trigger, token }: any) {
			session.user.id = token.sub as string;
			session.user.role = token.role as string;
			session.user.name = token.name as string;
			if (trigger === "update") {
				session.user.name = user.name;
			}
			return session;
		},
		// authorized({ request, auth }: any) {
		// 	//check for session cart cookie
		// 	if (!request.cookies.get("sessionCartId")) {
		// 		// Generate new session cart ID cookie
		// 		const sessionCartId = crypto.randomUUID();
		// 		// clone the request header
		// 		const newRequestHeaders = new Headers(request.headers);
		// 		// create new response and add new headers
		// 		const response = NextResponse.next({
		// 			request: {
		// 				headers: newRequestHeaders,
		// 			},
		// 		});
		// 		// set new cookie
		// 		response.cookies.set("sessionCartId", sessionCartId);
		// 		return response;
		// 	} else {
		// 		return true;
		// 	}
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
