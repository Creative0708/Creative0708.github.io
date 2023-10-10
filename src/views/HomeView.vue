<script setup lang="ts">
import ShaderEffect from '@/components/ShaderEffect.vue';

</script>

<template>
  <div>
    <main class="w-screen h-screen absolute from-base-500 to-base-900 bg-gradient-to-br">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden flex justify-center items-center">
        <svg class="min-w-[max(100vmax,_160vmin)] opacity-10 text-base-100" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <path d="M 128.09192,22.817729 37.114014,75.238818 37.113497,180.18642 128,233.00001 l 90.88845,-52.60379 0.0904,-105.000305 z" fill="currentColor" />
        </svg>
      </div>
      <div class="flex h-full justify-center items-center">
        <p class="text-8xl font-bold font-mono tracking-tighter text-transparent bg-clip-text from-slate-50 to-slate-400 bg-gradient-to-br
          drop-shadow-[0_0px_8px_#fffa]">
          Under Construction
        </p>
      </div>
    </main>

    <ShaderEffect />
  </div>
</template>
