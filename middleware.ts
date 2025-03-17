import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { RoleType } from "@prisma/client";

export default withAuth(
	function middleware(req: NextRequestWithAuth) {
		const token = req?.nextauth?.token;

		if (
			req.nextUrl.pathname.startsWith("/dashboard") &&
			token?.user?.role !== RoleType.ADMIN
		) {
			return NextResponse.redirect(new URL("/profile", req.url));
		}

		// If all checks pass, proceed with the request
		const response = NextResponse.next();

		// Add CORS headers if needed
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, OPTIONS"
		);
		response.headers.set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization"
		);
		response.headers.set("Cross-Origin-Embedder-Policy", "credentialless");
		response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

		return response;
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
);

export const config = {
	matcher: ["/profile/:path*", "/dashboard/:path*"],
};
