import NextAuth, { DefaultSession } from "next-auth";
import { CustomUser } from ".";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: CustomUser & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		user: CustomUser;
	}
}
