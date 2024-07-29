export function handlerNativeResponse(data: any, status: number) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

export function generateRandomString(): string {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	const length = 5;

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}

	return result;
}

export function generateRandomNumbers(count: number): string {
	let numbers: string[] = [];
	for (let i = 0; i < count; i++) {
		let randomNumber = Math.floor(Math.random() * (9 - 0) + 0);
		numbers.push(randomNumber.toString());
	}
	return numbers.join("");
}

export function getRandomNumber(min: number, max: number): string {
	return Math.floor(Math.random() * (max - min + 1) + min).toString();
}
