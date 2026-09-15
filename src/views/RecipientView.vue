<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { getConfession } from "@/services/recipient.service";
import { respondConfession } from "@/services/response.service";

const route = useRoute();

const confession = ref(null);

const loading = ref(true);
const submitting = ref(false);

const error = ref("");
const success = ref("");

const showReasonForm = ref(false);
const reason = ref("");

const cuid = route.params.cuid;
const token = route.query.token;

async function loadConfession() {
    loading.value = true;
    error.value = "";

    try {
        if (
            typeof cuid !== "string" ||
            typeof token !== "string"
        ) {
            throw new Error(
                "Link confess tidak valid.",
            );
        }

        confession.value = await getConfession({
            cuid,
            token,
        });
    } catch (err) {
        console.error(err);

        error.value =
            err.message ||
            "Gagal mengambil confess.";
    } finally {
        loading.value = false;
    }
}

async function handleResponse(response) {
    if (response === "NGGA_MAU") {
        showReasonForm.value = true;
        success.value = "";
        return;
    }

    await submitResponse("MAU");
}

async function submitResponse(response) {
    submitting.value = true;
    error.value = "";

    try {
        await respondConfession({
            cuid,
            token,
            response,
            reason:
                response === "NGGA_MAU"
                    ? reason.value.trim()
                    : null,
        });

        success.value =
            response === "MAU"
                ? "Jawaban kamu sudah dikirim."
                : "Jawaban dan alasan kamu sudah dikirim.";

        showReasonForm.value = false;
    } catch (err) {
        console.error(err);

        error.value =
            err.message ||
            "Gagal mengirim jawaban.";
    } finally {
        submitting.value = false;
    }
}

async function handleReject() {
    if (!reason.value.trim()) {
        error.value =
            "Alasan wajib diisi.";

        return;
    }

    await submitResponse("NGGA_MAU");
}

onMounted(() => {
    loadConfession();
});
</script>

<template>
    <main>
        <div v-if="loading">
            Membuka kotak surat...
        </div>

        <div v-else-if="error && !confession">
            <h1>Confess tidak ditemukan</h1>

            <p>
                {{ error }}
            </p>
        </div>

        <div v-else-if="confession">
            <p>
                Dari:
                {{ confession.senderName }}
            </p>

            <p>
                Untuk:
                {{ confession.recipientName }}
            </p>

            <p>
                {{ confession.message }}
            </p>

            <div v-if="!success">
                <button
                    type="button"
                    :disabled="submitting"
                    @click="handleResponse('MAU')"
                >
                    Mau
                </button>

                <button
                    type="button"
                    :disabled="submitting"
                    @click="handleResponse('NGGA_MAU')"
                >
                    Ngga Mau
                </button>
            </div>

            <form
                v-if="showReasonForm && !success"
                @submit.prevent="handleReject"
            >
                <textarea
                    v-model="reason"
                    placeholder="Kenapa?"
                    :disabled="submitting"
                />

                <button
                    type="submit"
                    :disabled="submitting"
                >
                    Kirim alasan
                </button>
            </form>

            <p v-if="error">
                {{ error }}
            </p>

            <p v-if="success">
                {{ success }}
            </p>
        </div>
    </main>
</template>
