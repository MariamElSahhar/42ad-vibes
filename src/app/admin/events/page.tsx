"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Event } from "@/types/types";

export default function ManageEventsPage() {
	const supabase = createClient();
	const [events, setEvents] = useState<Event[]>([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);
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

			// Fetch the events for the manage page
			const { data: eventData } = await supabase
				.from("events")
				.select("*")
				.order("date");

			setEvents(eventData ?? []);
			setLoading(false);
		};

		fetchData();
	}, [supabase]);

	const handleCreateEvent = async () => {
		// Create event in the database
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
			// Close the modal and refresh the events
			setIsCreateModalOpen(false);
			setNewEventTitle("");
			setNewEventDate("");
			setNewEventDescription("");
			// Reload events
			const { data: eventData } = await supabase
				.from("events")
				.select("*")
				.order("date");
			setEvents(eventData ?? []);
		}
	};

	const handleModalToggle = () => {
		setIsCreateModalOpen(!isCreateModalOpen);
	};

	if (loading) {
		return <p className="p-6 text-gray-500">Loading events...</p>;
	}

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-4">Manage Events</h1>

			{/* Only show this button if the user is an admin */}
			{isAdmin && (
				<button
					onClick={handleModalToggle}
					className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
				>
					+ Create Event
				</button>
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

							{/* View Event Button */}
							<Link
								href={`/events/${event.id}`}
								className="text-blue-600 hover:underline"
							>
								View
							</Link>

							{/* Manage Event Button (admin only) */}
							{isAdmin && (
								<Link
									href={`/admin/events/${event.id}`}
									className="text-red-600 hover:underline"
								>
									Manage
								</Link>
							)}
						</li>
					))}
				</ul>
			)}

			{/* Create Event Modal */}
			{isCreateModalOpen && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded shadow-md max-w-lg w-full">
						<h2 className="text-xl font-semibold mb-4">
							Create Event
						</h2>

						<label htmlFor="title" className="block mb-2">
							Title
						</label>
						<input
							type="text"
							id="title"
							className="w-full p-2 border border-gray-300 rounded mb-4"
							value={newEventTitle}
							onChange={(e) => setNewEventTitle(e.target.value)}
						/>

						<label htmlFor="date" className="block mb-2">
							Date
						</label>
						<input
							type="date"
							id="date"
							className="w-full p-2 border border-gray-300 rounded mb-4"
							value={newEventDate}
							onChange={(e) => setNewEventDate(e.target.value)}
						/>

						<label htmlFor="description" className="block mb-2">
							Description
						</label>
						<textarea
							id="description"
							className="w-full p-2 border border-gray-300 rounded mb-4"
							value={newEventDescription}
							onChange={(e) =>
								setNewEventDescription(e.target.value)
							}
						/>

						<div className="flex justify-between">
							<button
								onClick={handleModalToggle}
								className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateEvent}
								className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
							>
								Create Event
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
