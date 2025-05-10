"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SignUpPage() {
	const supabase = createClient();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrorMsg("");

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			setErrorMsg(error.message);
			setLoading(false);
			return;
		}

		const userId = data.user?.id;
		if (userId) {
			const res = await fetch("/api/create-profile", {
				method: "POST",
				body: JSON.stringify({ id: userId }),
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				setErrorMsg("Failed to create profile");
				setLoading(false);
				return;
			}
		}

		router.push("/");
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg border bg-white">
			<h1 className="text-2xl font-bold mb-4">Sign Up</h1>

			<form onSubmit={handleSignUp} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">
						Email
					</label>
					<input
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Password
					</label>
					<input
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>

				{errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

				<button
					type="submit"
					disabled={loading}
					className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800"
				>
					{loading ? "Signing up..." : "Sign Up"}
				</button>
			</form>
		</div>
	);
}
