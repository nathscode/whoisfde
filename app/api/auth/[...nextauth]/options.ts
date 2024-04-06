import { db } from "@/config/db.config";
import { stringifyObj } from "@/lib/utils";
import { CustomSession, CustomUser } from "@/types";
import { AuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
	session: {
		maxAge: 6 * 60 * 60,
		updateAge: 1 * 60 * 60,
	},
	pages: {
		signIn: "/auth/login",
	},

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.user = user;
			}
			return token;
		},

		async session({
			session,
			token,
			user,
		}: {
			session: CustomSession;
			token: JWT;
			user: User;
		}) {
			session.user = token.user as CustomUser;
			return session;
		},
	},

	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {},
				password: {},
			},
			async authorize(credentials, req) {
				const user = await db.user.findUnique({
					where: {
						email: credentials?.email.toLowerCase(),
					},
				});

				if (user) {
					if (!user?.verified) {
						throw new Error("E-mail is not verified");
					}
					const userObj = stringifyObj(user);
					return {
						id: userObj.id,
						name: userObj.name,
						phone: userObj.phone,
						role: userObj.role,
						email: userObj.email,
					};
				} else {
					return null;
				}
			},
		}),
	],
};
