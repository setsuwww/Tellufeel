<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useGuest } from "@/composables/useGuest";

const { loading, initializeGuest } = useGuest();

onMounted(async () => {
    try {
        await initializeGuest();
    } catch (error) {
        console.error(
            "Guest initialization failed:",
            error,
        );
    }
});
</script>

<template>
  <div v-if="loading">
    Loading...
  </div>

  <RouterView v-else />
</template>
