import { supabase } from "@/lib/supabase";

export async function getMyConfessionsWithResponses() {
    const { data, error } = await supabase
        .from("confessions")
        .select(`
            id,
            cuid,
            sender_name,
            recipient_name,
            message,
            created_at,
            confession_responses (
                id,
                response,
                reason,
                created_at
            )
        `)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return data;
}
