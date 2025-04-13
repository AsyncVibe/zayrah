import "@/assets/styles/globals.css";
import { Inter } from "next/font/google";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
const inter = Inter({ subsets: ["latin"] });
import { ThemeProvider } from "next-themes";
export const metadata = {
	title: {
		default: APP_NAME,
		template: `%s | ${APP_NAME}`,
	},
	description: APP_DESCRIPTION,
	metadataBase: new URL(SERVER_URL),
};
export default function RootLayout({
	children: children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body cz-shortcut-listen="true" className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
