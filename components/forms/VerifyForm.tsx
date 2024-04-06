"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React from "react";
import LoginModal from "../modals/LoginModal";
import RequestModal from "../modals/RequestModal";

const VerifyForm = () => {
	const searchParam = useSearchParams();
	const code = searchParam.get("code");
	const email = searchParam.get("email");

	if (!code) {
		return <div>No code provided</div>;
	}
	const verifyUserInfo = () => {
		return axios
			.get(`/api/auth/verify?code=${code}&email=${email}`)
			.then((response) => {
				return { data: response.data };
			})
			.catch((error) => {
				console.error(error);
				throw error;
			});
	};

	const { isPending, data, error } = useQuery({
		queryKey: ["verifyUserInfo"],
		queryFn: verifyUserInfo,
	});
	if (isPending) {
		return <h4>Loading</h4>;
	}

	if (error) {
		return (
			<div className="flex flex-col w-full max-w-sm justify-center items-center bg-white shadow-md p-4">
				<h2 className="text-red-400 font-bold text-xl text-center">Failed</h2>
				<h4 className="text-center font-semibold">Invalid code</h4>
				<div className="my-4">
					<RequestModal />
				</div>
			</div>
		);
	}

	if (!data?.data || data.data.length === 0) {
		return <div>Invalid code </div>;
	}

	return (
		<div className="flex flex-col w-full max-w-sm justify-center items-center bg-white shadow-md p-4">
			<h2 className="text-green-400 font-bold text-xl text-center">Success</h2>
			<h4 className="text-center font-semibold"> Your account is verified</h4>
			<div className="my-4">
				<LoginModal />
			</div>
		</div>
	);
};

export default VerifyForm;
