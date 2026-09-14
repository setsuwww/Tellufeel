<script setup>
import { ref } from "vue";
import { createConfession } from "@/services/confession.service";
import { validateConfession } from "@/validators/confession.validator";

const senderName = ref("");
const recipientName = ref("");
const message = ref("");

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const submitConfession = async () => {
    errorMessage.value = "";
    successMessage.value = "";

    const isValid = validateConfession({
        senderName: senderName.value,
        recipientName: recipientName.value,
        message: message.value,
    });

    if (!isValid) {
        errorMessage.value = "Semua field wajib diisi.";
        return;
    }

    loading.value = true;

    try {
        const cuid = crypto.randomUUID();

        await createConfession({
            cuid,
            senderName: senderName.value.trim(),
            recipientName: recipientName.value.trim(),
            message: message.value.trim(),
        });

        successMessage.value = "Confess berhasil dibuat.";
    } catch (error) {
        console.error(error);
        errorMessage.value = "Gagal membuat confess.";
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <form @submit.prevent="submitConfession">
        <input
            v-model="senderName"
            name="senderName"
            placeholder="Nama kamu"
        />

        <input
            v-model="recipientName"
            name="recipientName"
            placeholder="Nama dia"
        />

        <textarea
            v-model="message"
            name="message"
            placeholder="Tulis confess..."
        />

        <button
            type="submit"
            :disabled="loading"
        >
            {{ loading ? "Mengirim..." : "Kirim Confess" }}
        </button>

        <p v-if="errorMessage">
            {{ errorMessage }}
        </p>

        <p v-if="successMessage">
            {{ successMessage }}
        </p>
    </form>
</template>
