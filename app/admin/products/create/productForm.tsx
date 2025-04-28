"use client";

import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { productDefaultValues } from "@/lib/constants";
import {
	Product,
	ProductSchema,
	updateProductSchema,
} from "@/types/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ProductForm = ({
	type,
	product,
	productId,
}: {
	type: "create" | "update";
	product?: Product;
	productId?: string;
}) => {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof ProductSchema>>({
		resolver:
			type === "update"
				? zodResolver(updateProductSchema)
				: zodResolver(ProductSchema),
		defaultValues:
			product && type === "update" ? product : productDefaultValues,
	});
	return (
		<Form {...form}>
			<form className="space-y-8">
				<div className="flex flex-col md:flex-row gap-5">
					{/* {name and slug} */}
				</div>
				<div className="flex flex-col md:flex-row gap-5">
					{/* {category and brand} */}
				</div>
				<div className="flex flex-col md:flex-row gap-5">
					{/* {price and stock} */}
				</div>
				<div className="flex flex-col md:flex-row gap-5 upload-field">
					{/* {images} */}
				</div>
				<div className="upload-field">{/* isFeatured */}</div>
				<div>{/* description */}</div>
				<div>{/* submit */}</div>
			</form>
		</Form>
	);
};

export default ProductForm;
