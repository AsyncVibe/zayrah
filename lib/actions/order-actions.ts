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
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";

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
// get user's orders
export async function getMyOrders({
	limit = PAGE_SIZE,
	page = 1,
}: {
	limit?: number;
	page?: number;
}) {
	const session = await auth();
	const userId = session?.user?.id;
	if (!userId) throw new Error("User is not authorized");
	const data = await prisma.order.findMany({
		where: { userId: userId! },
		orderBy: { createdAt: "desc" },
		take: limit,
		skip: (page - 1) * limit,
	});
	const dataCount = await prisma.order.count({
		where: { userId: userId! },
	});
	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
	};
}
// Get sales data and order summary
type SalesDataType = {
	month: string;
	totalSales: number;
}[];
export async function getSalesData() {
	// get count for each resource
	const ordersCount = await prisma.order.count();
	const productsCount = await prisma.product.count();
	const usersCount = await prisma.user.count();
	// calculate the total sales
	const totalSales = await prisma.order.aggregate({
		_sum: { totalPrice: true },
	});
	// get monthally sales
	const salesDataRaw = await prisma.$queryRaw<
		Array<{
			month: string;
			totalSales: Prisma.Decimal;
		}>
	>`SELECT
		TO_CHAR("createdAt", 'YYYY-MM') as "month",
		SUM("totalPrice") as "totalSales"
	FROM "Order"
	GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
	ORDER BY "month"`;
	const salesData: SalesDataType = salesDataRaw.map((item) => ({
		month: item.month,
		totalSales: Number(item.totalSales),
	}));
	// get latest sales
	const latestSales = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
		take: 6,
		include: {
			user: { select: { name: true } },
		},
	});
	return {
		ordersCount,
		productsCount,
		usersCount,
		totalSales: Number(totalSales._sum.totalPrice),
		salesData,
		latestSales,
	};
}
// get all orders action
export async function getAllOrders({
	limit,
	page,
}: {
	limit?: number;
	page?: number;
}) {
	const pageNumber = Number(page) || 1;
	const limitNumber = Number(limit) || PAGE_SIZE;

	const data = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
		take: limitNumber,
		skip: (pageNumber - 1) * limitNumber,
		include: {
			user: { select: { name: true } },
		},
	});

	const dataCount = await prisma.order.count();

	return {
		data,
		totalPages: Math.ceil(dataCount / limitNumber),
	};
}
//  delete an order
export async function deleteOrder(orderId: string) {
	try {
		await prisma.order.delete({
			where: { id: orderId },
		});
		revalidatePath("/admin/orders");
		return { success: true, message: "Order deleted successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
// updade COD order to paid
export async function markOrderPaidCOD(orderId: string) {
	try {
		await updateOrderToPaid({ orderId });
		revalidatePath(`/order/${orderId}`);
		return {
			success: true,
			message: "Order marked as paid",
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
// update the order to be delivered
export async function markOrderDelivered(orderId: string) {
	try {
		// find the order first
		const order = await prisma.order.findFirst({
			where: { id: orderId },
		});
		if (!order) throw new Error("Order not found");
		if (!order.isPaid) throw new Error("Order is not paid");
		await prisma.order.update({
			where: { id: orderId },
			data: {
				isDelivered: true,
				deliveredAt: new Date(),
			},
		});
		revalidatePath(`/order/${orderId}`);
		return {
			success: true,
			message: "Order marked as delivered",
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
