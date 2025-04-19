"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
interface SignInFormProps {
	callbackUrl?: string;
}

const SignInForm = ({ callbackUrl: propCallbackUrl }: SignInFormProps) => {
	// useFormState takes two arguments, the first is the function to be called when the form is submitted, and the second is the initial state of the form
	const [data, action] = useActionState(signInWithCredentials, {
		success: false,
		message: "",
	});
	const searchParams = useSearchParams();
	// Use the prop value if provided, otherwise fall back to URL parameter
	const callbackUrl = propCallbackUrl || searchParams.get("callbackUrl") || "/";
	const SignInButton = () => {
		const { pending } = useFormStatus();
		return (
			<Button className="w-full" disabled={pending} variant={"default"}>
				{pending ? "Signing In..." : "Sign In"}
			</Button>
		);
	};
	return (
		<form action={action}>
			<input type="hidden" value={callbackUrl} name="callbackUrl" />
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
				{data && !data.success && (
					<div className="text-center text-destructive">{data.message}</div>
				)}
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
