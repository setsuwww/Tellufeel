<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

import { createConfession } from "@/services/confession.service";
import { generateCuid } from "@/utils/cuid";
import { validateConfession } from "@/validators/confession.validator";

const router = useRouter();

const senderName = ref("");
const recipientName = ref("");
const message = ref("");

const loading = ref(false);

const error = ref("");
const copied = ref(false);

const recipientUrl = ref("");

const formCard = ref(null);
const title = ref(null);
const form = ref(null);
const resultCard = ref(null);

async function handleSubmit() {
    error.value = "";
    copied.value = false;

    const formData = {
        senderName: senderName.value,
        recipientName: recipientName.value,
        message: message.value,
    };

    if (!validateConfession(formData)) {
        error.value = "Semua field wajib diisi.";
        return;
    }

    loading.value = true;

    try {
        const cuid = generateCuid();

        const result = await createConfession({
            cuid,
            ...formData,
        });

        recipientUrl.value =
            `${window.location.origin}/c/${result.confession.cuid}?token=${result.recipientToken}`;

        await animateResult();
    } catch (err) {
        console.error(err);

        error.value = "Gagal membuat confess.";
    } finally {
        loading.value = false;
    }
}

async function copyLink() {
    if (!recipientUrl.value) {
        return;
    }

    try {
        await navigator.clipboard.writeText(
            recipientUrl.value,
        );

        copied.value = true;

        gsap.fromTo(
            ".copy-button",
            {
                scale: 0.96,
            },
            {
                scale: 1,
                duration: 0.3,
                ease: "back.out(1.7)",
            },
        );
    } catch (err) {
        console.error(err);

        error.value = "Gagal menyalin link.";
    }
}

function createNewConfession() {
    senderName.value = "";
    recipientName.value = "";
    message.value = "";

    recipientUrl.value = "";
    copied.value = false;
    error.value = "";

    requestAnimationFrame(() => {
        gsap.fromTo(
            formCard.value,
            {
                opacity: 0,
                y: 20,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
            },
        );
    });
}

async function animateResult() {
    await new Promise((resolve) => {
        requestAnimationFrame(() => {
            gsap.fromTo(
                resultCard.value,
                {
                    opacity: 0,
                    y: 25,
                    scale: 0.98,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "power3.out",
                    onComplete: resolve,
                },
            );
        });
    });
}

onMounted(() => {
    const tl = gsap.timeline({
        defaults: {
            ease: "power3.out",
        },
    });

    tl.from(formCard.value, {
        opacity: 0,
        y: 35,
        scale: 0.98,
        duration: 0.7,
    })
        .from(
            title.value,
            {
                opacity: 0,
                y: 15,
                duration: 0.4,
            },
            "-=0.35",
        )
        .from(
            form.value,
            {
                opacity: 0,
                y: 15,
                duration: 0.45,
            },
            "-=0.2",
        );
});
</script>

