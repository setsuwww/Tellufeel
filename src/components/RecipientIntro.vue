<script setup>
import { onMounted, ref } from "vue";
import gsap from "gsap";

const emit = defineEmits(["complete"]);

const heart = ref(null);
const eyebrow = ref(null);
const title = ref(null);
const description = ref(null);

onMounted(() => {
    const tl = gsap.timeline();

    gsap.set(
        [
            eyebrow.value,
            title.value,
            description.value,
        ],
        {
            opacity: 0,
            y: 20,
        },
    );

    tl.fromTo(
        heart.value,
        {
            scale: 0,
            rotation: -25,
            opacity: 0,
        },
        {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
        },
    )
        .to(heart.value, {
            y: -8,
            rotation: 5,
            duration: 0.35,
            ease: "power2.out",
        })
        .to(heart.value, {
            y: 0,
            rotation: 0,
            duration: 0.35,
            ease: "power2.inOut",
        })
        .to(
            eyebrow.value,
            {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: "power2.out",
            },
            "-=0.2",
        )
        .to(
            title.value,
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
            },
            "-=0.2",
        )
        .to(
            description.value,
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
            },
            "-=0.25",
        )
        .to({}, {
            duration: 1.5,
        })
        .to(
            [
                heart.value,
                eyebrow.value,
                title.value,
                description.value,
            ],
            {
                opacity: 0,
                y: -15,
                duration: 0.5,
                stagger: 0.05,
                ease: "power2.in",
            },
        )
        .call(() => {
            emit("complete");
        });
});
</script>

<template>
  <section class="flex min-h-screen items-center justify-center px-5 text-center">
    <div class="w-full max-w-2xl">
      <!-- Heart -->
      <div
        ref="heart"
        class="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-pink-500/20 bg-pink-500/10 shadow-xl shadow-pink-500/10"
      >
        <span class="font-serif text-5xl text-pink-400">
          ♡
        </span>
      </div>

      <!-- Eyebrow -->
      <p
        ref="eyebrow"
        class="font-sans text-xs font-bold tracking-[0.22em] text-pink-400"
      >
        ADA SESUATU UNTUK KAMU
      </p>

      <!-- Title -->
      <h1
        ref="title"
        class="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl"
      >
        Ada seseorang
        <br>

        yang kirim kamu
        <span class="text-pink-400">
          pesan.
        </span>
      </h1>

      <!-- Description -->
      <p
        ref="description"
        class="mx-auto mt-6 max-w-md font-sans text-sm leading-7 text-slate-500"
      >
        Mungkin sederhana.
        <br>
        Tapi mungkin berarti buat seseorang.
      </p>
    </div>
  </section>
</template>
