"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
	// useFormState takes two arguments, the first is the function to be called when the form is submitted, and the second is the initial state of the form
	const [data, action] = useActionState(signUpUser, {
		success: false,
		message: "",
		errors: {}, // 🔥 handle field errors here
	});
	const router = useRouter();
	useEffect(() => {
		if (data.success) {
			console.log("success", data.message);
			router.push("/sign-in"); // 👈 don’t forget the slash!
		}
	}, [data.success, data.message, router]);

	// Use the prop value if provided, otherwise fall back to URL parameter
	const SignUpButton = () => {
		const { pending } = useFormStatus();
		return (
			<Button className="w-full" disabled={pending} variant={"default"}>
				{pending ? "Signing up..." : "Sign Up"}
			</Button>
		);
	};
	return (
		<form action={action}>
			<div className="space-y-4">
				<div>
					<Label htmlFor="name" className="mb-2 ml-2">
						Name
					</Label>
					<Input
						id="name"
						type="name"
						autoComplete="name"
						name="name"
						required
					/>
					{data?.errors?.name && (
						<p className="text-destructive text-sm ml-2">
							{data.errors.name[0]}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="email" className="mb-2 ml-2">
						Email
					</Label>
					<Input
						id="email"
						type="email"
						autoComplete="Email"
						name="email"
						required
					/>
					{data?.errors?.email && (
						<p className="text-destructive text-sm ml-2">
							{data.errors.email[0]}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="password" className="mb-2 ml-2">
						Password
					</Label>
					<Input
						id="password"
						type="password"
						autoComplete="Password"
						name="password"
						required
					/>
					{data?.errors?.password && (
						<p className="text-destructive text-sm ml-2">
							{data.errors.password[0]}
						</p>
					)}
				</div>
				<div>
					<Label htmlFor="password" className="mb-2 ml-2">
						Confirm Password
					</Label>
					<Input
						id="confirmPassword"
						type="password"
						autoComplete="confirmPassword"
						name="confirmPassword"
						required
					/>
					{data?.errors?.confirmPassword && (
						<p className="text-destructive text-sm ml-2">
							{data.errors.confirmPassword[0]}
						</p>
					)}
				</div>
				<div>
					<SignUpButton />
				</div>
				{data && !data.success && (
					<div className="text-center text-destructive">{data.message}</div>
				)}
				<div className="text-sm text-center text-muted-foreground">
					Aleady have an account?{" "}
					<Link href="/sign-in" target="_self" className="link">
						Sign In
					</Link>
				</div>
			</div>
		</form>
	);
};

export default SignUpForm;
