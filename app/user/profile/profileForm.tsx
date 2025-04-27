"use client";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { updateUserProfileSchema } from "@/types/validators";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/lib/actions/user.actions";

const ProfileForm = () => {
	const { data: session, update } = useSession();
	const { toast } = useToast();
	const form = useForm<z.infer<typeof updateUserProfileSchema>>({
		resolver: zodResolver(updateUserProfileSchema),
		defaultValues: {
			// ?? is the null coalescing operator: if the left side is null, return the right side
			name: session?.user?.name ?? "",
			email: session?.user?.email ?? "",
		},
	});
	const onSubmit = async (values: z.infer<typeof updateUserProfileSchema>) => {
		const res = await updateUserProfile(values);
		if (!res.success) {
			console.log(res.message);
			toast({
				variant: "destructive",
				description: res.message,
			});
			return;
		}
		// updating session based on new user data
		const newSession = {
			...session,
			user: {
				...session?.user,
				name: values.name,
			},
		};
		await update(newSession);
		toast({
			description: `${res.message}`,
		});
	};
	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-5"
				onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-5">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input
										placeholder="Email"
										className="input-field"
										{...field}
										disabled
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input
										placeholder="name"
										className="input-field"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button
					type="submit"
					className="button col-span-2 w-full"
					disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? "Submitting" : "Update Profile"}
				</Button>
			</form>
		</Form>
	);
};

export default ProfileForm;
