"use client";

import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";

const SignOutButton = () => {
	const handleSignOut = async () => {
		const res = await signOutUser();
		if (res.success) {
			console.log(res.message);
		}
		console.log(res);
	};
	return (
		<Button
			type="submit"
			variant="ghost"
			onClick={handleSignOut}
			className="w-full py-4 px-2 h-4 justify-start">
			Sign Out
		</Button>
	);
};

export default SignOutButton;
