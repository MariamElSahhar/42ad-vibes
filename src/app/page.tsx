import EventCard from "@/components/event-card";
import { supabase } from "@/utils/supabase";

export default async function Home() {
	const { data: events } = await supabase.from("events").select();

	return (
		<>
			<h1 className="text-2xl font-bold my-4">Upcoming Events</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{events?.map((event) => (
					<EventCard
						key={event.id}
						title={event.title}
						date={event.date}
						description={event.description}
						id={event.id}
					/>
				))}
			</div>
		</>
	);
}
