export function getConfessionResponse(confession) {
    return confession.confession_responses ?? null;
}

export function getConfessionStatus(confession) {
    const response = getConfessionResponse(confession);

    if (!response) {
        return "PENDING";
    }

    return response.response;
}
