"use server";
import { signInFormSchema, signUpFormSchema } from "@/types/validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
// signIn User with credentials: on frontend, we are using useFormHook, therefore, the first argument would previous state of unknown type.
export async function signInWithCredentials(
	prevState: unknown,
	formData: FormData
) {
	try {
		const user = signInFormSchema.parse({
			email: formData.get("email"),
			password: formData.get("password"),
		});
		const callbackUrl = formData.get("callbackUrl") as string;
		await signIn("credentials", {
			...user,
			redirect: true,
			callbackUrl: callbackUrl || "/",
		});
		return {
			success: true,
			message: "User signed in successfully",
		};
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}
		return {
			success: false,
			message: "User sign in failed",
		};
	}
}
// signOut User
export async function signOutUser() {
	await signOut();
	return {
		success: true,
		message: "User signed out successfully",
	};
}

// Update user name
export async function updateUserName(userId: string, name: string) {
	try {
		const user = await prisma.user.update({
			where: { id: userId },
			data: { name },
		});

		return {
			success: true,
			message: "User name updated successfully",
			user,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
// signUp User
export async function signUpUser(prevState: unknown, formData: FormData) {
	try {
		const rawData = {
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
			confirmPassword: formData.get("confirmPassword"),
		};
		// passing user object to validate it against schema

		const user = signUpFormSchema.parse(rawData);

		// hashing password for 10 rounds before saving into DB
		user.password = hashSync(user.password, 10);
		// checking if user already exists in DB
		const existingUser = await prisma.user.findUnique({
			where: {
				email: user.email,
			},
		});
		if (existingUser) {
			return {
				success: false,
				message: "User already exists",
			};
		}
		// creating user in DB
		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});

		return {
			success: true,
			message: "User signed up successfully",
		};
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}
		return {
			success: false,
			message: formatError(error),
		};
	}
}
