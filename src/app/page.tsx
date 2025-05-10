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

			const { data: eventsData } = await supabase
				.from("events")
				.select("*")
				.order("date");

			if (eventsData) setEvents(eventsData);
			setLoading(false);
		};

		fetchData();
	}, []);

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>

			{loading ? (
				<p className="text-gray-500">Loading events...</p>
			) : events.length === 0 ? (
				<p className="text-gray-500">No events found.</p>
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
							<div className="flex gap-4">
								<Link
									href={`/events/${event.id}`}
									className="text-blue-600 hover:underline"
								>
									View
								</Link>
								{isAdmin && (
									<Link
										href={`/admin/events/${event.id}`}
										className="text-yellow-600 hover:underline"
									>
										Manage
									</Link>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
