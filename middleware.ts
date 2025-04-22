// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	// Check for session cart cookie; if it does not exist, we create it and then starts adding to it whatever is in the cart. Next time, when the use would visit our website, he would see the items that were added to the cart.
	if (!request.cookies.get("sessionCartId")) {
		// Generate new session cart ID cookie
		const sessionCartId = crypto.randomUUID();
		// Clone the request headers
		const newRequestHeaders = new Headers(request.headers);
		// Create new response and add headers
		const response = NextResponse.next({
			request: {
				headers: newRequestHeaders,
			},
		});
		// Set new cookie
		response.cookies.set("sessionCartId", sessionCartId);
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sign-in).*)"], // Apply to all routes except API, static, sign-in
};
