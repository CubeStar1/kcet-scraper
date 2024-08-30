import useUser from '@/app/hook/useUser';
import { useQuery } from '@tanstack/react-query';
import { createSupabaseBrowser } from "@/lib/supabase/client";

function SomeComponent() {
	const { data: user, isLoading: userLoading } = useUser();
	
	const { data: tableData, isLoading: tableLoading } = useQuery({
		queryKey: ['tableData'],
		queryFn: async () => {
			const supabase = createSupabaseBrowser();
			const columns = ['id', 'other_columns'];
			
			// Only include candidate_name if user is a moderator
			if (user.role === 'moderator') {
				columns.push('candidate_name');
			}
			
			const { data, error } = await supabase
				.from('your_table_name')
				.select(columns.join(','));
			
			if (error) throw error;
			return data;
		},
		enabled: !userLoading, // Only run this query after user data is loaded
	});

	if (userLoading || tableLoading) return <div>Loading...</div>;

	return (
		// Render your table data here
	);
}