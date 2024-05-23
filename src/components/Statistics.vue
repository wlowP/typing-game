<template>
  <!-- 结束后的统计面板 -->
  <div class="statistics">
    <div>正确单词数量: {{ correctWordsCount }} / {{ totalWordsCount }}</div>
    <div>正确率: {{ (correctWordsCount / totalWordsCount * 100).toFixed(2) }}%</div>
    <div>时间: {{ timeString }}</div>
    <div>最大连击数: {{ maxCombo }}</div>
    <div class="wrong-words">
      错误单词:
      <ul class="list">
        <li>{{ wrongWords.length }} / {{ totalWordsCount }}</li>
        <li v-for="word in wrongWords" :key="word">{{ word }}</li>
      </ul>
    </div>
    <button style="padding: 15px 25px; font-size: 20px"
            @click="emit('close')"
    >确定
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  show: boolean,
  correctWordsCount: number,
  totalWordsCount: number,
  maxCombo: number,
  timeString: string,
  wrongWords: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const showModal = computed(() => props.show ? 'flex' : 'none')

</script>

<style scoped lang="scss">
.statistics {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: v-bind(showModal);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  font-weight: bold;
  z-index: 100;

  // 限制最大尺寸, overflow为auto时超出部分可滚动
  .wrong-words {
    display: flex;
    align-items: center;
    align-content: center;

    .list {
      font-size: 16px;
      line-height: 20px;
      max-width: 40vw;
      max-height: 30vh;
      overflow: auto;
    }
  }
}
</style>
