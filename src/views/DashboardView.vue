<script setup>
import { onMounted, ref } from "vue";

import { getMyConfessionsWithResponses } from "@/services/dashboard.service";
import {
    getConfessionResponse,
    getConfessionStatus,
} from "@/utils/confession";

const confessions = ref([]);
const loading = ref(true);
const error = ref("");

async function loadDashboard() {
    loading.value = true;
    error.value = "";

    try {
        confessions.value = await getMyConfessionsWithResponses();

        console.log("DASHBOARD CONFESSIONS:",
            confessions.value,
        );
    } catch (err) {
        console.error(err);
        error.value = "Gagal memuat confession.";
    } finally {
        loading.value = false;
    }
}

onMounted(loadDashboard);
</script>

<template>
    <main>
        <h1>Dashboard</h1>

        <p v-if="loading">
            Memuat confession...
        </p>

        <p v-else-if="error">
            {{ error }}
        </p>

        <p
            v-else-if="confessions.length === 0"
        >
            Belum ada confession.
        </p>

        <section v-else>
            <article
                v-for="confession in confessions"
                :key="confession.id"
            >
                <h2>
                    Untuk:
                    {{ confession.recipient_name }}
                </h2>

                <p>
                    {{ confession.message }}
                </p>

                <p>
                    Status:
                    {{ getConfessionStatus(confession) }}
                </p>

                <template
                    v-if="
                        getConfessionResponse(confession)
                    "
                >
                    <p>
                        Jawaban:
                        {{
                            getConfessionResponse(confession)
                                .response
                        }}
                    </p>

                    <p
                        v-if="
                            getConfessionResponse(confession)
                                .reason
                        "
                    >
                        Alasan:
                        {{
                            getConfessionResponse(confession)
                                .reason
                        }}
                    </p>
                </template>
            </article>
        </section>
    </main>
</template>
