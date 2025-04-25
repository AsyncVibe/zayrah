"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { formatCurrency, formatDateTime, formatUUID } from "@/lib/utils";
import { Order } from "@/types/validators";
import Image from "next/image";
import Link from "next/link";
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { createPaypalOrder } from "@/lib/actions/order-actions";
import { approvePaypalOrder } from "@/lib/actions/order-actions";
import { toast } from "@/hooks/use-toast";
const OrderDetailTable = ({
	order,
	paypalClientId,
}: {
	order: Order;
	paypalClientId: string;
}) => {
	// destructure order
	const {
		createdAt,
		isPaid,
		isDelivered,
		paidAt,
		deliveredAt,
		orderitems,
		user,
		id,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		totalPrice,
		taxPrice,
		shippingPrice,
	} = order;
	const PrintLoadingState = () => {
		const [{ isPending, isRejected }] = usePayPalScriptReducer();
		if (isPending) return "loading";
		if (isRejected) return "rejected";
	};
	const handleCreatePayPalOrder = async () => {
		const res = await createPaypalOrder(id);
		if (!res.success)
			toast({
				variant: "destructive",
				description: res.message,
			});
		return res.data;
	};
	const handleApprovePayPalOrder = async (data: { orderID: string }) => {
		const res = await approvePaypalOrder(id, data);
		if (!res.success)
			toast({
				variant: res.success ? "default" : "destructive",
				description: res.message,
			});
		// return res.data;
	};
	return (
		<>
			<h1 className="py-4 text-2xl">Order {formatUUID(order.id)}</h1>
			<div className="grid md:grid-cols-3 gap-5">
				<div className="md:col-span-2 overflow-x-auto space-y-4">
					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Payment Method</h2>
							<p>{paymentMethod}</p>
							{isPaid ? (
								<Badge variant="secondary">
									Paid at {formatDateTime(paidAt!).dateTime}
								</Badge>
							) : (
								<Badge variant="destructive">Not Paid</Badge>
							)}
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Shipping Address</h2>
							<p>{shippingAddress.fullName}</p>
							<p>
								{shippingAddress.streetAddress}, {shippingAddress.city},
								{shippingAddress.postalCode}, {shippingAddress.country}
							</p>

							{deliveredAt ? (
								<Badge variant="secondary">
									Delivered at {formatDateTime(deliveredAt!).dateTime}
								</Badge>
							) : (
								<Badge variant="destructive">Not Delivered</Badge>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Order Items</h2>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Quantity</TableHead>
										<TableHead>Price</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orderitems.map((item) => (
										<TableRow key={item.slug}>
											<TableCell>
												<Link
													href={`/product/${item.slug}`}
													className="flex items-center">
													<Image
														src={item.image}
														alt={item.name}
														height="70"
														width="70"
													/>
													<span className="px-2">{item.name}</span>
												</Link>
											</TableCell>
											<TableCell>
												<span className="px-2">{item.quantity}</span>
											</TableCell>
											<TableCell>
												<span className="text-right">${item.price}</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
				<div>
					<Card>
						<CardContent className="p-4 gap-4 space-y-4">
							<h2 className="flex text-xl pb-4 justify-center">
								Price Details
							</h2>
							<div className="flex justify-between">
								<div> Item</div>
								<div>{formatCurrency(itemsPrice)}</div>
							</div>
							<div className="flex justify-between">
								<div> Tax</div>
								<div>{formatCurrency(taxPrice)}</div>
							</div>
							<div className="flex justify-between">
								<div>Shipping</div>
								<div>{formatCurrency(shippingPrice)}</div>
							</div>
							<div className="flex justify-between">
								<div>Total</div>
								<div>{formatCurrency(totalPrice)}</div>
							</div>
							{/* paypal payment */}
							{!isPaid && paymentMethod === "PayPal" && (
								<div>
									<PayPalScriptProvider
										options={{
											clientId: paypalClientId,
										}}>
										<PrintLoadingState />
										<PayPalButtons
											createOrder={handleCreatePayPalOrder}
											onApprove={handleApprovePayPalOrder}
										/>
									</PayPalScriptProvider>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default OrderDetailTable;
