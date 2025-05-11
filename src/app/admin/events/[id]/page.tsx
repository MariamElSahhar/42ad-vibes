"use client";

import { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Event } from "@/types/types";

export default function AdminEditEventPage() {
	const { id } = useParams<{ id: string }>();
	const supabase = createClient();

	const [event, setEvent] = useState<Event | null>(null);
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(true);
	const [confirmOpen, setConfirmOpen] = useState(false);

	useEffect(() => {
		const fetchEvent = async () => {
			const { data } = await supabase
				.from("events")
				.select("*")
				.eq("id", id)
				.single();

			if (data) {
				setEvent(data);
				setTitle(data.title);
				setDate(data.date);
				setDescription(data.description ?? "");
			}

			setLoading(false);
		};

		fetchEvent();
	}, [id, supabase]);

	const handleSave = async () => {
		await supabase
			.from("events")
			.update({ title, date, description })
			.eq("id", id);

		redirect(`/events/${id}`);
	};

	const handleDiscard = () => {
		redirect(`/events/${id}`);
	};

	const handleDeleteConfirmed = async () => {
		await supabase.from("events").delete().eq("id", id);
		redirect("/");
	};

	if (loading) return <p className="p-6 text-gray-500">Loading editor...</p>;
	if (!event) return <p className="p-6 text-red-500">Event not found.</p>;

	return (
		<div className="p-6 max-w-3xl mx-auto relative text-white">
			{/* 💫 Background blobs */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute w-96 h-96 bg-purple-600 opacity-30 rounded-full blur-3xl top-0 left-0 animate-pulse slow" />
				<div className="absolute w-96 h-96 bg-orange-500 opacity-30 rounded-full blur-3xl bottom-0 right-0 animate-pulse slow delay-200" />
			</div>

			<div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
				<h1 className="text-2xl font-bold mb-6">Edit Event</h1>

				<div className="space-y-4">
					<div>
						<label className="block text-white/80 mb-1">
							Title
						</label>
						<input
							className="w-full p-2 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Event title"
						/>
					</div>

					<div>
						<label className="block text-white/80 mb-1">Date</label>
						<input
							type="date"
							className="w-full p-2 bg-white/10 border border-white/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
							value={date}
							onChange={(e) => setDate(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-white/80 mb-1">
							Description
						</label>
						<textarea
							rows={4}
							className="w-full p-2 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="What is this event about?"
						/>
					</div>

					<div className="flex gap-4 mt-6">
						<button
							onClick={handleSave}
							className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded text-white font-medium"
						>
							Save
						</button>
						<button
							onClick={handleDiscard}
							className="bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded text-white border border-white/30"
						>
							Discard
						</button>
						<button
							onClick={() => setConfirmOpen(true)}
							className="ml-auto bg-orange-600 hover:bg-orange-700 transition px-4 py-2 rounded text-white font-medium"
						>
							Delete
						</button>
					</div>
				</div>
			</div>

			{/* 🗑️ Delete confirmation modal */}
			{confirmOpen && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="relative bg-white/10 border border-white/20 text-white backdrop-blur-xl rounded-2xl p-6 shadow-2xl max-w-sm w-full">
						{/* 💫 Blobs */}
						<div className="absolute inset-0 -z-10">
							<div className="absolute w-72 h-72 bg-purple-600 opacity-30 rounded-full blur-3xl top-0 left-0 animate-pulse slow" />
							<div className="absolute w-72 h-72 bg-orange-500 opacity-30 rounded-full blur-3xl bottom-0 right-0 animate-pulse slow delay-200" />
						</div>

						<h2 className="text-xl font-semibold mb-4">
							Confirm Deletion
						</h2>
						<p className="mb-4 text-white/80">
							Are you sure you want to delete this event?
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={() => setConfirmOpen(false)}
								className="px-4 py-2 bg-white/10 border border-white/30 rounded hover:bg-white/20 text-white"
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteConfirmed}
								className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
