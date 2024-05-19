<template>
  <div class="app">
    <div class="container">
      <Console @load-file="loadFile"/>
      <TypeArea :words="words"/>
      <button @click="next">下一个</button>
    </div>
  </div>

  <Teleport v-if="flag" :to="`.type .word${currentWord}`">
    <span class="cursor"><span class="line"></span></span>
  </Teleport>
</template>

<script setup lang="ts">
import Console from '@/components/Console.vue'
import TypeArea from '@/components/TypeArea.vue'
import { getMonospaceWidth } from '@/util'
import { computed, ref } from 'vue'

const text = ref<string>('')
const words = ref<string[]>([])
const lengths = ref<number[]>([])

// 打字区是否显示光标
const flag = ref<boolean>(false)

const loadFile = (textVal: string) => {
  flag.value = true
  text.value = textVal
  words.value = textVal.split(/\s+/)
  lengths.value = words.value.map(word => word.length)
  console.log('lengths = ', lengths.value)
}

const fontWidth = getMonospaceWidth(28)
// 当前输入到第几个单词
const currentWord = ref<number>(0)
// 当前输入到第几个字母
const offset = ref<number>(0)
// 光标的偏移量
const offsetWidth = computed(() => -(fontWidth * (lengths.value[currentWord.value] - offset.value)))
const next = () => {
  if (offset.value === lengths.value[currentWord.value]) {
    currentWord.value++
    offset.value = 0
    return
  }
  offset.value++
  console.log(fontWidth)
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
      width: 1rem;
      height: 100%;
      background: red;
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
