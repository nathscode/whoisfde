import getCurrentUser from "@/actions/getCurrentUser";
import TransitionProvider from "@/components/TranstionProvider";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getCurrentUser();

	return <TransitionProvider session={session!}>{children}</TransitionProvider>;
}
