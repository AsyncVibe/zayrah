import { authGuard } from "@/lib/auth-guard";

const ProductDetails = async () => {
	await authGuard();
	return <div>Product details by Id</div>;
};

export default ProductDetails;
