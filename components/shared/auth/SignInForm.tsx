"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useState } from "react";
const SignInForm = () => {
	const [error, setError] = useState<string>("");

	// Use the prop value if provided, otherwise fall back to URL parameter
	async function onSubmit(formData: FormData) {
		try {
			setError("");
			await signInWithCredentials(null, formData);
		} catch (err) {
			console.log(err);
			setError("Invalid credentials");
		}
	}
	const SignInButton = () => {
		const { pending } = useFormStatus();
		return (
			<Button className="w-full" disabled={pending} variant={"default"}>
				{pending ? "Signing In..." : "Sign In"}
			</Button>
		);
	};
	return (
		<form action={onSubmit}>
			<div className="space-y-4">
				<div>
					<Label htmlFor="email" className="mb-2 ml-2">
						Email
					</Label>
					<Input
						id="email"
						type="email"
						autoComplete="Email"
						name="email"
						defaultValue={signInDefaultValues.email}
						required
					/>
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
						defaultValue={signInDefaultValues.password}
						required
					/>
				</div>
				<div>
					<SignInButton />
				</div>
				{error && <div className="text-center text-destructive">{error}</div>}
				<div className="text-sm text-center text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link href="/sign-up" target="_self" className="link">
						Sign Up
					</Link>
				</div>
			</div>
		</form>
	);
};

export default SignInForm;