<template>
    <main
        class="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-rose-950 px-5 py-10 text-slate-50">

        <section ref="formCard"
            class="relative w-full max-w-xl rounded-md border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8">
            <!-- Header -->
            <div ref="title" class="mb-8">
                <div class="mb-4 flex items-center justify-between">
                    <span class="text-xs font-semibold tracking-[0.2em] text-pink-400">
                        CONFESS
                    </span>

                    <button type="button" @click="router.push('/')"
                        class="text-sm text-slate-500 transition hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40 active:scale-95">
                        Kembali
                    </button>
                </div>

                <h1 class="font-serif text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                    Kirim
                    <span class="text-pink-400">
                        Confess.
                    </span>
                </h1>

                <p class="mt-3 max-w-md font-sans text-sm leading-6 text-slate-400">
                    Tulis sesuatu yang mungkin selama ini
                    belum sempat kamu sampaikan.
                </p>
            </div>

            <!-- Form -->
            <form v-if="!recipientUrl" ref="form" @submit.prevent="handleSubmit" class="space-y-5">
                <div>
                    <label for="senderName" class="mb-2 block font-sans text-sm font-medium text-slate-300">
                        Nama kamu
                    </label>

                    <input id="senderName" name="senderName" v-model="senderName" type="text" autocomplete="name"
                        placeholder="Misalnya: Rizzler"
                        class="w-full rounded-sm border border-slate-700 bg-slate-950 px-4 py-3 font-sans text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10" />
                </div>

                <div>
                    <label for="recipientName" class="mb-2 block font-sans text-sm font-medium text-slate-300">
                        Nama dia
                    </label>

                    <input id="recipientName" name="recipientName" v-model="recipientName" type="text"
                        placeholder="Nama orang yang dituju"
                        class="w-full rounded-sm border border-slate-700 bg-slate-950 px-4 py-3 font-sans text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10" />
                </div>

                <div>
                    <label for="message" class="mb-2 block font-sans text-sm font-medium text-slate-300">
                        Pesan
                    </label>

                    <textarea id="message" name="message" v-model="message" rows="6"
                        placeholder="Tulis confess kamu di sini..."
                        class="w-full resize-none rounded-sm border border-slate-700 bg-slate-950 px-4 py-3 font-sans text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10" />
                </div>

                <p v-if="error"
                    class="rounded-sm border border-pink-900/50 bg-pink-950/30 px-4 py-3 font-sans text-sm text-pink-300">
                    {{ error }}
                </p>

                <button type="submit" :disabled="loading"
                    class="w-full rounded-sm bg-pink-500 px-5 py-3 font-sans text-sm font-bold text-white transition hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
                    {{ loading ? "Membuat..." : "Buat Confess" }}
                </button>
            </form>

            <!-- Result -->
            <section v-else ref="resultCard" class="space-y-6">
                <!-- Success Banner -->
                <div class="rounded-sm border border-pink-500/30 bg-pink-500/10 p-5">
                    <p class="font-sans text-xs font-bold tracking-[0.18em] text-pink-400">
                        BERHASIL
                    </p>

                    <h2 class="mt-2 font-serif text-3xl font-semibold leading-tight text-pink-300">
                        Confess kamu siap.
                    </h2>

                    <p class="mt-3 font-sans text-sm leading-6 text-pink-200/70">
                        Tinggal kamu kasih aja ke Doi.
                        <br />
                        Semoga diberikan kabar baik.
                    </p>
                </div>

                <!-- Link -->
                <div>
                    <label for="recipientUrl" class="mb-2 block font-sans text-sm font-semibold text-slate-300">
                        Link Confess
                    </label>

                    <input id="recipientUrl" :value="recipientUrl" type="text" readonly
                        class="w-full rounded-sm border border-slate-700 bg-slate-950 px-4 py-3 font-sans text-xs text-slate-400 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10" />
                </div>

                <!-- Actions -->
                <div class="grid gap-3 sm:grid-cols-2">
                    <button type="button"
                        class="copy-button rounded-sm bg-pink-500 px-5 py-3 font-sans text-sm font-bold text-white transition hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30 active:scale-[0.98]"
                        @click="copyLink">
                        {{
                            copied
                                ? "Link tersalin"
                                : "Copy Link"
                        }}
                    </button>

                    <button type="button" @click="createNewConfession"
                        class="rounded-sm border border-slate-700 bg-slate-900 px-5 py-3 font-sans text-sm font-semibold text-slate-300 transition hover:border-pink-500/30 hover:bg-slate-800 hover:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500/20 active:scale-[0.98]">
                        Buat Lagi
                    </button>
                </div>

                <button type="button" @click="router.push('/dashboard')"
                    class="w-full rounded-sm border border-slate-800 px-5 py-3 font-sans text-sm text-slate-500 transition hover:border-pink-500/20 hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 active:scale-[0.98]">
                    Lihat Dashboard
                </button>
            </section>
        </section>
    </main>
</template>
