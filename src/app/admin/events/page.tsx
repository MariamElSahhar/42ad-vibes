"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import EventCards from "@/components/event-cards";
import { Plus } from "lucide-react";

export default function ManageEventsPage() {
	const supabase = createClient();
	const [isAdmin, setIsAdmin] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [newEventTitle, setNewEventTitle] = useState("");
	const [newEventDate, setNewEventDate] = useState("");
	const [newEventDescription, setNewEventDescription] = useState("");

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
		};

		fetchData();
	}, [supabase]);

	const handleCreateEvent = async () => {
		const { error } = await supabase.from("events").insert([
			{
				title: newEventTitle,
				date: newEventDate,
				description: newEventDescription,
			},
		]);

		if (error) {
			console.error("Error creating event:", error);
		} else {
			setIsCreateModalOpen(false);
			setNewEventTitle("");
			setNewEventDate("");
			setNewEventDescription("");
		}
	};

	const handleModalToggle = () => {
		setIsCreateModalOpen(!isCreateModalOpen);
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-3xl font-normal">Upcoming Events</h1>
				{isAdmin && (
					<button
						onClick={() => setIsCreateModalOpen(true)}
						className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-blue-800 text-gray-300 hover:bg-blue-900 transition cursor-pointer"
					>
						<Plus className="w-4 h-4" />
						Add Event
					</button>
				)}
			</div>
			<EventCards />

			{isCreateModalOpen && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="relative bg-white/10 border border-white/20 text-white backdrop-blur-xl rounded-2xl p-6 shadow-2xl max-w-lg w-full overflow-hidden">
						{/* 💫 Gradient blobs */}
						<div className="absolute inset-0 -z-10">
							<div className="absolute w-72 h-72 bg-purple-600 opacity-30 rounded-full blur-3xl top-0 left-0 animate-pulse slow" />
							<div className="absolute w-72 h-72 bg-orange-500 opacity-30 rounded-full blur-3xl bottom-0 right-0 animate-pulse slow delay-200" />
						</div>

						<h2 className="text-2xl font-semibold mb-6">
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
							className="w-full p-2 mb-4 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
							value={newEventDate}
							onChange={(e) => setNewEventDate(e.target.value)}
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
							className="w-full p-2 mb-6 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
							placeholder="Event description..."
							value={newEventDescription}
							onChange={(e) =>
								setNewEventDescription(e.target.value)
							}
						/>

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
