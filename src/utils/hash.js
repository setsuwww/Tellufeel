export async function hashToken(token) {
    const encoder = new TextEncoder();

    const data = encoder.encode(token);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data,
    );

    return Array.from(new Uint8Array(hashBuffer), (byte) =>
        byte.toString(16).padStart(2, "0"),
    ).join("");
}
