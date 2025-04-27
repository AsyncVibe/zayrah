import { auth } from "@/auth";
import DeleteDialogue from "@/components/shared/delete-dialogue";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/lib/actions/order-actions";
import { authGuard } from "@/lib/auth-guard";
import { formatCurrency, formatDateTime, formatUUID } from "@/lib/utils";
import Link from "next/link";
export const metadata = {
	title: "Admin Orders",
};
const AdminOrdersPage = async (props: {
	searchParams: Promise<{ page: string }>;
}) => {
	await authGuard();
	const { page } = await props.searchParams;
	const session = await auth();

	if (session?.user?.role !== "admin") throw new Error("User is Unauthorized");
	const orders = await getAllOrders({
		page: Number(page),
	});
	console.log("admin orders", orders);

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
								<TableCell className="flex gap-2 items-center">
									<Button variant={"outline"} size={"sm"} asChild>
										<Link href={`/order/${order.id}`}>Details</Link>
									</Button>
									{/* delete button */}
									<DeleteDialogue id={order.id} action={deleteOrder} />
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

export default AdminOrdersPage;
