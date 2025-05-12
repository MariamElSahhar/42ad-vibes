"use client";
import { ArrowRight, Calendar, Users, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Event } from "@/types/types";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EventCards() {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);
	const isAdminPage = usePathname().startsWith("/admin");

	useEffect(() => {
		const supabase = createClient();
		const today = new Date().toISOString().split("T")[0];
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

			const { data: eventData } = await supabase
				.from("events")
				.select("*")
				.gte("date", today)
				.order("date");

			if (eventData) {
				await Promise.all(
					eventData.map(async (event) => {
						const { count } = await supabase
							.from("rsvps")
							.select("*", { count: "exact", head: true })
							.eq("event_id", event.id);

						event.rsvps = count ?? 0;
					})
				);
			}

			setEvents(eventData ?? []);
			setLoading(false);
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

	if (loading) {
		return (
			<p className="p-6 text-gray-500 w-full text-center">
				Loading events...
			</p>
		);
	}

	return (
		<>
			{events.length === 0 ? (
				<p>No events available.</p>
			) : (
				<ul className="space-y-4">
					{events.map((event) => (
						<li
							key={event.id}
							className="relative p-4 rounded-2xl overflow-hidden border border-white/20 backdrop-blur-md bg-white/10 text-white shadow-lg hover:shadow-xl transition-all flex flex-col md:flex-row md:justify-between md:items-center gap-4"
						>
							<div className="absolute inset-0 -z-10">
								<div className="absolute w-72 h-72 bg-purple-600 opacity-30 rounded-full blur-3xl top-0 left-0 animate-pulse" />
								<div className="absolute w-72 h-72 bg-orange-500 opacity-30 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-200" />
							</div>

							<div className="flex flex-wrap md:flex-nowrap items-center gap-3 justify-between w-full md:w-auto">
								<div>
									<Link
										href={`/events/${event.id}`}
										className="group flex items-center justify-between gap-2 transition"
									>
										<h2 className="font-semibold text-base text-white group-hover:underline">
											{event.title}
										</h2>

										<ArrowRight className="w-5 h-5 text-blue-400 group-hover:text-blue-300 group-hover:translate-x-2 transition-transform duration-200" />
									</Link>
									<p className="text-sm text-gray-400 flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										{event.date}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="text-sm text-gray-400 font-medium whitespace-nowrap flex items-center gap-1">
									{event.rsvps}/{event.capacity}
									<Users className="w-4 h-4" />
								</div>
								{isAdmin && isAdminPage && (
									<Link
										href={`/admin/events/${event.id}`}
										className="flex items-center gap-1 text-xs text-white/70 hover:text-white/90 border border-white/20 px-2 py-1 rounded-md transition"
									>
										<Edit className="w-4 h-4" />
										Edit
									</Link>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
