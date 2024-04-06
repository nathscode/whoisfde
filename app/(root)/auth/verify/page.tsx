import VerifyForm from "@/components/forms/VerifyForm";
import React, { Suspense } from "react";

const AuthVerification = async () => {
	return (
		<div className="flex justify-center items-center flex-col w-full py-24">
			<div className="flex flex-col items-center justify-center w-full max-w-lg">
				<Suspense>
					<VerifyForm />
				</Suspense>
			</div>
		</div>
	);
};

export default AuthVerification;
