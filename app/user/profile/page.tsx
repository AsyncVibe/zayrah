import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profileForm";
export const metadata = {
	title: "Customer Profile",
};
const ProfilePage = async () => {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<div className="max-w-md mx-auto space-y-4">
				<h2 className="h2-bold">Customer Profile</h2>
				{session?.user?.name}
				<ProfileForm />
			</div>
		</SessionProvider>
	);
};

export default ProfilePage;
