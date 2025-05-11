import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "./utils/supabase/server";

export async function middleware(req: NextRequest) {
	if (!req.nextUrl.pathname.startsWith("/admin")) {
		return NextResponse.next();
	}

	const supabase = await createServerClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	const { data: roleData } = await supabase
		.from("roles")
		.select("role")
		.eq("id", session.user.id)
		.single();

	if (roleData?.role !== "admin") {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
