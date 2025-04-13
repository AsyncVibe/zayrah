import { APP_NAME } from "@/lib/constants";

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer className="border-t p-4 m-auto">
			{year} {APP_NAME}. All Rights Reserved.
		</footer>
	);
};

export default Footer;
