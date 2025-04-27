import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
	title: "Unauthorized Access",
};
const UnauthorizedPage = () => {
	return (
		<div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]">
			<h1 className="text-4xl font-bold">Unauthorized Access</h1>
			<p className="text-lg text-muted-foreground">
				You do not have access to this page
			</p>
			<Button asChild>
				<Link href={"/"}>Return Home</Link>
			</Button>
		</div>
	);
};

export default UnauthorizedPage;
