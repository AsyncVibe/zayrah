import SignInForm from "@/components/shared/auth/SignInForm";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
	title: "Sign In",
};
const SignInPage = async ({
	searchParams,
}: {
	searchParams: { callbackUrl?: string };
}) => {
	const session = await auth();
	// callback will allow the user to return to the same page at which he was before signing in
	const callbackUrl = searchParams.callbackUrl;
	console.log("-------", callbackUrl);
	if (session) {
		return redirect(callbackUrl || "/");
	}
	return (
		<div className="w-full max-w-md mx-auto">
			<Card className="p-2">
				<CardHeader className="space-y-4">
					<Link href="/" className="flex-center">
						<Image
							src="/images/logo.svg"
							width={100}
							height={100}
							alt="logo"
							priority={true}
						/>
					</Link>
					<CardTitle className="text-center">Sign In</CardTitle>
					<CardDescription className="text-center">
						Sign in to your account
					</CardDescription>
				</CardHeader>
				{/* Pass the callbackUrl as a prop to SignInForm */}
				<SignInForm callbackUrl={searchParams?.callbackUrl || "/"} />
			</Card>
		</div>
	);
};

export default SignInPage;
