<template>
  <!-- 计分板 -->
  <div class="score-board">
    <div class="space">
      <span>正确单词数量: {{ correctWordsCount }} / {{ totalWordsCount }}</span>
      <span>时间: {{ timeString }}</span>
      <span>Combo: {{ combo }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  totalWordsCount: number,
  correctWordsCount: number,
  // 是否暂停
  paused: boolean,
  // 正确单词连击数
  combo: number
}>()

let timer: number = 0

watch(() => props.paused, paused => {
  if (paused) {
    clearInterval(timer)
  } else {
    timer = setInterval(() => {
      time.value++
    }, 1000)
  }
})

// 时间, 单位秒
const time = ref<number>(0)
// 时间字符串
const timeString = computed(() => {
  const hours = Math.floor(time.value / 3600),
        minutes = Math.floor((time.value % 3600) / 60),
        seconds = time.value % 60
  return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
})

defineExpose({
  time,
  timeString
})
</script>

<style scoped lang="scss">
.score-board {
  padding: 10px;
  background-color: #95e1d3;
  color: #11999e;

  .space {
    display: flex;
    column-gap: 30px;
    padding: 10px 0;
  }
}
</style>
