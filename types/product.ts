import { z } from "zod";
const currency = z.coerce.number().refine(
	(val) => {
		return /^\d+\.\d{2}$/.test(val.toFixed(2));
	},
	{
		message: "Price must have exactly 2 decimal places",
	}
);
export const ProductSchema = z.object({
	name: z.string().min(3, {
		message: "Name must be at least 3 characters",
	}),
	slug: z.string().min(3, {
		message: "Slug must be at least 3 characters",
	}),
	description: z.string().min(3, {
		message: "Description must be at least 3 characters",
	}),

	images: z.array(z.string()).min(1, {
		message: "At least one image is required",
	}),
	category: z.string().min(3),
	brand: z.string().min(3),
	stock: z.coerce.number().min(0),
	isFeatured: z.boolean(),
	banner: z.string().nullable(),
	price: currency,
});
export type Product = z.infer<typeof ProductSchema> & {
	id: string;
	createdAt: Date;
	rating: number;
};

// generator client {
//   provider        = "prisma-client-js"
//   output          = "../lib/generated/prisma"
//   previewFeatures = ["driverAdapters"]
// }

// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }

// // this is how we define our shchema
// model Product {
//   id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   name        String
//   slug        String   @unique(map: "product_slug_idx")
//   category    String
//   description String
//   images      String[]
//   price       Decimal  @default(0) @db.Decimal(12, 2)
//   brand       String
//   rating      Decimal  @default(0) @db.Decimal(3, 2)
//   numReviews  Int      @default(0)
//   stock       Int
//   isFeatured  Boolean  @default(false)
//   banner      String?
//   createdAt   DateTime @default(now()) @db.Timestamp(6)
// }
