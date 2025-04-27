import { authGuard } from "@/lib/auth-guard";

const ProductsPage = async () => {
	await authGuard();
	return <div>Products Page</div>;
};

export default ProductsPage;
