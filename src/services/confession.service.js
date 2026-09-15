import { supabase } from "@/lib/supabase";
import { generateToken } from "@/utils/token";
import { hashToken } from "@/utils/hash";

export async function getMyConfessions() {
    const { data, error } = await supabase
        .from("confessions")
        .select(`
            id,
            cuid,
            sender_name,
            recipient_name,
            message,
            created_at
        `)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return data;
}

export async function createConfession({
    cuid,
    senderName,
    recipientName,
    message,
}) {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("Guest session not found.");
    }

    const creatorToken = generateToken();
    const recipientToken = generateToken();

    const creatorTokenHash = await hashToken(creatorToken);
    const recipientTokenHash = await hashToken(recipientToken);

    const { data, error } = await supabase
        .from("confessions")
        .insert({
            creator_id: user.id,
            cuid,
            sender_name: senderName.trim(),
            recipient_name: recipientName.trim(),
            message: message.trim(),
            creator_token_hash: creatorTokenHash,
            recipient_token_hash: recipientTokenHash,
        })
        .select("id, cuid, sender_name, recipient_name, message, created_at")
        .single();

    if (error) {
        throw error;
    }

    return {
        confession: data,
        creatorToken,
        recipientToken,
    };
}
