import { PAYMENT_METHODS } from "@/lib/constants";
import { z } from "zod";
// const currency = z.coerce.string().refine((val) => /^\d+\.\d{2}$/.test(val), {
// 	message: "Price must be a string with exactly 2 decimal places",
// });
// Schemas for Server Actions
// Product Schema
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
// Signin Form Schema
export const signInFormSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters",
	}),
});
// Sign Up form schema
export const signUpFormSchema = z
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
// cart item schema
export const cartItemSchema = z.object({
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
// Shipping Address Schema
export const shippingAddressSchema = z.object({
	fullName: z.string().min(3, "Name must be at least 3 characters"),
	streetAddress: z
		.string()
		.min(3, "Street address must be at least 3 characters"),
	city: z.string().min(3, "City must be at least 3 characters"),
	postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
	country: z.string().min(3, "Country must be at least 3 characters"),
	lat: z.number().optional(),
	lng: z.number().optional(),
});
// Schema for Payment method
export const paymentMethodSchema = z
	.object({
		type: z.string().min(1, "Payment method is required"),
	})
	.refine((data) => PAYMENT_METHODS.includes(data.type), {
		path: ["type"],
		message: "Invalid payment method",
	});

// Schema for inserting order
export const OrderSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	itemsPrice: z.string().min(1, "Items price is required"),
	totalPrice: z.string().min(1, "Total price is required"),
	taxPrice: z.string().min(1, "Total price is required"),
	shippingPrice: z.string().min(1, "Shipping price is required"),
	paymentMethod: z.string().min(1, "Payment method is required"),
	shippingAddress: shippingAddressSchema,
});
// schema for OrderItem
export const OrderItemSchema = z.object({
	productId: z.string(),
	slug: z.string(),
	image: z.string(),
	name: z.string(),
	price: z.string(),
	quantity: z.number(),
});
export const paymentResultSchema = z.object({
	id: z.string(),
	status: z.string(),
	update_time: z.string(),
	email_address: z.string(),
});
// Types for Client side
// Product Type
export type Product = z.infer<typeof ProductSchema> & {
	id: string;
	createdAt: Date;
	rating: string;
};
// Signinform type

export type SignInForm = z.infer<typeof signInFormSchema>;
// Signupform type

export type SignUpForm = z.infer<typeof signUpFormSchema>;

// cartitem type

export type CartItem = z.infer<typeof cartItemSchema>;
// Cart type

export type Cart = z.infer<typeof cartSchema>;
// shipping address type

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
// payment method type
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
// type for orderschema
export type Order = z.infer<typeof OrderSchema> & {
	id: string;
	createdAt: Date;
	isPaid: boolean;
	isDelivered: boolean;
	paidAt: Date | null;
	deliveredAt: Date | null;
	orderItems: OrderItem[];
	user: { name: string; email: string };
};
// OrderItem type
export type OrderItem = z.infer<typeof OrderItemSchema>;
// Payment Result
export type PaymentResult = z.infer<typeof paymentResultSchema>;
