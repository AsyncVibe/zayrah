import { authGuard } from "@/lib/auth-guard";
import ProductForm from "./productForm";
export const metadata = {
	title: "Create Product",
};
const CreateProductPage = async () => {
	await authGuard();
	return (
		<>
			<h2 className="h2-bold">Create Product</h2>
			<div className="my-8">
				<ProductForm type="create" />
			</div>
		</>
	);
};

export default CreateProductPage;
