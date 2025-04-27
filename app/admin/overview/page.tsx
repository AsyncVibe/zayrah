import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getSalesData } from "@/lib/actions/order-actions";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCardIcon, Users } from "lucide-react";
import Link from "next/link";
import DashboardChart from "./charts";
import { authGuard } from "@/lib/auth-guard";

export const metadata = {
	title: "Dashboard",
};
const OverviewPage = async () => {
	await authGuard();
	const session = await auth();

	if (!session?.user?.role) throw new Error("User is not authorized");
	const summary = await getSalesData();
	return (
		<div className="space-y-2">
			<h1 className="h2-bold">Dashboard</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-bold">Total Revenue</CardTitle>
						<BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(summary.totalSales) || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-bold">Sales</CardTitle>
						<CreditCardIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(summary.ordersCount) || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-bold">Customers</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(summary.usersCount) || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-bold">Products</CardTitle>
						<Barcode className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(summary.productsCount) || 0}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-bold">Overview</CardTitle>
						<CreditCardIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="pl-2">
						<DashboardChart
							data={{
								salesData: summary.salesData,
							}}
						/>
					</CardContent>
				</Card>
				<Card className="col-span-3">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-bold">Overview</CardTitle>
						<CreditCardIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="pl-2">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>BUYER</TableHead>
									<TableHead>DATE</TableHead>
									<TableHead>TOTAL</TableHead>
									<TableHead>ACTIONS</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{summary.latestSales.map((sale) => (
									<TableRow key={sale.id}>
										<TableCell>
											{sale.user.name ? sale.user.name : "Deleted User"}
										</TableCell>
										<TableCell>
											{formatDateTime(sale.createdAt).dateOnly}
										</TableCell>
										<TableCell>
											{formatCurrency(sale.totalPrice.toString())}
										</TableCell>
										<TableCell>
											<Link href={`/order/${sale.id}`}>
												<Button size="sm">Details</Button>
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default OverviewPage;
