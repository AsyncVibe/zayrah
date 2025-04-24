"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label"; // Import Label component
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { ArrowRight, Loader } from "lucide-react";

const paymentMethodSchema = z.object({
	type: z.enum(["PayPal", "Stripe", "CashOnDelivery"]),
});

const PaymentMethodForm = ({
	preferredPaymentMethod,
}: {
	preferredPaymentMethod: string;
}) => {
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<z.infer<typeof paymentMethodSchema>>({
		resolver: zodResolver(paymentMethodSchema),
		defaultValues: {
			type: preferredPaymentMethod || "PayPal",
		},
	});

	const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
		startTransition(async () => {
			console.log("cashondelivery", values);
			const res = await updateUserPaymentMethod(values);
			if (!res.success) {
				console.log(res.message);
				toast({
					title: "destructive",
					description: res.message,
				});
				return;
			}
			router.push("/place-order");
			toast({
				title: "Success",
				description: `${res.message}`,
			});
		});
	};

	return (
		<div className="max-w-md mx-auto space-y-4">
			<h1 className="h2-bold mt-4">Payment Method</h1>
			<p className="text-muted-foreground text-sm">
				Please select your payment method
			</p>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Select Payment Method</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={(value) => {
											console.log("Selected value:", value); // Debug value change
											field.onChange(value);
										}}
										value={field.value}
										className="flex flex-col space-y-3">
										{["PayPal", "Stripe", "CashOnDelivery"].map((method) => (
											<div key={method} className="flex items-center space-x-2">
												<RadioGroupItem value={method} id={method} />
												<Label htmlFor={method} className="cursor-pointer">
													{method}
												</Label>
											</div>
										))}
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">
						{isPending ? (
							<Loader className="h-4 w-4 animate-spin" />
						) : (
							<ArrowRight className="h-4 w-4" />
						)}{" "}
						Continue
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default PaymentMethodForm;
