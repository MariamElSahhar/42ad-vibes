"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
	user: User | null;
	isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	isAdmin: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const supabase = createClient();
	const [user, setUser] = useState<User | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const getInitialSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setUser(session?.user ?? null);

			if (session?.user) {
				const { data: roleData } = await supabase
					.from("roles")
					.select("role")
					.eq("id", session.user.id)
					.single();
				setIsAdmin(roleData?.role === "admin");
			} else {
				setIsAdmin(false);
			}
		};

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);

			if (session?.user) {
				supabase
					.from("roles")
					.select("role")
					.eq("id", session.user.id)
					.single()
					.then(({ data }) => setIsAdmin(data?.role === "admin"));
			} else {
				setIsAdmin(false);
			}
		});

		getInitialSession();

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase]);

	return (
		<AuthContext.Provider value={{ user, isAdmin }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
