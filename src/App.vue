<template>
  <div class="app">
    <div class="container">
      <Console @load-file="loadFile"/>
      <TypeArea :words="words"
                @input-letter="handleInput"
                ref="typeArea"
      />
    </div>
  </div>

  <!-- 使用teleport组件让光标跟随当前单词 -->
  <Teleport v-if="flag" :to="`.type .word${currentWord}`">
    <span class="cursor"><span class="line"></span></span>
  </Teleport>
</template>

<script setup lang="ts">
import Console from '@/components/Console.vue'
import TypeArea from '@/components/TypeArea.vue'
import { getMonospaceWidth } from '@/util'
import { computed, ref } from 'vue'

// 文本内容
const text = ref<string>('')
// 所有单词
const words = ref<string[]>([])
// 所有字母(不含空格)
const letters = ref<string[]>([])
// 每个单词的长度
const lengths = ref<number[]>([])
// 打字区是否显示光标
const flag = ref<boolean>(false)

const loadFile = (textVal: string) => {
  flag.value = true
  text.value = textVal.trim()
  words.value = textVal.split(/\s+/)
  letters.value = words.value.flatMap(word => word.split(''))
  lengths.value = words.value.map(word => word.length)
}

// 获取等宽字体的实际宽度
const fontWidth = getMonospaceWidth(28)
// 当前输入到第几个单词
const currentWord = ref<number>(0)
// 当前输入到第几个字母
const currentLetter = ref<number>(0)
// 当前输入到words[currentWord]的第几个字母
const offset = ref<number>(0)
// 光标的偏移量
const offsetWidth = computed(() => -(fontWidth * (lengths.value[currentWord.value] - offset.value)))

const typeArea = ref<InstanceType<typeof TypeArea>>()
const next = () => {
  // 当前单词的最后一个字母
  if (offset.value === lengths.value[currentWord.value]) {
    // 最后一个单词
    if (currentWord.value === words.value.length - 1) {
      return
    }
    currentWord.value++
    offset.value = 0
    return
  }
  currentLetter.value++
  offset.value++
  console.log('currentWord = ', currentWord.value, 'currentLetter = ', currentLetter.value, 'offset = ', offset.value)
}

const handleInput = (key: string) => {
  // console.log('key = ', key)
  // console.log('currentLetter = ', letters.value[currentLetter.value])
  // 对单词之间空格做特殊处理
  if (offset.value === lengths.value[currentWord.value]) {
    if (key === ' ') {
      next()
    }
    return
  }
  if (key === letters.value[currentLetter.value]) {
    typeArea.value?.correct(currentWord.value, offset.value)
    next()
  }
}
</script>

<style scoped>
.app {
  .container {
    display: flex;
    width: 85vw;
    margin: 0 auto;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    background-color: lightgray;
    border: 1px solid black;
    border-radius: 15px;
  }

  .cursor {
    width: 0;
    overflow: visible;
    position: relative;

    .line {
      position: absolute;
      width: 3px;
      height: 100%;
      background: yellow;
      left: 0;
      top: 50%;
      transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
      transform: translate(v-bind(offsetWidth + 'px'), -50%);
      animation: cursor-blinks 1s infinite;
    }
  }
}
@keyframes cursor-blinks {
  0% {
    opacity: 1;
    display: block;
  }
  50% {
    opacity: 0;
    display: none;
  }
  100% {
    opacity: 1;
    display: block;
  }
}
</style>
