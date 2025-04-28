"use server";
// import { PrismaClient } from "@/lib/generated/prisma";
import { prisma } from "@/db/prisma";
// import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { ProductSchema, updateProductSchema } from "@/types/validators";
import { z } from "zod";
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
	if (!product) {
		return {
			success: false,
			name: "Product not found",
		};
	}

	return product;
}
// Get all products
export async function getAllProducts({
	query,
	limit = PAGE_SIZE,
	page,
	category,
}: {
	query: string;
	limit?: number;
	page: number;
	category?: string;
}) {
	const data = await prisma.product.findMany({
		take: limit,
		skip: (page - 1) * limit,
	});
	const dataCount = await prisma.product.count();
	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
	};
}
// delete a product
export async function deleteProduct(id: string) {
	try {
		// find product first
		const productExists = await prisma.product.findFirst({
			where: { id: id },
		});
		if (!productExists) throw new Error("Product not found");
		await prisma.product.delete({
			where: { id: id },
		});
		revalidatePath("/admin/products");
		return { success: true, message: "Product deleted successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
// create a product
export async function createProduct(data: z.infer<typeof ProductSchema>) {
	try {
		const product = ProductSchema.parse(data);
		await prisma.product.create({
			data: product,
		});
		revalidatePath("/admin/products");
		return { success: true, message: "Product created successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
	try {
		const product = updateProductSchema.parse(data);
		// check if product exists
		const productExists = await prisma.product.findFirst({
			where: { id: product.id },
		});
		if (!productExists) throw new Error("Product not found");
		// update product
		await prisma.product.update({
			where: { id: product.id },
			data: product,
		});
		revalidatePath("/admin/products");
		return { success: true, message: "Product created successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
