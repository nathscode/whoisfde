import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/config/db.config";
import { CustomSession, CustomUser } from "@/types";
import { getServerSession } from "next-auth";

export async function getSession() {
	return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
	try {
		const session: CustomSession | null = await getSession();

		if (!session?.user?.email) {
			return null;
		}

		const currentUser: CustomUser | null = await db.user.findUnique({
			where: {
				email: session.user.email as string,
			},
		});

		if (!currentUser) {
			return null;
		}

		return currentUser;
	} catch (error: any) {
		return null;
	}
}
