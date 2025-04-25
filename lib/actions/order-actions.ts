"use server";
// create order
import { CartItem, OrderSchema, PaymentResult } from "@/types/validators";
import { getUserById } from "./user.actions";
import { prisma } from "@/db/prisma";
import { cookies } from "next/headers";
import { auth } from "@/auth";
// import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { paypal } from "../paypal";
import { threadId } from "worker_threads";

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

// create new paypal order
export async function createPaypalOrder(orderId: string) {
	try {
		// get order from db
		const order = await prisma.order.findFirst({
			where: { id: orderId },
		});
		if (!order) throw new Error("Order not found");
		// create paypal order
		const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
		// update order with paypal order id
		await prisma.order.update({
			where: { id: orderId },
			data: {
				paymentResult: {
					id: paypalOrder,
					email_address: "",
					status: "",
					pricePaid: 0,
				},
			},
		});
		return {
			success: true,
			message: "Order created successfully",
			data: paypalOrder,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
//capture the payment action when client approves the payment
export async function approvePaypalOrder(
	orderId: string,
	data: { orderID: string }
) {
	try {
		// get order from db
		const order = await prisma.order.findFirst({
			where: { id: orderId },
		});
		if (!order) throw new Error("Order not found");
		// capture order by the paypal order id
		const captureData = await paypal.captureOrder(data.orderID);
		if (
			!captureData ||
			captureData.id !== (order.paymentResult as PaymentResult)?.id ||
			captureData.status !== "COMPLETED"
		) {
			throw new Error("Error in Paypal Payment");
		}
		// update order to paid
		await updateOrderToPaid({
			orderId,
			paymentResult: {
				id: captureData.id,
				status: captureData.status,
				email_address: captureData.payer.email_address,
				pricePaid:
					captureData.purchase_units[0]?.payments?.captures[0]?.amount.value,
			},
		});
		// revalidate path
		revalidatePath(`/order/${orderId}`);
		return {
			success: true,
			message: "Your order has been paid.",
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
// Update order to paid
async function updateOrderToPaid({
	orderId,
	paymentResult,
}: {
	orderId: string;
	paymentResult?: PaymentResult;
}) {
	const order = await prisma.order.findFirst({
		where: { id: orderId },
		include: {
			orderitems: true,
		},
	});
	if (!order) throw new Error("Order not found");
	if (order.isPaid) throw new Error("Order already paid");
	// update order to paid
	// Transaction to update order and account for product stock
	await prisma.$transaction(async (tx) => {
		for (const item of order.orderitems) {
			await tx.product.update({
				where: { id: item.productId },
				data: { stock: { increment: -item.quantity } },
			});
		}
		// set the order to paid
		await tx.order.update({
			where: { id: orderId },
			data: {
				isPaid: true,
				paidAt: new Date(),
				paymentResult: paymentResult,
			},
		});
	});
	// get updated order after the transaction
	const updatedOrder = await prisma.order.findFirst({
		where: { id: orderId },
		include: {
			orderitems: true,
			user: { select: { name: true, email: true } },
		},
	});
	if (!updatedOrder) throw new Error("Order not found");
	return updatedOrder;
}
