"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { Moon, MoonIcon, Sun, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ModeToggle = () => {
	// to suppress hydration warning:
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost">
					{theme === "dark" ? (
						<MoonIcon />
					) : theme === "system" ? (
						<SunMoonIcon />
					) : theme === "light" ? (
						<SunIcon />
					) : null}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Appearance</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem
					checked={theme === "system"}
					onCheckedChange={() => setTheme("system")}>
					<SunMoonIcon className="mr-2 h-4 w-4" />
					<span>System</span>
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === "dark"}
					onClick={() => setTheme("dark")}>
					<Moon className="mr-2 h-4 w-4" />
					<span>Dark</span>
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === "light"}
					onClick={() => setTheme("light")}>
					<Sun className="mr-2 h-4 w-4" />
					<span>Light</span>
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ModeToggle;
