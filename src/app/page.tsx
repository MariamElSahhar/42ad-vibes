"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import EventCards from "@/components/event-cards";
import { Settings } from "lucide-react";

export default function HomePage() {
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const supabase = createClient();

		const fetchData = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const user = session?.user;

			if (user) {
				const { data: roleData } = await supabase
					.from("roles")
					.select("role")
					.eq("id", user.id)
					.single();

				setIsAdmin(roleData?.role === "admin");
			} else {
				setIsAdmin(false);
			}
		};

		fetchData();

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				if (event === "SIGNED_OUT") {
					setIsAdmin(false);
				} else if (event === "SIGNED_IN" && session?.user) {
					supabase
						.from("roles")
						.select("role")
						.eq("id", session.user.id)
						.single()
						.then(({ data }) => {
							setIsAdmin(data?.role === "admin");
						});
				}
			}
		);

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, []);

	return (
		<div className="p-6 mx-6">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-3xl font-normal">Upcoming Events</h1>
				{isAdmin && (
					<Link
						href="/admin/events"
						className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-blue-800 text-gray-300 hover:bg-blue-900 transition"
					>
						<Settings className="w-4 h-4" />
						Manage
					</Link>
				)}
			</div>
			<EventCards />
		</div>
	);
}
