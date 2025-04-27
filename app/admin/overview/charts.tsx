"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

interface ChartProps {
	data: {
		salesData: { month: string; totalSales: number }[];
	};
}

const DashboardChart: React.FC<ChartProps> = ({ data }) => {
	if (!data?.salesData) {
		return <div>No sales data available</div>;
	}

	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={data.salesData}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis
					dataKey="month"
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `$${value}`}
				/>
				<Tooltip />
				<Legend />
				<Bar
					dataKey="totalSales"
					fill="#8884d8"
					radius={[40, 40, 0, 0]}
					className="fill-primary"
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default DashboardChart;
