import Footer from "@/components/Footer";
import Header from "@/components/shared/header/Index";

export default function RootLayout({
	children: children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<main className="flex-1 wrapper">{children}</main>
			<Footer />
		</div>
	);
}
