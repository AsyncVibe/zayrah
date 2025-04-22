export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Zayrah";
export const APP_DESCRIPTION = "Zayrah is an ecommerce platform for clothing.";
export const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
	Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const signInDefaultValues = {
	email: "",
	password: "",
};
export const shippingAddressDefaultValues = {
	fullName: "John Doe",
	streetAddress: "123 Main St",
	city: "New York",
	postalCode: "10001",
	country: "USA",
};
