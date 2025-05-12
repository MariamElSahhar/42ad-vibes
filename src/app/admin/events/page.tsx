"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import EventCards from "@/components/event-cards";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ManageEventsPage() {
	const supabase = createClient();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [newEventTitle, setNewEventTitle] = useState("");
	const [newEventDate, setNewEventDate] = useState("");
	const [newEventCapacity, setNewEventCapacity] = useState("");
	const [newEventDescription, setNewEventDescription] = useState("");
	const [createError, setCreateError] = useState("");
	const [refreshKey, setRefreshKey] = useState(0);

	const handleCreateEvent = async () => {
		if (
			!newEventTitle.trim() ||
			!newEventDate ||
			!newEventDescription.trim() ||
			!newEventCapacity
		) {
			setCreateError("Please fill in all fields.");
			return;
		}

		const { error } = await supabase.from("events").insert([
			{
				title: newEventTitle,
				date: newEventDate,
				description: newEventDescription,
				capacity: newEventCapacity,
			},
		]);

		if (error) {
			setCreateError("Failed to create event. Please try again.");
		} else {
			setIsCreateModalOpen(false);
			setNewEventTitle("");
			setNewEventDate("");
			setNewEventDescription("");
			setNewEventCapacity("");
			setCreateError("");
			setRefreshKey((prev) => prev + 1);
		}
	};

	const handleModalToggle = () => {
		setIsCreateModalOpen(!isCreateModalOpen);
	};

	return (
		<div className="p-4 sm:p-6 mx-4 sm:mx-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
				<h1 className="text-2xl sm:text-3xl font-normal text-white">
					Upcoming Events
				</h1>
				<div className="flex flex-col sm:flex-row gap-2">
					<Link
						href="/"
						className="px-3 py-2 rounded bg-white/10 border border-white/30 hover:bg-white/20 transition text-white text-sm text-center"
					>
						Public View
					</Link>
					<button
						onClick={() => setIsCreateModalOpen(true)}
						className="flex items-center justify-center gap-1 px-3 py-2 rounded bg-purple-600/30 border border-purple-700 hover:bg-purple-700 transition text-white text-sm"
					>
						<Plus className="w-4 h-4" />
						Add Event
					</button>
				</div>
			</div>

			<EventCards key={refreshKey} />

			{isCreateModalOpen && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="relative bg-white/10 border border-white/20 text-white backdrop-blur-xl rounded-2xl p-6 shadow-2xl max-w-lg w-full overflow-hidden">
						{/* 💫 Gradient blobs */}
						<div className="absolute inset-0 -z-10">
							<div className="absolute w-72 h-72 bg-purple-600 opacity-30 rounded-full blur-3xl top-0 left-0 animate-pulse" />
							<div className="absolute w-72 h-72 bg-orange-500 opacity-30 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-200" />
						</div>

						<h2 className="text-xl sm:text-2xl font-semibold mb-6">
							Create Event
						</h2>

						<label
							htmlFor="title"
							className="block mb-1 text-sm text-white/80"
						>
							Title
						</label>
						<input
							type="text"
							id="title"
							className="w-full p-2 mb-4 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
							placeholder="Enter event title"
							value={newEventTitle}
							onChange={(e) => setNewEventTitle(e.target.value)}
						/>

						<label
							htmlFor="date"
							className="block mb-1 text-sm text-white/80"
						>
							Date
						</label>
						<input
							type="date"
							id="date"
							min={new Date().toISOString().split("T")[0]}
							className="w-full p-2 mb-4 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
							value={newEventDate}
							onChange={(e) => setNewEventDate(e.target.value)}
						/>

						<label
							htmlFor="capacity"
							className="block mb-1 text-sm text-white/80"
						>
							Capacity
						</label>
						<input
							type="number"
							id="capacity"
							className="w-full p-2 mb-4 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
							value={newEventCapacity}
							onChange={(e) =>
								setNewEventCapacity(e.target.value)
							}
						/>

						<label
							htmlFor="description"
							className="block mb-1 text-sm text-white/80"
						>
							Description
						</label>
						<textarea
							id="description"
							rows={3}
							className="w-full p-2 mb-4 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
							placeholder="Event description..."
							value={newEventDescription}
							onChange={(e) =>
								setNewEventDescription(e.target.value)
							}
						/>

						{createError && (
							<p className="text-sm text-orange-200 bg-orange-950/80 p-2 rounded my-2">
								{createError}
							</p>
						)}

						<div className="flex justify-end gap-2">
							<button
								onClick={handleModalToggle}
								className="px-4 py-2 rounded bg-white/10 border border-white/30 hover:bg-white/20 transition text-white"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateEvent}
								className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 transition text-white font-medium"
							>
								Create
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
