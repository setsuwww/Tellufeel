<script setup>
import { onMounted, ref } from "vue";
import gsap from "gsap";

const heart = ref(null);

onMounted(() => {
    gsap.to(heart.value, {
        scale: 1.12,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
    });
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <div
        ref="heart"
        class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/10"
      >
        <span class="font-serif text-3xl text-pink-400">
          ♡
        </span>
      </div>

      <p class="mt-5 font-sans text-sm text-slate-500">
        Membuka sesuatu...
      </p>
    </div>
  </div>
</template>
