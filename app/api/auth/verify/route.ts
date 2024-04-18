import { db } from "@/config/db.config";
import { handlerNativeResponse } from "@/lib/backend/utils";
import axios from "axios";
import { ParkingMeter } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";

type Data = {
	success: boolean;
	data?: Object;
};

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const params = Object.fromEntries(searchParams);
		const code = params.code;
		const email = params.email;

		const user = await db.user.findUnique({
			where: {
				verificationCode: code		
			},
			select: {
				id: true,
				verificationCode: true
			},
		});

		if (!user) {
			return handlerNativeResponse(
				{
					status: 409,
					errors: {
						message: "User is not found.",
					},
				},
				400
			);
		}
		if (user.verificationCode !== code){
				return handlerNativeResponse(
								{
									status: 409,
									errors: {
										message: "Invalid Code.",
									},
								},
								400
				);
		}

		await db.user.update({
			where: { id: user.id },
			data: {
				verified: true,
				emailVerified: new Date(),
			},
		});
		return NextResponse.json({
			status: "Success",
			email: user.id,
		});
	} catch (error: any) {
		let status = 500;
		return handlerNativeResponse({ status, message: error.message }, status);
	}
}
