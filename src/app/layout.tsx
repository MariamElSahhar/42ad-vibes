import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
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
			<body className="font-display min-h-screen flex flex-col bg-gradient-to-br from-purple-950 via-gray-900 to-orange-950 text-white">
				<AuthProvider>
					<Navbar />
					<main className="flex-1 flex flex-col min-h-full h-full px-4 sm:px-8">
						{children}
					</main>
					<footer className="text-center py-4 mt-8 text-sm backdrop-blur-sm bg-purple/100 border-t border-white/10 shadow-inner">
						Created by Mariam ✨
					</footer>
				</AuthProvider>
			</body>
		</html>
	);
}
