"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Event } from "@/types/types";

export default function EventDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const [event, setEvent] = useState<Event | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const supabase = createClient();
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

			const { data } = await supabase
				.from("events")
				.select("*")
				.eq("id", id)
				.single();

			setEvent(data ?? null);
			setLoading(false);
		};

		fetchData();
	}, [id]);

	if (loading) {
		return <p className="p-6 text-gray-500">Loading event...</p>;
	}

	if (!event) {
		return <p className="p-6 text-red-500">Event not found.</p>;
	}

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-2">{event.title}</h1>
			<p className="text-gray-500">{event.date}</p>
			<div className="mt-4">
				<p>{event.description}</p>
			</div>

			{isAdmin && (
				<Link
					href={`/admin/events/${event.id}`}
					className="mt-6 inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
				>
					Manage
				</Link>
			)}
		</div>
	);
}
