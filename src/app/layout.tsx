import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/context/AuthContext";

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
				<AuthProvider>
					<Navbar />
					<main className="vh-full">{children}</main>
					<footer className="text-center py-4 mt-8 text-sm">
						Created by Mariam ✨
					</footer>
				</AuthProvider>
			</body>
		</html>
	);
}
