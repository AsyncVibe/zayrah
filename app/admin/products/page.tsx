import { authGuard } from "@/lib/auth-guard";
import { getAllProducts, deleteProduct } from "@/lib/actions/product.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import { formatCurrency } from "@/lib/utils";
import DeleteDialogue from "@/components/shared/delete-dialogue";
const ProductsPage = async (props: {
	searchParams: Promise<{
		page: string;
		query: string;
		category: string;
	}>;
}) => {
	await authGuard();
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const searchText = searchParams.query || "";
	const category = searchParams.category || "";
	const products = await getAllProducts({
		query: searchText,
		page,
		category,
	});
	return (
		<div className="space-y-2">
			<div className="flex-between">
				<h2 className="h2-bold">Products</h2>
				<Button variant={"default"} asChild>
					<Link href="/admin/products/create">Add Product</Link>
				</Button>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Brand</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Stock</TableHead>
						<TableHead>Rating</TableHead>
						<TableHead>Featured</TableHead>
						<TableHead className="w-[100px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.data.map((product: any) => (
						<TableRow key={product.id}>
							<TableCell>{product.name}</TableCell>
							<TableCell>{product.brand}</TableCell>
							<TableCell>{product.category}</TableCell>
							<TableCell>{formatCurrency(product.price.toString())}</TableCell>
							<TableCell>{product.stock}</TableCell>
							<TableCell>{product.rating}</TableCell>
							<TableCell>{product.isFeatured ? "Yes" : "No"}</TableCell>
							<TableCell className="flex gap-2">
								<Link href={`/admin/products/${product.id}`}>
									<Button variant={"outline"}>Edit</Button>
								</Link>
								<DeleteDialogue id={product.id} action={deleteProduct} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{/* <Pagination /> */}
			{products?.totalPages && products?.totalPages > 1 && (
				<Pagination totalPages={products.totalPages} page={page} />
			)}
		</div>
	);
};

export default ProductsPage;
