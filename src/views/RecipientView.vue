<script setup>
import { Heart } from '@lucide/vue'
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import RecipientLoading from "@/components/RecipientLoading.vue";
import RecipientIntro from "@/components/RecipientIntro.vue";
import RecipientLetter from "@/components/RecipientLetter.vue";

import { getConfession } from "@/services/recipient.service";
import { respondConfession } from "@/services/response.service";

const route = useRoute();

const confession = ref(null);

const loading = ref(true);
const showIntro = ref(false);
const showLetter = ref(false);

const submitting = ref(false);
const error = ref("");

const cuid = route.params.cuid;
const token = route.query.token;

async function loadConfession() {
    loading.value = true;
    error.value = "";

    try {
        if (typeof cuid !== "string" || typeof token !== "string") {
            throw new Error("Link confess tidak valid.");
        }

        confession.value = await getConfession({ cuid, token });

        showIntro.value = true;
    }
    catch (err) { error.value = "Link confess tidak valid atau sudah tidak tersedia." }
    finally { loading.value = false }
}

function handleIntroComplete() {
    showIntro.value = false;
    showLetter.value = true;
}

async function handleResponse(response) {
    submitting.value = true;
    error.value = "";

    try {
        await respondConfession({
            cuid,
            token,
            response,
            reason: null,
        });

        confession.value.response = { response, reason: null };
    }
    catch (err) { error.value = "Gagal mengirim jawaban. Silakan coba lagi." }
    finally { submitting.value = false }
}

async function handleReject(reason) {
    submitting.value = true;
    error.value = "";

    try {
        await respondConfession({
            cuid,
            token,
            response: "NGGA_MAU",
            reason,
        });

        confession.value.response = {
            response: "NGGA_MAU",
            reason,
        };
    }
    catch (err) { error.value = "Gagal mengirim jawaban. Silakan coba lagi." }
    finally { submitting.value = false }
}

onMounted(loadConfession);
</script>

<template>
    <main
        class="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-rose-950 text-slate-50">
        <!-- Background -->
        <div class="pointer-events-none fixed inset-0">
            <div
                class="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/5 blur-3xl" />
        </div>

        <!-- Loading -->
        <RecipientLoading v-if="loading" />

        <!-- Error -->
        <div v-else-if="error && !confession" class="relative flex min-h-screen items-center justify-center px-5">
            <div class="w-full max-w-md rounded-md border border-slate-800 bg-slate-900 p-8 text-center">
                <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/20">
                    <Heart />
                </div>

                <h1 class="mt-5 font-serif text-3xl font-semibold text-slate-50">
                    Confess tidak ditemukan
                </h1>

                <p class="mt-3 font-sans text-sm leading-6 text-slate-500">
                    {{ error }}
                </p>
            </div>
        </div>

        <!-- Intro -->
        <RecipientIntro v-else-if="showIntro" @complete="handleIntroComplete" />

        <!-- Letter -->
        <RecipientLetter v-else-if="showLetter" :confession="confession" :submitting="submitting" :error="error"
            @respond="handleResponse" @reject="handleReject" />
    </main>
</template>
