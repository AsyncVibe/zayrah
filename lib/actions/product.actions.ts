"use server";
// import { PrismaClient } from "@/lib/generated/prisma";
import { prisma } from "@/db/prisma";
// import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
export async function getLatestProducts() {
	// const prisma = new PrismaClient();
	const products = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: {
			createdAt: "desc",
		},
	});

	const plainProducts = JSON.parse(JSON.stringify(products));

	return plainProducts;
}
// get single product by its slug
export async function getProductBySlug(slug: string) {
	const product = await prisma.product.findFirst({
		where: {
			slug: slug,
		},
	});
	console.log(product);
	if (!product) {
		return {
			success: false,
			name: "Product not found",
		};
	}

	return product;
}
