"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Event } from "@/types/types";
import { Calendar } from "lucide-react";

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
		<div className="relative p-6 max-w-4xl mx-auto text-white">
			{/* 💫 Background blobs */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute w-96 h-96 bg-purple-600 opacity-30 rounded-full blur-3xl top-0 left-0 animate-pulse slow" />
				<div className="absolute w-96 h-96 bg-orange-500 opacity-30 rounded-full blur-3xl bottom-0 right-0 animate-pulse slow delay-200" />
			</div>

			{/* 📄 Event card */}
			<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 space-y-4">
				<h1 className="text-3xl font-bold text-white">{event.title}</h1>
				<p className="text-white/80 text-sm flex items-center gap-1">
					<Calendar className="w-4 h-4" />
					{event.date}
				</p>

				<hr className="border-white/20 my-2" />

				<div>
					<p className="text-white/90 whitespace-pre-line">
						{event.description || "No description provided."}
					</p>
				</div>

				{isAdmin && (
					<Link
						href={`/admin/events/${event.id}`}
						className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 transition px-4 py-2 rounded text-black font-semibold mt-6"
					>
						Manage Event
					</Link>
				)}
			</div>
		</div>
	);
}
