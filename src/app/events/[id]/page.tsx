"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Event } from "@/types/types";
import {
	Calendar,
	Users,
	Check,
	X,
	Sparkles,
	Edit,
	ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function EventDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const supabase = createClient();
	const [event, setEvent] = useState<Event | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);
	const [hasRSVPed, setHasRSVPed] = useState(false);
	const { user } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
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

			if (!data) {
				setLoading(false);
				return;
			}

			const { count } = await supabase
				.from("rsvps")
				.select("*", { count: "exact", head: true })
				.eq("event_id", data.id);

			data.rsvps = count ?? 0;

			setEvent(data ?? null);

			if (user) {
				const { count: userRSVPCount } = await supabase
					.from("rsvps")
					.select("*", { count: "exact", head: true })
					.eq("event_id", data.id)
					.eq("user_id", user.id);

				setHasRSVPed((userRSVPCount ?? 0) > 0);
			}
			setLoading(false);
		};

		fetchData();
	}, [id, supabase, user]);

	const handleRSVP = async () => {
		if (!user) {
			alert("You must be logged in to RSVP.");
			return;
		}

		const { error } = await supabase.from("rsvps").insert({
			user_id: user.id,
			event_id: id,
		});

		if (!error) {
			setHasRSVPed(true);
			setEvent((prev) =>
				prev ? { ...prev, rsvps: (prev.rsvps ?? 0) + 1 } : prev
			);
		}
	};

	const handleCancelRSVP = async () => {
		if (!user) return;

		await supabase
			.from("rsvps")
			.delete()
			.eq("user_id", user.id)
			.eq("event_id", id);

		setEvent((prev) =>
			prev ? { ...prev, rsvps: (prev.rsvps ?? 1) - 1 } : prev
		);
		setHasRSVPed(false);
	};

	if (loading) {
		return (
			<p className="p-6 text-gray-50 w-full text-center">
				Loading event...
			</p>
		);
	}

	if (!event)
		return (
			<>
				<p className="pt-8  w-full text-center text-orange-400">
					Event not found.
				</p>
				<Link
					href="/"
					className="text-sm underline text-white/70 hover:text-white transition w-full text-center"
				>
					Back to Events
				</Link>
			</>
		);

	return (
		<div className="relative p-6 max-w-4xl mx-auto text-white">
			<div className="absolute inset-0 -z-10">
				<div className="absolute w-96 h-96 bg-purple-600 opacity-30 rounded-full blur-3xl top-0 left-0 animate-pulse slow" />
				<div className="absolute w-96 h-96 bg-orange-500 opacity-30 rounded-full blur-3xl bottom-0 right-0 animate-pulse slow delay-200" />
			</div>

			<Link
				href="/"
				className="inline-flex items-center gap-2 mb-4 text-sm text-white/70 hover:text-white transition"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Events
			</Link>

			<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 space-y-4">
				<h1 className="text-xl sm:text-3xl font-bold text-white">
					{event.title}
				</h1>
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

				<div className="text-sm text-gray-400 font-medium whitespace-nowrap flex items-center gap-1">
					{event.rsvps}/{event.capacity}
					<Users className="w-4 h-4" />
				</div>

				{isAdmin ? (
					<Link
						href={`/admin/events/${event.id}`}
						className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white/90 border border-white/20 px-3 py-1.5 rounded-md transition"
					>
						<Edit className="w-3.5 h-3.5" />
						Edit Event
					</Link>
				) : user ? (
					<div className="flex items-center gap-2 mt-4">
						{hasRSVPed ? (
							<>
								<span className="inline-flex items-center gap-1 px-3 rounded-full text-sm font-medium">
									<Check className="w-3.5 h-3.5" />
									Going
								</span>
								<button
									onClick={handleCancelRSVP}
									className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-white bg-orange-100/10 hover:bg-orange-400/20 text-sm transition"
								>
									<X className="w-4 h-4" />
									Cancel
								</button>
							</>
						) : event.rsvps >= event.capacity ? (
							<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-700/40 text-orange-300 text-sm font-medium">
								<X className="w-3.5 h-3.5" />
								Full
							</span>
						) : (
							<button
								onClick={handleRSVP}
								className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold text-white relative overflow-hidden shadow-md group z-10 bg-gradient-to-r from-blue-500 to-orange-500   hover:brightness-120 transition duration-300 hover:ring-white
								"
							>
								<span className="absolute inset-0 rounded-xl blur-xl opacity-50 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 animate-pulse z-0"></span>
								<span className="relative z-10 flex items-center gap-1">
									<Sparkles className="w-4 h-4" />
									RSVP
								</span>
							</button>
						)}
					</div>
				) : (
					<p className="mt-4 text-sm text-purple-300 font-medium">
						<Link
							href="/login"
							className="underline hover:text-purple-200"
						>
							Log in
						</Link>{" "}
						to RSVP
					</p>
				)}
			</div>
		</div>
	);
}
