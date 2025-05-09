"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			alert("Login failed: " + error.message);
		} else {
			router.push("/admin");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-20 p-4 border rounded">
			<h2 className="text-xl font-bold mb-4">Login</h2>
			<input
				className="w-full border p-2 mb-2"
				type="email"
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				className="w-full border p-2 mb-4"
				type="password"
				placeholder="Password"
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button
				onClick={handleLogin}
				className="bg-blue-500 text-white px-4 py-2 rounded"
			>
				Sign In
			</button>
		</div>
	);
}
