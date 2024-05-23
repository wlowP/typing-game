<template>
  <!-- 打字区 -->
  <div class="type-area" id="aa" @click="focusInput">
    <!-- 因为要在输入的时候屏蔽一些浏览器插件的全局快捷键, 所以借用一下input标签 -->
    <input type="text" class="hidden-input" ref="inputTag" @input="notifyType" @blur="emit('pause')">
    <hr>
    <div class="type" ref="typeDiv">
      <!-- 每个单词占据一个div, 并且每个单词和其中每个字母的key都要是本身加上index, 以防止v-for的时候出现就地更新情况 -->
      <div :class="[`word${index}`]" v-for="(item, index) in words" :key="item + index">
        <span v-for="(letter, i) in item" :key="letter + i"
              :class="[`letter${i}`]">
          {{ letter }}
        </span>
      </div>
    </div>
    <div class="pause-mask" :style="{ opacity: props.paused ? 1 : 0 }">
      <span class="text">{{ placeholder }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  words: string[],
  currentWord: number,
  offset: number,
  paused: boolean,
  placeholder: string
}>()

// 用来屏蔽浏览器插件的全局快捷键的靶子输入框
const inputTag = ref<HTMLInputElement>()
const focusInput = () => {
  emit('resume')
  inputTag.value?.focus()
}

// TypeScript风格的defineEmits
const emit = defineEmits<{
  (e: 'input-letter', key: string): void,
  (e: 'pause'): void,
  (e: 'resume'): void
}>()

const notifyType = (e: Event) => {
  e.preventDefault()
  // 默认类型是Event, 需要强转为InputEvent才能访问data属性
  emit('input-letter', (e as InputEvent).data || '')
}

const typeDiv = ref<HTMLDivElement>()
// 获取当前输入的字母的span元素对象
const getCurrentWordSpan = (currentWord: number, offset: number): HTMLSpanElement => {
  return typeDiv.value?.querySelector(`.word${currentWord} .letter${offset}`) as HTMLElement
}

// 输入正确的字母
const correct = () => {
  getCurrentWordSpan(props.currentWord, props.offset).classList.add('correct')
}

// 输入错误的字母
const wrong = () => {
  getCurrentWordSpan(props.currentWord, props.offset).classList.add('wrong')
}

// 清除正确/错误字母的样式
const clear = () => {
  getCurrentWordSpan(props.currentWord, props.offset - 1).classList.remove('correct', 'wrong')
}

// 调整正确/错误字母样式的方法暴露给父组件调用
defineExpose({
  focusInput,
  correct,
  wrong,
  clear
})
</script>

<style scoped lang="scss">
.type-area {
  position: relative;
  padding: 10px;
  background-color: #393e46;

  .pause-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    backdrop-filter: blur(3px);
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    opacity: 0;

    .text {
      position: absolute;
      font-weight: lighter;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #f0f0f0;
      font-size: 1.2rem;
    }
  }

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

    [class^="word"] {
      color: #a6a6a6;
      animation: word-fadein 0.6s forwards cubic-bezier(0.55, 0, 0.1, 1);

      [class^="letter"] {
        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);

        &.correct {
          color: #00cfd7;
        }

        &.wrong {
          color: #e84545;
        }
      }
    }
  }
}

@keyframes word-fadein {
  0% {
    opacity: 0;
    transform: translateY(-15px);
  }
  100% {
    opacity: 1;
  }
}

@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
