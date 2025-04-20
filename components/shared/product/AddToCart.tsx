"use client";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types/validators";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
const AddToCart = ({ item }: { item: CartItem }) => {
	const router = useRouter();
	const { toast } = useToast();
	const handleAddToCart = async () => {
		const res = await addItemToCart(item);
		// handle failure
		if (!res.success) {
			toast({
				title: "Error",
				description: res.message,
				variant: "destructive",
			});
			return;
		}
		// handle success
		toast({
			description: `${item.name} added to cart`,
			action: (
				<ToastAction
					altText="Goto cart"
					onClick={() => router.push("/cart")}
					className="bg-primary text-white hover:bg-gray-800">
					Go to cart
				</ToastAction>
			),
		});
	};
	return (
		<Button className="w-full" type="button" onClick={handleAddToCart}>
			<Plus className="mr-2 h-4 w-4" /> Add to Cart
		</Button>
	);
};

export default AddToCart;
