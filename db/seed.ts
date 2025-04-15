// this allowing use to upload the sample data to the database;we delete data first, to avoid duplicates
import { PrismaClient } from "@/lib/generated/prisma";
import sampleData from "./sample-data";
async function main() {
	const prisma = new PrismaClient();
	await prisma.product.deleteMany();
	await prisma.product.createMany({
		data: sampleData.products,
	});
	console.log("database seeded successfully...");
}
main();
