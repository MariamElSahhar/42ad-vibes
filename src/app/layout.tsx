import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "42 Abu Dhabi Vibes",
	description: "Event management platform by Mariam ElSahhar",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Navbar />
				<main className="vh-full">{children}</main>
				<footer className="bg-gray-100 text-center py-4 mt-8 text-sm text-gray-500">
					Created by Mariam ✨
				</footer>
			</body>
		</html>
	);
}
