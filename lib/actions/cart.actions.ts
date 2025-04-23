"use server";
import { CartItem, cartItemSchema, cartSchema } from "@/types/validators";
import { prisma } from "@/db/prisma";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { get } from "http";
// calculate cart prices
const calcPrice = (items: CartItem[]) => {
	const itemPrice = round2(
			items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
		),
		shippingPrice = round2(itemPrice > 100 ? 0 : 10),
		taxPrice = round2(0.15 * itemPrice),
		totalPrice = round2(itemPrice + shippingPrice + taxPrice);
	return {
		itemsPrice: itemPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice.toFixed(2),
		totalPrice: totalPrice.toFixed(2),
	};
};
// add item to the cart
export async function addItemToCart(data: CartItem) {
	try {
		//check for Cart cookies
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		if (!sessionCartId) {
			throw new Error("Cart not found");
		}
		// Get Session and User ID
		const session = await auth();
		const userId = session?.user?.id ? (session.user.id as string) : undefined;
		// parse and validate items
		const item = cartItemSchema.parse(data);
		// Get Cart from the function we defined below
		const cart = await getMyCart();

		// find product in DB
		const product = await prisma.product.findFirst({
			where: {
				id: item.productId,
			},
		});
		if (!product) {
			throw new Error("Product not found");
		}
		if (!cart) {
			const newCart = cartSchema.parse({
				userId: userId,
				items: [item],
				...calcPrice([item]),
				sessionCartId,
			});
			// create new cart
			await prisma.cart.create({
				data: newCart,
			});
			revalidatePath(`/product/${product.slug}`);
			return { success: true, message: `${product.name} added to cart` };
		} else {
			// check if item already exists in the cart
			const existingItem = (cart.items as CartItem[]).find(
				(cartItem) => cartItem.productId === item.productId
			);
			// if item already exists, update quantity
			if (existingItem) {
				// check stock availablity
				if (product.stock < existingItem.quantity + 1) {
					throw new Error("Not Enough Stock available for this product");
				}
				// update quantity
				(cart.items as CartItem[]).find(
					(x) => x.productId === item.productId
				)!.quantity = existingItem.quantity + 1;
			} else {
				// if item does not exist
				// check stock
				if (product.stock < 1)
					throw new Error("Not Enough Stock available for this product");
				// Add item to the cart.items
				cart.items.push(item);
			}
			// save to db
			await prisma.cart.update({
				where: { id: cart.id },
				data: {
					items: cart.items,
					...calcPrice(cart.items as CartItem[]),
				},
			});
			revalidatePath(`/product/${product.slug}`);
			return {
				success: true,
				message: `${product.name} ${
					existingItem ? "updated" : "added"
				} to cart`,
			};
		}
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
export async function getMyCart() {
	// check for the cookies
	const sessionCartId = (await cookies()).get("sessionCartId")?.value;
	if (!sessionCartId) throw new Error("Cart not found");
	// get session and the user id
	// const session = await auth();
	// const userId = session?.user?.id ? (session.user.id as string) : undefined;
	// get the cart from the db
	const cart = await prisma.cart.findFirst({
		// where: userId ? { userId } : { id: sessionCartId },
		where: { sessionCartId: sessionCartId },
	});
	if (!cart) return undefined;
	// convert decimals into string and return
	return convertToPlainObject({
		...cart,
		items: cart.items as CartItem[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
	});
}
// update item from Cart
export async function removeItemInCart(data: CartItem) {
	try {
		// check for the cart cookies
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		if (!sessionCartId) throw new Error("Cart not found");
		// get product
		const product = await prisma.product.findFirst({
			where: {
				id: data.productId,
			},
		});
		if (!product) throw new Error("Product not found");
		// get user cart
		const cart = await getMyCart();
		if (!cart) throw new Error("Cart not found");
		// check if item exists in cart
		const existingItem = (cart.items as CartItem[]).find(
			(cartItem) => cartItem.productId === data.productId
		);
		if (!existingItem) throw new Error("Item not found in cart");
		//      check if the item is only one
		if (existingItem.quantity === 1) {
			// remove item from cart
			cart.items = (cart.items as CartItem[]).filter(
				(x) => x.productId !== data.productId
			);
		} else {
			// decrese quantity
			(cart.items as CartItem[]).find(
				(x) => x.productId === data.productId
			)!.quantity = existingItem.quantity - 1;
		}
		// save to db
		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: cart.items,
				...calcPrice(cart.items as CartItem[]),
			},
		});
		// revalidate
		revalidatePath(`/product/${product.slug}`);
		return { success: true, message: `${product.name} removed from cart` };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
