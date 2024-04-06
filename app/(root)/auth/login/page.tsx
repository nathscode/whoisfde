import LoginModal from "@/components/modals/LoginModal";
import React from "react";

const LoginPage = async () => {
	return (
		<div className="flex justify-center items-center flex-col w-full py-24">
			<div className="flex flex-col items-center justify-center w-full max-w-lg">
				<LoginModal />
			</div>
		</div>
	);
};

export default LoginPage;
