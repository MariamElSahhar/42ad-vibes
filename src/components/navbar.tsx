"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
	const supabase = createClient();
	const router = useRouter();
	const { user } = useAuth();

	const menuRef = useRef<HTMLDivElement>(null);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setMenuOpen(false);
		router.push("/");
	};

	return (
		<nav
			className="bg-blue-900/10 backdrop-blur-md border-b border-white/10 text-white sticky top-0 z-50 shadow-sm py-3"
			ref={menuRef}
		>
			<div className="container mx-auto flex justify-between items-center px-4">
				<Link
					href="/"
					className="text-2xl font-bold tracking-wide hover:text-purple/90 transition"
				>
					42AD Vibes
				</Link>

				<div className="relative text-sm space-x-4">
					{user ? (
						<div className="relative inline-block text-left">
							<button
								onClick={() => setMenuOpen((prev) => !prev)}
								className="flex items-center px-4 py-2 text-white cursor-pointer"
							>
								<span className="mr-2">
									Hi, {user.user_metadata.username}
								</span>
								<svg
									className={`w-5 h-5 transform transition-transform ${
										menuOpen ? "rotate-180" : "rotate-0"
									}`}
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</button>

							{menuOpen && (
								<div
									className="absolute right-0 w-30 rounded-md shadow-lg z-50 opacity-0 transition-opacity duration-300 transform translate-y-2"
									style={{
										opacity: menuOpen ? 1 : 0,
										transform: menuOpen
											? "translateY(0)"
											: "translateY(10px)",
									}}
								>
									<div className="absolute right-0 mt-2 w-36 bg-orange-400/90 backdrop-blur-md rounded-md shadow-lg ring-1 ring-white/20 z-50 hover:bg-orange-500/90 transition">
										<button
											onClick={handleSignOut}
											className="block w-full text-left px-4 py-2 text-white transition"
										>
											Sign Out
										</button>
									</div>
								</div>
							)}
						</div>
					) : (
						<>
							<Link
								href="/login"
								className="px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#6C63FF] to-[#9A6BFF] hover:brightness-130 transition"
							>
								Login
							</Link>
							<Link
								href="/signup"
								className="px-4 py-2 rounded-xl font-medium text-[#6C63FF] border border-[#6C63FF] hover:bg-[#6C63FF] hover:text-white transition"
							>
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
