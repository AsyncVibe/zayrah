import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
export const config = {
	pages: {
		signIn: "/sign-in",
		error: "/sign-in",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
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
				token.id = user.id;
				token.role = user.role;
				if (user.name === "NO_NAME") {
					token.name = user.email.split("@")[0];
				}
				// update the db to reflect the new name
				await prisma.user.update({
					where: { id: user.id },
					data: { name: token.name },
				});
				// logic to make user cart persistent across sessions
				if (trigger === "signIn" || trigger === "signUp") {
					const cookiesObject = await cookies();
					const sessionCartId = cookiesObject.get("sessionCartId")?.value;
					if (sessionCartId) {
						const sessionCart = await prisma.cart.findFirst({
							where: { sessionCartId },
						});
						if (sessionCart) {
							// delete current user cart
							await prisma.cart.deleteMany({
								where: { userId: user.id },
							});
							// assign new cart
							await prisma.cart.update({
								where: { id: sessionCart.id },
								data: { userId: user.id },
							});
						}
					}
				}
			}
			// handle session update
			if (session?.user.name && trigger === "update") {
				token.name = session.user.name;
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
		authorized({ auth }: any) {
			return !!auth;
		},
	},
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
