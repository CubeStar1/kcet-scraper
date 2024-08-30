"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { User } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			const { data: authData } = await supabase.auth.getUser();
			if (authData.user) {
				// Fetch user role from the users table
				const { data: userData, error } = await supabase
					.from('users')
					.select('user_role')
					.eq('id', authData.user.id)
					.single();

				if (error) {
					console.error('Error fetching user role:', error);
					return { ...authData.user, user_role: null };
				}

				return { ...authData.user, user_role: userData.user_role };
			}
			return {} as User;
		},
	});
}
