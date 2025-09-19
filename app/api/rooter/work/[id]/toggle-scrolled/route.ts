import { db } from "@/config/db.config";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const formattedId = await params;
		const body = await request.json();
		const { isScrolled } = body;

		// Validate the input
		if (typeof isScrolled !== "boolean") {
			return NextResponse.json(
				{ error: "isScrolled must be a boolean value" },
				{ status: 400 }
			);
		}

		// Check if the work exists
		const existingWork = await db.work.findUnique({
			where: { id: formattedId.id },
		});

		if (!existingWork) {
			return NextResponse.json({ error: "Work not found" }, { status: 404 });
		}

		// Update the work
		const updatedWork = await db.work.update({
			where: { id: formattedId.id },
			data: { isScrolled },
			include: {
				workFiles: true,
			},
		});

		return NextResponse.json(updatedWork, { status: 200 });
	} catch (error) {
		console.error("Error toggling work scrolled status:", error);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
