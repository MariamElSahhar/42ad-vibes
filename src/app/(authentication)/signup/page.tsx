"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function SignUpPage() {
	const supabase = createClient();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [username, setUsername] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrorMsg("");

		if (!username || !email || !password || !confirmPassword) {
			setErrorMsg("Please enter all fields.");
			setLoading(false);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			setErrorMsg("Please enter a valid email address.");
			setLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			setErrorMsg("Passwords do not match");
			setLoading(false);
			return;
		}

		const { error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { username },
			},
		});

		if (authError) {
			setErrorMsg(authError.message);
			setLoading(false);
			return;
		}

		redirect("/");
	};

	return (
		<div className="flex flex-col flex-1 justify-center items-center w-full h-full px-4 py-8">
			<div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-md bg-white/5 shadow-2xl border border-white/10">
				<h1 className="text-3xl  font-medium text-white text-center mb-6">
					Create Account 🚀
				</h1>

				<form onSubmit={handleSignUp} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-white mb-1">
							Username
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-white mb-1">
							Email
						</label>
						<input
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-white mb-1">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-white mb-1">
							Confirm Password
						</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{errorMsg && (
						<p className="text-sm text-orange-200 bg-orange-950/80 p-2 rounded">
							{errorMsg}
						</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full relative z-10 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold py-2 rounded-xl overflow-hidden shadow-lg hover:brightness-120 transition duration-300 hover:ring-white"
					>
						<span className="absolute inset-0 rounded-xl blur-xl opacity-50 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 animate-pulse z-0"></span>
						<span className="relative z-10">
							{loading ? "Creating account..." : "Sign Up"}
						</span>
					</button>
				</form>

				<p className="text-sm text-gray-400 text-center mt-6">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-purple-400 underline hover:text-purple-300"
					>
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}
