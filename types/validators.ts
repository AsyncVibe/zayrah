import { z } from "zod";
// const currency = z.coerce.string().refine((val) => /^\d+\.\d{2}$/.test(val), {
// 	message: "Price must be a string with exactly 2 decimal places",
// });
const ProductSchema = z.object({
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
const signInFormSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters",
	}),
});

export type SignInForm = z.infer<typeof signInFormSchema>;
// schema for signing user up
const signUpFormSchema = z
	.object({
		name: z.string().min(3, {
			message: "Name must be at least 3 characters",
		}),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, {
			message: "Password must be at least 6 characters",
		}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
export type SignUpForm = z.infer<typeof signUpFormSchema>;

// cart Item schema
const cartItemSchema = z.object({
	productId: z.string().min(1, {
		message: "Product ID is required",
	}),
	name: z.string().min(1, {
		message: "Product name is required",
	}),
	slug: z.string().min(1, {
		message: "Product slug is required",
	}),
	image: z.string().min(1, {
		message: "Product image is required",
	}),
	quantity: z.number().min(1, {
		message: "Quantity must be at least 1",
	}),
	price: z.string().min(1, {
		message: "Product price is required",
	}),
});
export type CartItem = z.infer<typeof cartItemSchema>;
// Cart Schema
export const cartSchema = z.object({
	items: z.array(cartItemSchema),
	itemsPrice: z.string(),
	totalPrice: z.string(),
	shippingPrice: z.string(),
	taxPrice: z.string(),
	sessionCartId: z.string().min(1, {
		message: "Session cart ID is required",
	}),
	userId: z.string().optional().nullable(),
});
export type Cart = z.infer<typeof cartSchema>;
