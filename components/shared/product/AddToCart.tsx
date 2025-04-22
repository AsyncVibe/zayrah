"use client";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart, removeItemInCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types/validators";
import { useTransition } from "react";
import { Plus, Minus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addItemToCart(item);
			// handle failure
			if (!res.success) {
				console.log(res.message);
				toast({
					title: "Error",
					description: res.message,
					variant: "destructive",
				});
				return;
			}
			// handle success
			toast({
				description: `${res.message}`,
				action: (
					<ToastAction
						altText="Goto cart"
						onClick={() => router.push("/cart")}
						className="bg-primary text-white hover:bg-gray-800">
						Go to cart
					</ToastAction>
				),
			});
		});
	};
	const handleRemoveFromCart = async () => {
		startTransition(async () => {
			const res = await removeItemInCart(item);
			// handle failure
			if (!res.success) {
				console.log(res.message);
				toast({
					title: "Error",
					description: res.message,
					variant: "destructive",
				});
				return;
			}
			// handle success
			toast({
				description: `${res.message}`,
			});
		});
	};
	// check if item is in cart
	const existItem =
		cart &&
		cart.items.find((cartItem) => cartItem.productId === item.productId);
	return existItem ? (
		<div className="flex items-center justify-center gap-2">
			<Button
				onClick={() => handleRemoveFromCart()}
				type="button"
				variant={"outline"}>
				{isPending ? (
					<Loader className="h-4 w-4 animate-spin" />
				) : (
					<Minus className="h-4 w-4" />
				)}
			</Button>
			<span className="px-2">{existItem.quantity}</span>
			<Button
				onClick={() => handleAddToCart()}
				type="button"
				variant={"outline"}>
				{isPending ? (
					<Loader className="h-4 w-4 animate-spin" />
				) : (
					<Plus className="h-4 w-4" />
				)}
			</Button>
		</div>
	) : (
		<div className="flex items-center justify-center p-2">
			<Button
				onClick={() => handleAddToCart()}
				className="bg-primary text-white hover:bg-gray-800">
				{isPending ? (
					<Loader className="h-4 w-4 animate-spin" />
				) : (
					<Plus className="h-4 w-4" />
				)}{" "}
				Add to cart
			</Button>
		</div>
	);
};

export default AddToCart;

{
	/*  */
}
