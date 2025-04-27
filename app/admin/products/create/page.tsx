import { authGuard } from "@/lib/auth-guard";

const CreateProduct = async () => {
	await authGuard();
	return <div>Create Product</div>;
};

export default CreateProduct;
