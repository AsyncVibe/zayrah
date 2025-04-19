// this allowing use to upload the sample data to the database;we delete data first, to avoid duplicates
// import { sampleData } from "./sample-data";
import { prisma } from "./prisma";
import { sampleData } from "./sample-data";

async function main() {
	// const prisma = new PrismaClient();
	await prisma.product.deleteMany();
	await prisma.account.deleteMany();
	await prisma.session.deleteMany();
	await prisma.verificationToken.deleteMany();
	await prisma.user.deleteMany();
	await prisma.product.createMany({
		data: sampleData.products,
	});
	await prisma.user.createMany({
		data: sampleData.users,
	});
	console.log("database seeded successfully...");
}
main();
