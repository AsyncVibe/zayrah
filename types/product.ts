import { z } from "zod";
// const currency = z.coerce.string().refine((val) => /^\d+\.\d{2}$/.test(val), {
// 	message: "Price must be a string with exactly 2 decimal places",
// });
export const ProductSchema = z.object({
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
	price: z.string(),
});
export type Product = z.infer<typeof ProductSchema> & {
	id: string;
	createdAt: Date;
	rating: string;
};
// schema for signing user in
export const signInFormSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters",
	}),
});

export type SignInForm = z.infer<typeof signInFormSchema>;
