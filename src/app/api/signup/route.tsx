import { supabase } from "@/utils/supabase";

export async function POST(req: Request) {
	const { id } = await req.json();

	if (!id) {
		return Response.json({ error: "Missing user ID" }, { status: 400 });
	}

	const { error } = await supabase
		.from("profiles")
		.insert([{ id, role: "user" }]);

	if (error) {
		return Response.json({ error: error.message }, { status: 500 });
	}

	return Response.json({ message: "Profile created" }, { status: 200 });
}
