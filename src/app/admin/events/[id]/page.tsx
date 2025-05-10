"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Event } from "@/types/types";

export default function AdminEditEventPage() {
	const { id } = useParams<{ id: string }>();
	const supabase = createClient();
	const router = useRouter();

	const [event, setEvent] = useState<Event | null>(null);
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(true);

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
	}, [id]);

	const handleSave = async () => {
		await supabase
			.from("events")
			.update({ title, date, description })
			.eq("id", id);

		router.push(`/events/${id}`);
	};

	const handleDiscard = () => {
		router.push(`/events/${id}`);
	};

	const handleDelete = async () => {
		await supabase.from("events").delete().eq("id", id);
		router.push("/");
	};

	if (loading) return <p className="p-6 text-gray-500">Loading editor...</p>;
	if (!event) return <p className="p-6 text-red-500">Event not found.</p>;

	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Edit Event</h1>

			<div className="space-y-4">
				<div>
					<label className="block font-medium">Title</label>
					<input
						className="w-full border p-2 rounded"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div>
					<label className="block font-medium">Date</label>
					<input
						type="date"
						className="w-full border p-2 rounded"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</div>

				<div>
					<label className="block font-medium">Description</label>
					<textarea
						className="w-full border p-2 rounded"
						rows={4}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div className="flex gap-4 mt-6">
					<button
						onClick={handleSave}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					>
						Save
					</button>
					<button
						onClick={handleDiscard}
						className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
					>
						Discard
					</button>
					<button
						onClick={handleDelete}
						className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-auto"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
