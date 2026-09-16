<script setup>
import { onMounted, ref } from "vue";
import gsap from "gsap";

import { getMyConfessionsWithResponses } from "@/services/dashboard.service";
import {
    getConfessionResponse,
    getConfessionStatus,
} from "@/utils/confession";

const confessions = ref([]);
const loading = ref(true);
const error = ref("");

const dashboard = ref(null);

async function loadDashboard() {
    loading.value = true;
    error.value = "";

    try {
        confessions.value =
            await getMyConfessionsWithResponses();

        await new Promise((resolve) =>
            requestAnimationFrame(resolve),
        );

        gsap.fromTo(
            dashboard.value,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        );
    } catch (err) {
        console.error(err);

        error.value =
            "Gagal memuat confession.";
    } finally {
        loading.value = false;
    }
}

function getStatusClass(status) {
    if (status === "MAU") {
        return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (status === "NGGA_MAU") {
        return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
}
onMounted(loadDashboard);
</script>

<template>
  <main class="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-50 sm:px-6 sm:py-12">
    <!-- Background -->
    <div class="pointer-events-none fixed inset-0">
      <div class="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-pink-500/5 blur-3xl" />

      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:36px_36px]"
      />
    </div>

    <div
      ref="dashboard"
      class="relative mx-auto w-full max-w-4xl"
    >
      <!-- Header -->
      <header class="mb-8 sm:mb-10">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="font-sans text-xs font-bold tracking-[0.2em] text-pink-400">
              YOUR CONFESSIONS
            </p>

            <h1 class="mt-2 font-serif text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
              Dashboard
            </h1>

            <p class="mt-3 max-w-lg font-sans text-sm leading-6 text-slate-500">
              Lihat confession yang kamu kirim
              dan jawaban yang kamu terima.
            </p>
          </div>

          <div
            v-if="!loading && !error"
            class="w-fit rounded-sm border border-slate-800 bg-slate-900 px-4 py-2"
          >
            <p class="font-sans text-xs text-slate-600">
              Total confession
            </p>

            <p class="mt-0.5 font-sans text-lg font-bold text-slate-200">
              {{ confessions.length }}
            </p>
          </div>
        </div>
      </header>

      <!-- Loading -->
      <div
        v-if="loading"
        class="rounded-md border border-slate-800 bg-slate-900 p-8 text-center"
      >
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/10">
          <span class="font-serif text-2xl text-pink-400">
            ♡
          </span>
        </div>

        <p class="mt-4 font-sans text-sm text-slate-500">
          Memuat confession...
        </p>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="rounded-md border border-pink-900/50 bg-pink-950/20 p-6"
      >
        <div class="flex items-start gap-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500/10">
            <span class="font-serif text-xl text-pink-400">
              !
            </span>
          </div>

          <div>
            <p class="font-sans text-sm font-semibold text-pink-300">
              Terjadi kesalahan
            </p>

            <p class="mt-1 font-sans text-sm leading-6 text-pink-200/60">
              {{ error }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="confessions.length === 0"
        class="rounded-md border border-slate-800 bg-slate-900 p-8 text-center sm:p-12"
      >
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-pink-500/20 bg-pink-500/10"
        >
          <span class="font-serif text-3xl text-pink-400">
            ♡
          </span>
        </div>

        <h2 class="mt-6 font-serif text-2xl font-semibold text-slate-100">
          Belum ada confession
        </h2>

        <p class="mx-auto mt-2 max-w-sm font-sans text-sm leading-6 text-slate-500">
          Buat confession pertama kamu
          untuk mendapatkan link dan
          menunggu jawabannya.
        </p>
      </div>

      <!-- Confessions -->
      <section
        v-else
        class="space-y-5"
      >
        <article
          v-for="confession in confessions"
          :key="confession.id"
          class="group rounded-md border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10 transition duration-300 hover:border-slate-700 hover:shadow-black/20 sm:p-7"
        >
          <!-- Card Header -->
          <div
            class="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between"
          >
            <div class="min-w-0">
              <p class="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                Dari
              </p>

              <h2 class="mt-1 break-words font-serif text-xl font-semibold text-slate-100">
                {{ confession.sender_name }}
              </h2>

              <p class="mt-2 font-sans text-sm text-slate-500">
                Untuk
                <span class="font-semibold text-slate-300">
                  {{ confession.recipient_name }}
                </span>
              </p>
            </div>

            <!-- Status -->
            <span
              class="w-fit shrink-0 rounded-sm border px-3 py-1.5 font-sans text-[11px] font-bold tracking-[0.12em]"
              :class="getStatusClass(
                getConfessionStatus(
                  confession,
                ),
              )
              "
            >
              {{ getConfessionStatus(confession) === "NGGA_MAU" ? "NGGA MAU" :
                getConfessionStatus(confession) }}
            </span>
          </div>

          <!-- Message -->
          <div class="mt-6 rounded-sm border border-slate-800 bg-slate-950/60 p-5 sm:p-6">
            <p
              class="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-300 sm:text-base"
            >
              {{ confession.message }}
            </p>
          </div>

          <!-- Response -->
          <div
            v-if="
              getConfessionResponse(
                confession,
              )
            "
            class="mt-5 rounded-sm border border-pink-500/10 bg-pink-500/5 p-5"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500/10"
              >
                <span class="font-serif text-xl text-pink-400">
                  ♡
                </span>
              </div>

              <div>
                <p
                  class="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600"
                >
                  Jawaban
                </p>

                <p class="mt-0.5 font-sans text-sm font-bold text-pink-300">
                  {{
                    getConfessionResponse(
                      confession,
                    ).response
                  }}
                </p>
              </div>
            </div>

            <!-- Reason -->
            <div
              v-if="
                getConfessionResponse(
                  confession,
                ).reason
              "
              class="mt-4 border-t border-pink-500/10 pt-4"
            >
              <p class="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                Alasan
              </p>

              <p class="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-slate-400">
                {{
                  getConfessionResponse(
                    confession,
                  ).reason
                }}
              </p>
            </div>
          </div>

          <!-- Pending -->
          <div
            v-else
            class="mt-5 flex items-center gap-3 border-t border-slate-800 pt-5"
          >
            <div class="h-2 w-2 rounded-full bg-yellow-500/70" />

            <p class="font-sans text-sm text-slate-600">
              Belum ada jawaban dari
              penerima.
            </p>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>
