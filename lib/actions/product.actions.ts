"use server";
import { PrismaClient } from "@/lib/generated/prisma";
// import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

export async function getLatestProducts() {
	const prisma = new PrismaClient();
	const products = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: {
			createdAt: "desc",
		},
	});
	// const plainProducts = convertToPlainObject(products);
	const plainProducts = products.map((p) => ({
		...p,
		price: p.price.toNumber(), // ✅ convert Decimal to number
		rating: p.rating.toNumber(),
	}));

	return plainProducts;
}
