import { Event } from "@/types/types";
import events from "@/data/events.json";

const getEventById = (id: string): Event | undefined => {
	return events.find((event) => event.id === id);
};

export default async function EventDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const id = (await params).id;
	const event = id ? getEventById(id as string) : undefined;

	if (!event) {
		return <p>Event not found.</p>;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold">{event.title}</h1>
			<p className="text-gray-500">{event.date}</p>
			<div className="mt-4">
				<p>{event.description}</p>
			</div>
		</div>
	);
}
