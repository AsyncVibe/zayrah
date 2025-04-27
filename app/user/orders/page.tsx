import Pagination from "@/components/shared/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order-actions";
import { formatCurrency, formatDateTime, formatUUID } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
	title: "My Orders",
};

const OrdersPage = async ({ searchParams }: { searchParams: any }) => {
	const page = parseInt(searchParams.page);

	const orders = await getMyOrders({ page });
	console.log("orders", orders);
	return (
		<div className="space-y-2">
			<h2 className="h2-bold mb-4">Orders</h2>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Paid</TableHead>
							<TableHead>Delivered</TableHead>
							<TableHead>Actoins</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.data.map((order: any) => (
							<TableRow key={order.id}>
								<TableCell>{formatUUID(order.id)}</TableCell>
								<TableCell>
									{formatDateTime(order.createdAt).dateTime}
								</TableCell>
								<TableCell>{formatCurrency(order.totalPrice)}</TableCell>
								<TableCell>
									{order.isPaid && order.paidAt
										? formatDateTime(order.paidAt).dateTime
										: "Not Paid"}
								</TableCell>
								<TableCell>
									{order.isDelivered && order.deliveredAt
										? formatDateTime(order.deliveredAt).dateTime
										: "Not Delivered"}
								</TableCell>
								<TableCell>
									<Link href={`/order/${order.id}`}>Details</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{orders.totalPages >= 1 && (
					<Pagination
						page={Number(page) || 1}
						totalPages={orders?.totalPages}
					/>
				)}
			</div>
		</div>
	);
};

export default OrdersPage;
