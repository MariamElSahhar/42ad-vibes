"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
	const supabase = createClient();

	const router = useRouter();
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const getUserData = async () => {
			const { data: authData } = await supabase.auth.getUser();
			const user = authData.user;
			setUserEmail(user?.email ?? null);

			if (user) {
				const { data: roles } = await supabase
					.from("roles")
					.select("role")
					.eq("id", user.id)
					.single();

				setRole(roles?.role ?? null);
			}
		};

		getUserData();
	}, []);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setUserEmail(null);
		setRole(null);
		router.refresh();
	};

	return (
		<nav className="bg-blue-300 py-4">
			<div className="container mx-auto flex justify-between items-center px-4">
				<Link href="/" className="text-2xl font-semibold">
					42AD Vibes
				</Link>

				<div className="relative text-sm space-x-4">
					{userEmail ? (
						<div className="relative inline-block text-left">
							<button
								onClick={() => setMenuOpen((prev) => !prev)}
								className="px-3 py-2 bg-white rounded-md shadow hover:bg-gray-100"
							>
								Hi, {userEmail}
							</button>

							{menuOpen && (
								<div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
									{role === "admin" && (
										<Link
											href="/admin"
											className="block px-4 py-2 hover:bg-gray-100"
										>
											Admin Dashboard
										</Link>
									)}
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
