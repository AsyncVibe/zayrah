import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./PaymentMethodForm";
import CheckoutSteps from "@/components/shared/product/checkout-steps";

export const metadata = {
	title: "Payment method",
};
const PaymentMethodPage = async () => {
	const session = await auth();
	const userId = session?.user?.id;
	if (!userId) throw new Error("User not Found");
	const user = await getUserById(userId);
	console.log(user);
	return (
		<>
			<CheckoutSteps current={2} />
			<PaymentMethodForm preferredPaymentMethod={user?.paymentMethod} />
		</>
	);
};

export default PaymentMethodPage;
