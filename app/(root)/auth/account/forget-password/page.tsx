import ResetPasswordEmailForm from "@/components/forms/ResetPasswordEmailForm";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Reset Password",
};
const ResetPassword = async () => {
	return (
		<div className="flex justify-center items-center  space-y-5 flex-col w-full py-24">
			<div className="flex flex-col bg-zinc-200 p-4 max-w-2xl">
				<p className="prose-sm">
					Please enter the email address for your account.{" "}
					<strong>A verification email will be sent to you.</strong> Once you
					have received the email and clicked on the link, you will be able to
					choose a new password for your account.
				</p>
			</div>
			<div className="flex flex-col items-center justify-center w-full max-w-lg">
				<ResetPasswordEmailForm />
			</div>
		</div>
	);
};

export default ResetPassword;
