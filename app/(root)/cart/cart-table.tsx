"use client";
import { useToast } from "@/hooks/use-toast";
import { Cart } from "@/types/validators";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { addItemToCart, removeItemInCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Check, Loader, Minus, Plus } from "lucide-react";

const CartTable = ({ cart }: { cart?: Cart }) => {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransistion] = useTransition();
	return (
		<>
			<h1 className="py-4 h2-bold">Shopping Cart</h1>
			{!cart || cart.items.length === 0 ? (
				<div>
					Cart is Empty{" "}
					<Link href="/" className="text-blue-600 hover:underline">
						Go Shopping
					</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Item</TableHead>
									<TableHead className="text-center">Quanity</TableHead>
									<TableHead className="text-right">Price</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cart.items.map((item) => (
									<TableRow key={item.productId}>
										<TableCell className="flex items-center gap-4">
											<Link href={`/product/${item.slug}`}>
												<Image
													src={item.image}
													alt={item.name}
													width={60}
													height={60}
													priority={true}
													className="transition-transform duration-300 hover:scale-105 rounded-md"
												/>
											</Link>
											<span className="px-2">{item.name}</span>
										</TableCell>
										<TableCell className="text-center">
											<Button
												disabled={isPending}
												variant="outline"
												type="button"
												onClick={() =>
													startTransistion(async () => {
														const res = await removeItemInCart(item);
														if (!res.success) {
															Toast({
																title: "Error",
																description: res.message,
																variant: "destructive",
															});
														}
													})
												}>
												{isPending ? (
													<Loader className="animate-spin w-4 h-4" />
												) : (
													<Minus className="w-4 h-4" />
												)}
											</Button>
											<span className="px-2">{item.quantity}</span>
											<Button
												variant="outline"
												type="button"
												onClick={() =>
													startTransistion(async () => {
														const res = await addItemToCart(item);
														if (!res.success) {
															Toast({
																title: "Success",
																description: res.message,
																variant: "success",
															});
														}
													})
												}>
												{isPending ? (
													<Loader className="animate-spin w-4 h-4" />
												) : (
													<Plus className="w-4 h-4" />
												)}
											</Button>
										</TableCell>
										<TableCell className="text-right">${item.price}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Card>
						<CardContent className="p-4 gap-4">
							<div className="pb-3 text-xl font-semibold">
								Subtotal: (
								{cart.items.reduce((acc, item) => acc + item.quantity, 0)})
								<span className="font-bold ml-10">
									{formatCurrency(cart.itemsPrice)}
								</span>
							</div>
							<Button
								className="w-full mt-7"
								variant="outline"
								type="button"
								onClick={() =>
									startTransistion(async () => {
										router.push("/shipping-address");
									})
								}>
								{isPending ? (
									<Loader className="animate-spin w-4 h-4" />
								) : (
									<ArrowRight className="w-4 h-4" />
								)}
								Proceed to checkout
							</Button>
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
};

export default CartTable;
