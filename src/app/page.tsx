"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Event } from "@/types/types";

export default function HomePage() {
	const supabase = createClient();
	const [events, setEvents] = useState<Event[]>([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			// Get the session and check if the user is an admin
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
			}

			// Fetch the events for the homepage
			const { data: eventData } = await supabase
				.from("events")
				.select("*")
				.order("date");

			setEvents(eventData ?? []);
			setLoading(false);
		};

		fetchData();
	}, []);

	if (loading) {
		return <p className="p-6 text-gray-500">Loading events...</p>;
	}

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>

			{/* Admin-only "Manage Events" button */}
			{isAdmin && (
				<div className="mb-4">
					<Link
						href="/admin/events"
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					>
						Manage Events
					</Link>
				</div>
			)}

			{/* Display events */}
			{events.length === 0 ? (
				<p>No events available.</p>
			) : (
				<ul className="space-y-4">
					{events.map((event) => (
						<li
							key={event.id}
							className="p-4 border rounded shadow flex justify-between items-center"
						>
							<div>
								<h2 className="font-semibold">{event.title}</h2>
								<p className="text-sm text-gray-500">
									{event.date}
								</p>
							</div>
							<Link
								href={`/events/${event.id}`}
								className="text-blue-600 hover:underline"
							>
								View
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
