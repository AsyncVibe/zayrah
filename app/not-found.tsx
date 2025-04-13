"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const NotFoundPage = () => {
	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-muted px-4">
			<Image
				src="/images/logo.svg"
				width={64}
				height={64}
				alt="logo"
				className="mb-6"
			/>

			<div className="bg-background p-8 md:p-10 w-full max-w-lg rounded-2xl shadow-xl text-center border">
				<h1 className="text-4xl font-extrabold text-foreground mb-4">404</h1>
				<h2 className="text-xl font-semibold text-muted-foreground mb-2">
					Page Not Found
				</h2>
				<p className="text-sm text-muted-foreground mb-6">
					Sorry, the page you are looking for does not exist.
				</p>

				<Button
					variant="default"
					className="w-full md:w-auto"
					onClick={() => (window.location.href = "/")}>
					⬅ Go Back Home
				</Button>
			</div>
		</div>
	);
};

export default NotFoundPage;
