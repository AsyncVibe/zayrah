"use server";
import { CartItem } from "@/types/validators";
import { prisma } from "@/db/prisma";

// add item to the cart
export async function addItemToCart(item: CartItem) {
	return {
		success: true,
		message: "Item added to cart successfully",
	};
}
