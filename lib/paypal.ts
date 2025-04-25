const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

export const paypal = {
	// Get access token
	getAccessToken: async function (): Promise<string> {
		const auth = Buffer.from(
			`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
		).toString("base64");

		const res = await fetch(`${base}/v1/oauth2/token`, {
			method: "POST",
			headers: {
				Authorization: `Basic ${auth}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: "grant_type=client_credentials",
		});

		if (!res.ok) throw new Error("Failed to get access token for PayPal");

		const { access_token } = await res.json();
		return access_token;
	},
	// Create order
	createOrder: async function (price: number): Promise<string> {
		const accessToken = await paypal.getAccessToken();
		const res = await fetch(`${base}/v2/checkout/orders`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				intent: "CAPTURE",
				purchase_units: [
					{
						amount: {
							value: price.toFixed(2),
							currency_code: "USD",
						},
					},
				],
			}),
		});

		if (!res.ok) throw new Error("Failed to create PayPal order");

		const { id } = await res.json();
		return id;
	},
	// After your client approves payment and sends you the orderId, use this function on the server:
	captureOrder: async function (orderId: string): Promise<any> {
		const accessToken = await paypal.getAccessToken();
		const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) throw new Error("Failed to capture PayPal payment");

		return res.json();
	},
	// Get order details
	getOrderDetails: async function (orderId: string): Promise<any> {
		const accessToken = await paypal.getAccessToken();
		const res = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) throw new Error("Failed to fetch order details");

		return res.json();
	},
	// Refund payment:
	refundPayment: async function (
		captureId: string,
		amount?: number
	): Promise<any> {
		const accessToken = await paypal.getAccessToken();
		const res = await fetch(
			`${base}/v2/payments/captures/${captureId}/refund`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: amount
					? JSON.stringify({
							amount: { value: amount.toFixed(2), currency_code: "USD" },
					  })
					: "{}",
			}
		);

		if (!res.ok) throw new Error("Failed to refund payment");

		return res.json();
	},
};
