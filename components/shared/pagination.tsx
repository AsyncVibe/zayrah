"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
type paginationProps = {
	page: number | string;
	totalPages: number;
	urlParamName?: string;
};
const Pagination = ({ page, totalPages, urlParamName }: paginationProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleClick = (action: "next" | "previous") => {
		const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;
		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key: urlParamName || "page",
			value: pageValue.toString(),
		});
		router.push(newUrl);
	};
	// if (totalPages <= 1) return null;
	return (
		<div className="flex gap-2">
			<Button
				size="lg"
				variant="outline"
				className="w-28"
				disabled={Number(page) < 1}
				onClick={() => handleClick("previous")}>
				Previous
			</Button>
			<Button
				size="lg"
				variant="outline"
				className="w-28"
				disabled={Number(page) > totalPages}
				onClick={() => handleClick("next")}>
				Next
			</Button>
		</div>
	);
};

export default Pagination;
