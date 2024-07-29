import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { Button } from "@/components/ui/button";
import { db } from "@/config/db.config";
import { DateTime } from "luxon";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Reset Password",
};
interface IParams {
	params: {
		token: string;
	};
}

const ResetPassword = async ({ params }: IParams) => {
	const t = decodeURIComponent(params.token);

	const passwordResetObj = await db.passwordReset.findFirst({
		where: {
			code: t,
		},
	});

	if (!passwordResetObj) {
		notFound();
	}
	const expiredAtFormatted = passwordResetObj?.expiredAt!.toISOString();

	const expire_date = DateTime.fromISO(expiredAtFormatted);
	const now_date = DateTime.now();

	if (now_date > expire_date) {
		return (
			<div className="flex justify-center items-center  space-y-5 flex-col w-full py-24">
				<div className="flex flex-col items-center justify-center w-full max-w-lg">
					<div className="flex justify-start flex-col w-full">
						<div className="flex justify-start gap-y-4 flex-col md:flex-row w-full">
							<div className="flex flex-col flex-1 shadow-sm rounded-lg px-5 py-8 border bg-white w-full">
								<h1 className="text-2xl font-bold">Reset password</h1>
								<p className="mt-5 text-lg text-center text-red-600">
									This link has expired.
								</p>
								<p className="prose-sm my-5">
									Go back to login and forget password again
								</p>
								<Button asChild>
									<Link href={"/login"}>Login</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-center items-center  space-y-5 flex-col w-full py-24">
			<div className="flex flex-col items-center justify-center w-full max-w-lg">
				<ResetPasswordForm token={t} />
			</div>
		</div>
	);
};

export default ResetPassword;
