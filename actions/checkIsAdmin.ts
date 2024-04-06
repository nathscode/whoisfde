import { RoleType } from "@prisma/client";
import getCurrentUser from "./getCurrentUser";

export default async function checkIsAdmin() {
	const session = await getCurrentUser();
	if (!session) {
		return null;
	}

	if (session?.role !== RoleType.ADMIN) {
		return false;
	}

	return true;
}
