import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
// Convert Prisma object to regular JS object in TS
export function convertToPlainObject<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}
// format number with decimal places
// export function formatNumberWithDecimalPlaces(num: number): string {
// 	const [int, decimal] = num.toString().split(".");
// 	return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
// }
export function formatNumberWithDecimalPlaces(num: number): string {
	return num.toFixed(2);
}
// handling errors with zod
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
	// handling zod errors
	if (error.name === "ZodError") {
		const fieldErrors = Object.keys(error.errors).map((key) => {
			return {
				field: key,
				message: error.errors[key][0],
			};
		});
		return fieldErrors.join(". ");
	} else if (
		error.name === "PrismaClientKnownRequestError" &&
		error.code === "P2002"
	) {
		// handle unique constraint
		const field = error.meta?.target ? error.meta.target[0] : "";
		return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
	} else {
		// handle other errors
		return typeof error.message === "string"
			? error.message
			: JSON.stringify(error.message);
	}
}
