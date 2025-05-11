"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
	const supabase = createClient();
	const router = useRouter();
	const { user } = useAuth();

	const [menuOpen, setMenuOpen] = useState(false);
	

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setMenuOpen(false);
		router.push("/");
	};

	return (
		<nav className="bg-blue-300 py-4">
			<div className="container mx-auto flex justify-between items-center px-4">
				<Link href="/" className="text-2xl font-semibold">
					42AD Vibes
				</Link>

				<div className="relative text-sm space-x-4">
					{user ? (
						<div className="relative inline-block text-left">
							<button
								onClick={() => setMenuOpen((prev) => !prev)}
								className="px-3 py-2 bg-white rounded-md shadow hover:bg-gray-100"
							>
								Hi, {user.email}
							</button>

							{menuOpen && (
								<div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
									<button
										onClick={handleSignOut}
										className="block w-full text-left px-4 py-2 hover:bg-gray-100"
									>
										Sign Out
									</button>
								</div>
							)}
						</div>
					) : (
						<>
							<Link href="/login" className="hover:underline">
								Login
							</Link>
							<Link href="/signup" className="hover:underline">
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
