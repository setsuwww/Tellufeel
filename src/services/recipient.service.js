import { supabase } from "@/lib/supabase";

export async function getConfession({
    cuid,
    token,
}) {
    const { data, error } = await supabase.functions.invoke(
        "get-confession",
        {
            body: {
                cuid,
                token,
            },
        },
    );

    if (error) {
        throw error;
    }

    if (data?.error) {
        throw new Error(data.error);
    }

    return data.confession;
}
