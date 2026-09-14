<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import { useGuest } from "@/composables/useGuest";
import { createConfession } from "@/services/confession.service";

const { user, loading, initializeGuest } = useGuest();

onMounted(async () => {
    try {
        await initializeGuest();

        console.log("Guest ID:", user.value.id);

        const result = await createConfession({
            cuid: `test-${crypto.randomUUID()}`,
            senderName: "Rifqi",
            recipientName: "Ayu",
            message: "Kamu mau ga jadi pacarku?",
        });

        console.log("Created confession:", result.confession);
        console.log("Creator token:", result.creatorToken);
        console.log("Recipient token:", result.recipientToken);
    } catch (error) {
        console.error("Application error:", error);
    }
});
</script>

<template>
    <div v-if="loading">
        Loading...
    </div>

    <RouterView v-else />
</template>
