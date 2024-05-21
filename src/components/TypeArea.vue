<template>
  <div class="type-area" id="aa" @click="inputTag?.focus()">
    打字区
    <!-- 因为要在输入的时候屏蔽一些浏览器插件的全局快捷键, 所以借用一下input标签 -->
    <input type="text" class="hidden-input" ref="inputTag" @input="notifyType">
    <hr>
    <div class="type" ref="typeDiv">
      <!-- 每个单词占据一个div -->
      <div :class="[`word${index}`]" v-for="(item, index) in words">
        <span v-for="(letter, i) in item" :key="i"
              :class="[`letter${i}`]">
          {{ letter }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  words: string[]
}>()

// 用来屏蔽浏览器插件的全局快捷键的靶子输入框
const inputTag = ref<HTMLInputElement>()

// TypeScript风格的defineEmits
const emit = defineEmits<{
  (e: 'input-letter', key: string): void
}>()

const notifyType = (e: Event) => {
  e.preventDefault()
  // 默认类型是Event, 需要强转为InputEvent才能访问data属性
  emit('input-letter', (e as InputEvent).data || '')
}

const typeDiv = ref<HTMLDivElement>()

const correct = (currentWord: number, offset: number) => {
  typeDiv.value?.querySelector(`.word${currentWord} .letter${offset}`)?.classList.add('correct')
}

defineExpose({
  correct
})
</script>

<style scoped lang="scss">
.type-area {
  padding: 10px;
  background-color: #393e46;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;

  .hidden-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

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
    [class^="word"] {
      color: #a6a6a6;

      [class^="letter"] {
        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);

        &.correct {
          color: #00cfd7;
        }
      }
    }
  }
}
</style>
