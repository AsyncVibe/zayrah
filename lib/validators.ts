import { z } from "zod";
import { formatNumberWithDecimalPlaces } from "./utils";
// Schema for inserting products
const currency = z
	.string()
	.refine(
		(value) =>
			/^\d+(\.\d{2})?$/.test(formatNumberWithDecimalPlaces(Number(value))),
		"Price must be a number with up to 2 decimal places"
	);
export const insertProductSchema = z.object({
	name: z.string().min(3, {
		message: "Name must be at least 3 characters",
	}),
	slug: z.string().min(3, {
		message: "Slug must be at least 3 characters",
	}),
	description: z.string().min(3, {
		message: "Description must be at least 3 characters",
	}),

	images: z.array(z.string()).min(1, {
		message: "At least one image is required",
	}),
	category: z.string().min(3),
	brand: z.string().min(3),
	stock: z.coerce.number().min(0),
	isFeatured: z.boolean(),
	banner: z.string().nullable(),
	price: currency,
});
