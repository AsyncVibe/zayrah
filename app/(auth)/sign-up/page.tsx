import { auth } from "@/auth";
import SignUpForm from "@/components/shared/auth/SignUpForm";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "Sign up",
};
const SignInPage = async () => {
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
					<CardTitle className="text-center">Sign up</CardTitle>
					<CardDescription className="text-center">
						Sign up to your account
					</CardDescription>
				</CardHeader>
				<SignUpForm />
			</Card>
		</div>
	);
};

export default SignInPage;
