<script setup>
import { ref } from "vue";

import { createConfession } from "@/services/confession.service";
import { generateCuid } from "@/utils/cuid";
import { validateConfession } from "@/validators/confession.validator";

const senderName = ref("");
const recipientName = ref("");
const message = ref("");

const loading = ref(false);

const error = ref("");
const success = ref("");

const recipientUrl = ref("");
const copied = ref(false);

async function handleSubmit() {
    error.value = "";
    success.value = "";
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

        success.value = "Confess berhasil dibuat.";
    } catch (err) {
        console.error(err);

        error.value =
            "Gagal membuat confess.";
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
    } catch (err) {
        console.error(err);

        error.value =
            "Gagal menyalin link.";
    }
}
</script>

<template>
    <main>
        <h1>
            Kirim Confess
        </h1>

        <form
            v-if="!recipientUrl"
            @submit.prevent="handleSubmit"
        >
            <div>
                <label for="senderName">
                    Nama kamu
                </label>

                <input
                    id="senderName"
                    name="senderName"
                    v-model="senderName"
                    type="text"
                />
            </div>

            <div>
                <label for="recipientName">
                    Nama dia
                </label>

                <input
                    id="recipientName"
                    name="recipientName"
                    v-model="recipientName"
                    type="text"
                />
            </div>

            <div>
                <label for="message">
                    Pesan
                </label>

                <textarea
                    id="message"
                    name="message"
                    v-model="message"
                />
            </div>

            <button
                type="submit"
                :disabled="loading"
            >
                {{ loading ? "Membuat..." : "Kirim Confess" }}
            </button>
        </form>

        <p v-if="error">
            {{ error }}
        </p>

        <section v-if="recipientUrl">
            <h2>
                Confess berhasil dibuat
            </h2>

            <p>
                Kirim link ini ke orang yang kamu tuju.
            </p>

            <input
                :value="recipientUrl"
                type="text"
                readonly
            />

            <button
                type="button"
                @click="copyLink"
            >
                {{ copied ? "Link tersalin" : "Copy Link" }}
            </button>
        </section>

        <p v-else-if="success">
            {{ success }}
        </p>
    </main>
</template>
