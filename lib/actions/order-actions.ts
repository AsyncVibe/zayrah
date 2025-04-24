"use server";
// create order
import { CartItem, OrderSchema } from "@/types/validators";
import { getUserById } from "./user.actions";
import { prisma } from "@/db/prisma";
import { cookies } from "next/headers";
import { auth } from "@/auth";
// import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatError } from "../utils";

export async function createOrder() {
	try {
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		if (!sessionCartId) {
			throw new Error("Cart not found");
		}
		const session = await auth();
		const userId = session?.user?.id ? (session.user.id as string) : undefined;
		if (!userId) throw new Error("User not found");
		const user = await getUserById(userId);
		const cart = await prisma.cart.findFirst({
			where: userId ? { userId } : { sessionCartId: sessionCartId },
		});
		if (!cart || cart.items.length === 0)
			return { success: false, message: "Cart is empty", redirectTo: "/cart" };
		if (!user.address)
			return {
				success: false,
				message: "User not found",
				redirectTo: "/shipping-address",
			};
		if (!user.paymentMethod)
			return {
				success: false,
				message: "User not found",
				redirectTo: "/payment-method",
			};
		const order = OrderSchema.parse({
			userId: userId,
			shippingAddress: user.address,
			paymentMethod: user.paymentMethod,
			itemsPrice: cart.itemsPrice.toString(),
			shippingPrice: cart.shippingPrice.toString(),
			taxPrice: cart.taxPrice.toString(),
			totalPrice: cart.totalPrice.toString(),
		});
		// create a transaction to create order and order item in database
		const insertedOrderId = await prisma.$transaction(async (tx) => {
			// create order
			const insertedOrder = await tx.order.create({ data: order });
			// create order item from the cart
			for (const item of cart.items as CartItem[]) {
				await tx.orderItem.create({
					data: {
						...item,
						price: item.price,
						orderId: insertedOrder.id,
					},
				});
			}
			// clear cart
			await tx.cart.update({
				where: { id: cart.id },
				data: {
					items: [],
					totalPrice: 0,
					taxPrice: 0,
					shippingPrice: 0,
					itemsPrice: 0,
				},
			});
			return insertedOrder.id;
		});
		if (!insertedOrderId) throw new Error("Order not created");
		return {
			success: true,
			message: "Order created",
			redirectTo: `/order/${insertedOrderId}`,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
// Get order by id
export async function getOrderById(orderId: string) {
	const order = await prisma.order.findFirst({
		where: { id: orderId },
		include: {
			orderitems: true,
			user: { select: { name: true, email: true } },
		},
	});
	return convertToPlainObject(order);
}
