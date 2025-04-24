"use client";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order-actions";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const PlaceOrderForm = () => {
	const router = useRouter();
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const res = await createOrder();
		if (res.success) {
			console.log("response from action", res);
			console.log(res.message);
			router.push(res.redirectTo as string);
		}
	};
	const PlaceOrderButton = () => {
		const { pending } = useFormStatus();
		return (
			<Button className="w-full" disabled={pending} variant={"default"}>
				{pending ? (
					<>
						<Loader className="mr-2 h-4 w-4 animate-spin" /> Placing Order
					</>
				) : (
					<>
						<Check className="h-4 w-4" />
						{""} Place Order
					</>
				)}
			</Button>
		);
	};
	return (
		<form onSubmit={handleSubmit} className="w-full">
			<PlaceOrderButton />
		</form>
	);
};

export default PlaceOrderForm;
