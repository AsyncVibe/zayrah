import SheetMenu from "@/components/shared/header/menu";
import { APP_NAME } from "@/lib/constants";
// import { Link, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./main-nav";
export default function RootLayout({
	children: children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="flex flex-col">
				<div className="border-b container mx-auto">
					<div className="flex h-16 items-center px-4">
						<Link href="/" className="w-22">
							<Image
								src="/images/logo.svg"
								alt="logo"
								width={48}
								height={48}
								priority={true}
							/>
						</Link>
						<MainNav className="mx-6" />

						<div className="ml-auto items-center flex space-x-4">
							<SheetMenu />
						</div>
					</div>
				</div>

				<main className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
					{children}
				</main>
			</div>
		</>
	);
}
