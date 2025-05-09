import Link from "next/link";

type EventCardProps = {
	id: string;
	title: string;
	date: string;
	description?: string;
};

export default function EventCard({
	id,
	title,
	date,
	description,
}: EventCardProps) {
	return (
		<div className="border rounded-2xl shadow-md p-4 bg-white ">
			<h2 className="text-xl font-bold mb-1">
				<Link href={`/events/${id}`}>{title}</Link>
			</h2>
			<p className="text-sm text-gray-500">{date}</p>
			{description && <p className="mt-2 text-gray-700">{description}</p>}
		</div>
	);
}
