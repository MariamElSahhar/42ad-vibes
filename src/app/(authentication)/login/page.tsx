"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
	const supabase = createClient();
	const router = useRouter();
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
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-blue-50">
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							Email
						</label>
						<input
							type="email"
							required
							className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Password
						</label>
						<input
							type="password"
							required
							className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					{errorMsg && (
						<p className="text-sm text-red-600 bg-red-50 p-2 rounded">
							{errorMsg}
						</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
					>
						{loading ? (
							<span className="flex justify-center items-center">
								<svg
									className="animate-spin h-5 w-5 mr-2 text-white"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v8H4z"
									/>
								</svg>
								Logging in...
							</span>
						) : (
							"Login"
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
