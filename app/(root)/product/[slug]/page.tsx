import NotFoundPage from "@/app/not-found";
import AddToCart from "@/components/shared/product/AddToCart";
import ProductImages from "@/components/shared/product/ProductImages";
import ProductPrice from "@/components/shared/product/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
export const dynamic = "force-dynamic";

async function ProductDetailPage({
	params: { slug },
}: {
	params: { slug: string };
}) {
	const product = await getProductBySlug(slug);
	const {
		id,
		name,
		category,
		description,
		images,
		price,
		brand,
		rating,
		numReviews,
		stock,
		isFeatured,
		banner,
		createdAt,
	} = product;
	if (!product) return <NotFoundPage />;
	return (
		<>
			<section>
				<div className="grid grid-cols-1 md:grid-cols-5">
					<div className="md:col-span-2">
						{/* {images 2 cols} */}
						<ProductImages images={images} />
					</div>
					<div className="md:col-span-2">
						{/* {details two cols} */}
						<div className="flex flex-col gap-6">
							<p>
								{brand} {category}
							</p>
							<h1 className="h3-bold">{name}</h1>
							<p>
								{rating.toString()} of {numReviews} Reviews
							</p>
							<div className="flex flex-col sm:flex-row sm:items-center gap-3">
								<ProductPrice
									value={Number(price)}
									className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
								/>
							</div>
						</div>
						<div className="mt-10">
							{/* {description} */}
							<p className="font-semibold">Description</p>
							<p>{description}</p>
						</div>
					</div>
					<div className="sm:space-y-8">
						{/* action  1 col*/}
						<Card>
							<CardContent className="p-4">
								<div className="mb-2 flex justify-between">
									<div>Price</div>
									<div>
										<ProductPrice value={Number(price)} />
									</div>
								</div>
								<div className="mb-2 flex justify-between">
									<div>Status</div>
									<div>
										{stock > 0 ? (
											<Badge variant="outline">In Stock</Badge>
										) : (
											<Badge variant="destructive">Out of Stock</Badge>
										)}
									</div>
								</div>
								{stock > 0 && (
									// <Button className="w-full hover:scale-105 duration-300 transition-all ease-in-out">
									// 	Add to Cart
									// </Button>
									<AddToCart
										item={{
											productId: id,
											slug: slug,
											name: name,
											image: images[0],
											quantity: 1,
											price: price,
										}}
									/>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</>
	);
}

export default ProductDetailPage;
