"use client";

import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

const DeleteDialogue = ({
	id,
	action,
}: {
	id: string;
	action: (id: string) => Promise<{ success: boolean; message: string }>;
}) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();
	// handle delete
	const handleDeleteClick = () => {
		startTransition(async () => {
			const { success, message } = await action(id);
			if (success) {
				toast({
					title: "Success",
					description: message,
				});
			} else {
				toast({
					title: "Error",
					description: message,
					variant: "destructive",
				});
			}
			setOpen(false);
		});
	};
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant={"destructive"} size={"sm"}>
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogTitle>Are you sure?</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone.
				</AlertDialogDescription>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction disabled={isPending} onClick={handleDeleteClick}>
					{isPending ? "Deleting..." : "Delete"}
				</AlertDialogAction>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteDialogue;
