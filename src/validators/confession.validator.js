export function validateConfession({
    senderName,
    recipientName,
    message,
}) {
    if (!senderName?.trim()) {
        return false;
    }

    if (!recipientName?.trim()) {
        return false;
    }

    if (!message?.trim()) {
        return false;
    }

    return true;
}
