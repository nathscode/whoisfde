import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { RoleType } from "@prisma/client";

export default withAuth(
	function middleware(req: NextRequestWithAuth) {
		const response = NextResponse.next();
		const token = req?.nextauth.token;
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

		if (
			token?.user.role !== RoleType.ADMIN &&
			req.url.startsWith("/dashboard")
		) {
			return NextResponse.redirect(new URL("/profile", req.url));
		}
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
