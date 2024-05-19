<template>
  <div class="type-area" id="aa">
    打字区
    <hr>
    <div class="type">
      <!-- 每个单词占据一个div -->
      <div :class="[`word${index}`, { active: current === index }]" v-for="(item, index) in words">
        {{ item }}
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'

const current = ref<number>(0)

defineProps<
  { words: string[] }
>()
</script>

<style scoped lang="scss">
.type-area {
  padding: 10px;
  background-color: lightblue;

  .type {
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;
    column-gap: 1rem;
    line-height: 1rem;
    white-space: pre-line; // 合并连续空白字符并保留换行符
    font-size: 1rem;
    // 采用等宽字体
    font-family: Consolas, 'Courier New', Courier, monospace;

    //[class^="word"] {
    //  font-size: 25px;
    //}
  }
}
</style>
