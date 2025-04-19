import Link from "next/link";
import ModeToggle from "./mode-toggle";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./userButton";

const SheetMenu = async () => {
	return (
		<div className="fex justify-end gap-3">
			<nav className="hidden md:flex width-full max-w-xs gap-1">
				<ModeToggle />
				<Button asChild variant="ghost">
					<Link href="/cart">
						<ShoppingCart />
						Cart
					</Link>
				</Button>

				<UserButton />
			</nav>
			{/* Mobile Menu */}
			<nav className="md:hidden">
				<Sheet>
					<SheetTrigger>
						<EllipsisVertical />
					</SheetTrigger>

					<SheetContent className="flex flex-col items-start">
						<SheetTitle>Menu</SheetTitle>
						<ModeToggle />
						<Button asChild variant="ghost">
							<Link href="/cart">
								<ShoppingCart />
								Cart
							</Link>
						</Button>

						<UserButton />

						<SheetDescription></SheetDescription>
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	);
};

export default SheetMenu;
