import TransitionProvider from "@/components/TranstionProvider";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
	weight: ["400", "500", "700"],
	style: ["normal", "italic"],
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Clients & OGs",
	description: "Graphing per exelon",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={montserrat.className}>
				<TransitionProvider>{children}</TransitionProvider>
			</body>
		</html>
	);
}
