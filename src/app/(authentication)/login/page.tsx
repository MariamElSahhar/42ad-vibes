"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
	const router = useRouter();
	const supabase = createClient();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrorMsg("");

		if (!email || !password) {
			setErrorMsg("Please enter both email and password.");
			setLoading(false);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			setErrorMsg("Please enter a valid email address.");
			setLoading(false);
			return;
		}

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setErrorMsg(error.message);
			setLoading(false);
		} else {
			router.push("/");
			router.refresh();
		}
	};

	return (
		<div className="flex-1 flex flex-col justify-center items-center w-full px-4 py-8 max-w-4xl mx-auto">
			<div className="absolute -z-10 inset-0 overflow-hidden">
				<div className="absolute w-180 h-180 bg-purple-600 opacity-20 rounded-full blur-3xl top-0 -left-20 animate-pulse" />
				<div className="absolute w-150 h-150 bg-orange-500 opacity-20 rounded-full blur-3xl bottom-0 -right-20 animate-pulse delay-200" />
				<div className="absolute w-60 h-60 bg-blue-500 opacity-10 rounded-full blur-2xl bottom-0 left-100 animate-pulse delay-300" />
			</div>

			<div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md text-white rounded-2xl p-8 shadow-xl">
				<h1 className="text-3xl font-medium text-center mb-6 text-white">
					Welcome Back 💫
				</h1>

				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<label className="block text-sm mb-1 text-gray-300">
							Email
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm mb-1 text-gray-300">
							Password
						</label>
						<input
							type="password"
							className="w-full px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
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
							{loading ? "Logging in..." : "Login"}
						</span>
					</button>
				</form>

				<p className="text-sm text-center text-gray-400 mt-6">
					Don’t have an account?{" "}
					<Link
						href="/signup"
						className="text-purple-400 underline hover:text-purple-300"
					>
						Sign up here
					</Link>
				</p>
			</div>
		</div>
	);
}
