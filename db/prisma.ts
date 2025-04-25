// prisma.ts
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

if (!process.env.DATABASE_URL) {
	throw new Error("❌ DATABASE_URL is missing in .env file");
}

let prisma: PrismaClient;

const extendedPrisma = () =>
	new PrismaClient().$extends({
		result: {
			product: {
				price: {
					needs: { price: true },
					compute(product) {
						return product.price instanceof Decimal
							? product.price.toString()
							: product.price;
					},
				},
				rating: {
					needs: { rating: true },
					compute(product) {
						return product.rating instanceof Decimal
							? product.rating.toString()
							: product.rating;
					},
				},
			},
			cart: {
				itemsPrice: {
					needs: { itemsPrice: true },
					compute(cart) {
						return cart.itemsPrice.toString() as string;
					},
				},
				totalPrice: {
					needs: { totalPrice: true },
					compute(cart) {
						return cart.totalPrice.toString();
					},
				},
				shippingPrice: {
					needs: { shippingPrice: true },
					compute(cart) {
						return cart.shippingPrice.toString();
					},
					taxPrice: {
						needs: { taxPrice: true },
						compute(cart) {
							return cart.taxPrice.toString();
						},
					},
				},
			},
			order: {
				itemsPrice: {
					needs: { itemsPrice: true },
					compute(cart) {
						return cart.itemsPrice.toString() as string;
					},
				},
				totalPrice: {
					needs: { totalPrice: true },
					compute(cart) {
						return cart.totalPrice.toString();
					},
				},
				shippingPrice: {
					needs: { shippingPrice: true },
					compute(cart) {
						return cart.shippingPrice.toString();
					},
					taxPrice: {
						needs: { taxPrice: true },
						compute(cart) {
							return cart.taxPrice.toString();
						},
					},
				},
			},
			orderItem: {
				price: {
					needs: { price: true },
					compute(product) {
						return product.price.toString();
					},
				},
			},
		},
	});

if (process.env.NODE_ENV === "production") {
	prisma = extendedPrisma();
} else {
	// @ts-ignore
	if (!global.prisma) {
		// @ts-ignore
		global.prisma = extendedPrisma();
	}
	// @ts-ignore
	prisma = global.prisma;
}

export { prisma };
