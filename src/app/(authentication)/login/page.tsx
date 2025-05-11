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
							type="email"
							required
							className="w-full bg-black border border-white/10 px-3 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							required
							className="w-full bg-black border border-white/10 px-3 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					{errorMsg && (
						<p className="text-sm text-red-400 bg-red-950 p-2 rounded">
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
