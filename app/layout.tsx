import "@/assets/styles/globals.css";
import { Inter } from "next/font/google";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: `%s | ${APP_NAME}`,
	description: APP_DESCRIPTION,
	metadataBase: new URL(SERVER_URL),
};
export default function RootLayout({
	children: children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body cz-shortcut-listen="true" className={inter.className}>
				{children}
			</body>
		</html>
	);
}
