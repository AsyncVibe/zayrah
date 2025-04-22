"use client";
import { ShippingAddress } from "@/types/validators";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { shippingAddressSchema } from "@/types/validators";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { shippingAddressDefaultValues } from "@/lib/constants";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader } from "lucide-react";
const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof shippingAddressSchema>>({
		resolver: zodResolver(shippingAddressSchema),
		defaultValues: address || shippingAddressDefaultValues,
	});
	const onSubmit = (values) => {
		console.log(values);
		return;
	};
	return (
		<div className="max-w-md mx-auto space-y-4">
			<h1 className="h2-bold mt-4">Shipping Address</h1>
			<p className="text-muted-foreground text-sm">
				Please enter your shipping address
			</p>
			<Form {...form}>
				<form
					method="post"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8">
					<div className="flex flex-col gap-5 md:flex-row">
						<FormField
							control={form.control}
							name="fullName"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof shippingAddressSchema>,
									"fullName"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input placeholder="enter full name" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex flex-col gap-5 md:flex-row">
						<FormField
							control={form.control}
							name="streetAddress"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof shippingAddressSchema>,
									"streetAddress"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Street Address</FormLabel>
									<FormControl>
										<Input placeholder="enter street address" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex flex-col gap-5 md:flex-row">
						<FormField
							control={form.control}
							name="city"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof shippingAddressSchema>,
									"city"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>City</FormLabel>
									<FormControl>
										<Input placeholder="enter your city" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex flex-col gap-5 md:flex-row">
						<FormField
							control={form.control}
							name="country"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof shippingAddressSchema>,
									"country"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Country</FormLabel>
									<FormControl>
										<Input placeholder="enter your Country" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex flex-col gap-5 md:flex-row">
						<FormField
							control={form.control}
							name="postalCode"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									z.infer<typeof shippingAddressSchema>,
									"postalCode"
								>;
							}) => (
								<FormItem className="w-full">
									<FormLabel>Postal Code</FormLabel>
									<FormControl>
										<Input placeholder="enter your postal code" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex gap-2">
						<Button disabled={isPending} type="submit">
							{isPending ? (
								<Loader className="h-4 w-4 animate-spin" />
							) : (
								<ArrowRight className="h-4 w-4" />
							)}{" "}
							Continue
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ShippingAddressForm;
