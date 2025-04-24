"use server";
import {
	ShippingAddress,
	shippingAddressSchema,
	signInFormSchema,
	signUpFormSchema,
	paymentMethodSchema,
	PaymentMethod,
} from "@/types/validators";
import { auth, signIn, signOut } from "@/auth";
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
		await signIn("credentials", {
			...user,
		});
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

// Get user by id
export async function getUserById(userId: string) {
	const user = await prisma.user.findFirst({
		where: { id: userId },
	});
	if (!user) throw new Error("User not found");
	return user;
}
// update user's address
export async function updateUserAddress(data: ShippingAddress) {
	try {
		const session = await auth();
		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id },
		});
		if (!currentUser) throw new Error("User not found");
		const address = shippingAddressSchema.parse(data);
		await prisma.user.update({
			where: { id: currentUser.id },
			data: { address },
		});
		return {
			success: true,
			message: "User address updated successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
// update user's payment method
export async function updateUserPaymentMethod(data: PaymentMethod) {
	try {
		const session = await auth();
		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id },
		});
		if (!currentUser) throw new Error("User not found");
		const paymentMethod = paymentMethodSchema.parse(data);
		await prisma.user.update({
			where: { id: currentUser.id },
			data: { paymentMethod: paymentMethod.type },
		});
		return {
			success: true,
			message: "User payment method updated successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
