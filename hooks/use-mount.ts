"use client";

import { useEffect, useState } from "react";

const useMount = () => {
	const [mounted, setMounted] = useState(false);
	const mount =
		typeof window !== "undefined" && window.location.origin
			? window.location.origin
			: "";

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return "";
	}

	return mount;
};
export default useMount;
