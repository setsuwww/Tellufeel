<script setup>
import { Heart } from "@lucide/vue"
import { nextTick, ref } from "vue";
import gsap from "gsap";

const props = defineProps({
    confession: {
        type: Object,
        required: true,
    },

    submitting: {
        type: Boolean,
        default: false,
    },

    error: {
        type: String,
        default: "",
    },
});

const emit = defineEmits([
    "respond",
    "reject",
]);

const reason = ref("");
const showReasonForm = ref(false);
const reasonForm = ref(null);

async function handleResponse(response) {
    if (response === "NGGA_MAU") {
        showReasonForm.value = true;

        await nextTick();

        gsap.fromTo(
            reasonForm.value,
            {
                opacity: 0,
                y: 10,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: "power2.out",
            },
        );

        return;
    }

    emit("respond", "MAU");
}

function handleReject() {
    if (!reason.value.trim()) {
        return;
    }

    emit(
        "reject",
        reason.value.trim(),
    );
}
</script>

<template>
    <section class="flex min-h-screen items-center justify-center px-5 py-10">
        <article
            class="w-full max-w-xl rounded-md border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/30 sm:p-8">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-800 pb-5">
                <span
                    class="rounded-sm border border-pink-500/20 bg-pink-500/5 px-3 py-1 font-sans text-[11px] font-bold tracking-[0.18em] text-pink-400">
                    CONFESS
                </span>

                <Heart class="text-pink-400" size="20" />
            </div>

            <!-- Information -->
            <div class="mt-7 space-y-5">
                <div>
                    <p class="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                        Dari
                    </p>

                    <p class="mt-1 font-sans text-base font-semibold tracking-wide text-yellow-500">
                        {{ confession.senderName }}
                    </p>
                </div>

                <div>
                    <p class="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                        Untuk
                    </p>

                    <p class="mt-1 font-sans text-base font-semibold tracking-wide text-slate-200">
                        {{ confession.recipientName }}
                    </p>
                </div>

                <!-- Message -->
                <div class="rounded-sm border-l-2 border-pink-500/30 bg-slate-800/60 p-6">
                    <p class="whitespace-pre-wrap font-sans text-base leading-7 text-slate-300">
                        {{ confession.message }}
                    </p>
                </div>
            </div>

            <!-- Actions -->
            <div v-if="!confession.response" class="mt-8">
                <p class="mb-3 font-sans text-xs text-slate-600">
                    Kamu mau kasih jawaban?
                </p>

                <div class="flex gap-3">
                    <button type="button" :disabled="submitting" @click="
                        handleResponse('NGGA_MAU')"
                        class="flex-1 rounded-sm border border-slate-700 bg-slate-900 px-5 py-3 font-sans text-sm font-semibold text-slate-400 transition hover:border-pink-500/30 hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
                        Ngga Mau
                    </button>

                    <button type="button" :disabled="submitting" @click="
                        handleResponse('MAU')"
                        class="flex-1 rounded-sm bg-pink-500 px-5 py-3 font-sans text-sm font-bold text-white transition hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
                        Mau
                    </button>
                </div>

                <!-- Reason -->
                <form v-if="showReasonForm" ref="reasonForm" class="mt-4" @submit.prevent="handleReject">
                    <textarea v-model="reason" rows="4" :disabled="submitting"
                        placeholder="Kenapa? Kasih tahu alasannya..."
                        class="w-full resize-none rounded-sm border border-slate-700 bg-slate-950 px-4 py-3 font-sans text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10" />

                    <button type="submit" :disabled="submitting || !reason.trim()"
                        class="mt-3 w-full rounded-sm border border-pink-500/30 bg-pink-500/10 px-5 py-3 font-sans text-sm font-semibold text-pink-300 transition hover:bg-pink-500/15 focus:outline-none focus:ring-2 focus:ring-pink-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
                        {{ submitting ? "Mengirim..." : "Kirim Alasan" }}
                    </button>
                </form>
            </div>

            <!-- Error -->
            <p v-if="error"
                class="mt-5 rounded-sm border border-pink-900/50 bg-pink-950/20 px-4 py-3 font-sans text-sm text-pink-300">
                {{ error }}
            </p>

            <!-- Response -->
            <div v-if="confession.response" class="mt-8 rounded-sm border border-pink-500/20 bg-pink-500/5 p-4">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500/20">
                        <Heart class="text-pink-200" size="20" />
                    </div>

                    <div>
                        <p class="font-sans text-sm font-semibold text-pink-300">
                            Jawaban kamu sudah dikirim.
                        </p>
                    </div>
                </div>

                <p v-if="confession.response.response === 'NGGA_MAU' && confession.response.reason"
                    class="mt-4 border-t border-pink-500/10 pt-4 font-sans text-sm leading-6 text-slate-500">
                    Alasan:
                    <span class="text-slate-400">
                        {{ confession.response.reason }}
                    </span>
                </p>
            </div>
        </article>
    </section>
</template>
