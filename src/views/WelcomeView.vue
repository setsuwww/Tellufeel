<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import gsap from "gsap";

const card = ref(null);
const title = ref(null);
const description = ref(null);
const actions = ref(null);
const noMessage = ref(null);

function handleNo() {
  const tl = gsap.timeline();

  tl.to(noMessage.value, {
    opacity: 0,
    y: -5,
    duration: 0.15,
  })
    .set(noMessage.value, {
      textContent: "Yah, Masih nunggu / ragu ya?",
    })
    .to(noMessage.value, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: "back.out(1.5)",
    });
}

function handleCardLeave() {
  gsap.to(card.value, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.7,
    ease: "power3.out",
  });
}

onMounted(() => {
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  tl.from(card.value, {
    opacity: 0,
    y: 30,
    duration: 0.7,
  })
    .from(
      title.value,
      {
        opacity: 0,
        y: 15,
        duration: 0.45,
      },
      "-=0.35",
    )
    .from(
      description.value,
      {
        opacity: 0,
        y: 10,
        duration: 0.35,
      },
      "-=0.25",
    )
    .from(
      actions.value,
      {
        opacity: 0,
        y: 10,
        duration: 0.35,
      },
      "-=0.2",
    );
});
</script>

<template>
  <main
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-rose-950 px-5 text-slate-50">
    <!-- Background -->
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/5 blur-3xl" />

      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
    </div>

    <!-- Card -->
    <section ref="card"
      class="relative w-full max-w-lg rounded-md border border-slate-800 bg-slate-900 p-7 shadow-2xl shadow-black/30 sm:p-9"
      style="transform-style: preserve-3d" @mousemove="handleCardMove" @mouseleave="handleCardLeave">
      <!-- Top -->
      <div class="mb-10 flex items-center justify-between">
        <span
          class="rounded-sm border border-pink-500/20 bg-pink-500/5 px-3 py-1 font-sans text-[11px] font-semibold tracking-[0.2em] text-pink-400">
          CONFESS
        </span>

        <span class="font-serif text-2xl text-pink-400/70">
          ♡
        </span>
      </div>

      <!-- Heading -->
      <div ref="title">
        <p class="mb-3 font-sans text-sm font-semibold text-pink-400">
          Harus berani ya ...
        </p>

        <h1 class="font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-5xl">
          Mau kirim
          <span class="text-pink-400">
            Confess?
          </span>
        </h1>
      </div>

      <!-- Description -->
      <p ref="description" class="mt-6 max-w-md font-sans text-sm leading-7 text-slate-400 sm:text-base">
        Kamu orang pertama yang membuka link ini.
        Apakah kamu ingin mengirim Confess ke
        seseorang?
      </p>

      <!-- Actions -->
      <div ref="actions" class="mt-8 grid grid-cols-2 gap-3">
        <button type="button"
          class="rounded-sm border border-slate-700 bg-slate-900 px-5 py-3 font-sans text-sm font-semibold text-slate-300 transition duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 active:scale-[0.98]"
          @click="handleNo">
          Tidak
        </button>

        <RouterLink to="/create" data-cy="create-confession"
          class="rounded-sm bg-pink-500 px-5 py-3 text-center font-sans text-sm font-bold text-white transition duration-200 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30 active:scale-[0.98]">
          Kirim Confess
        </RouterLink>
      </div>

      <!-- No response -->
      <p ref="noMessage" class="mt-5 min-h-5 text-center font-sans text-xs text-slate-500" />
    </section>
  </main>
</template>
