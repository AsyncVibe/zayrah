import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	// Check authentication for protected routes
	const protectedPaths = [
		"/shipping-address",
		"/payment-method",
		"/place-order",
		"/admin",
		"/profile",
		"/order",
		"/user",
	];

	const isProtectedPath = protectedPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path)
	);

	// Get the token
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	// Handle protected routes
	if (isProtectedPath && !token) {
		const signInUrl = new URL("/sign-in", request.url);
		signInUrl.searchParams.set("callbackUrl", request.url);
		return NextResponse.redirect(signInUrl);
	}

	// Redirect authenticated users away from auth pages
	if (
		token &&
		(request.nextUrl.pathname === "/sign-in" ||
			request.nextUrl.pathname === "/sign-up")
	) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Handle session cart creation if cookie doesn't exist
	if (!request.cookies.get("sessionCartId")) {
		const sessionCartId = crypto.randomUUID();
		const response = NextResponse.next();
		response.cookies.set("sessionCartId", sessionCartId);
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
		"/shipping-address",
		"/payment-method",
		"/place-order",
		"/admin",
		"/profile",
		"/order/:path*",
		"/user/:path*",
	],
};
