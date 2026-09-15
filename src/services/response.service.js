import { supabase } from "@/lib/supabase";

export async function respondConfession({
    cuid,
    token,
    response,
    reason = null,
}) {
    const { data, error } = await supabase.functions.invoke(
        "respond-confession",
        {
            body: {
                cuid,
                token,
                response,
                reason,
            },
        },
    );

    if (error) {
        let message = error.message;

        try {
            const body = await error.context.json();

            if (body?.error) {
                message = body.error;
            }
        } catch { }

        throw new Error(message);
    }

    if (data?.error) {
        throw new Error(data.error);
    }

    return data;
}
