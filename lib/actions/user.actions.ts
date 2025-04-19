"use server";
import { signInFormSchema } from "@/types/product";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
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
	// this will automatically kill the session, cookie, etc
	await signOut();
}
