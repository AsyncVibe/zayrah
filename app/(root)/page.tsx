import ProductList from "@/components/shared/product/ProductList";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
const Home = async () => {
	const latestProduct = await getLatestProducts();
	return (
		<ProductList
			data={latestProduct}
			title="Newest Arrival"
			limit={LATEST_PRODUCTS_LIMIT}
		/>
	);
};

export default Home;
