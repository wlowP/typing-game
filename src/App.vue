<template>
  <div class="app">
    <div class="container">
      <Console @load-file="loadFile"
               @update-visible-words-count="changeVisibleWordsCount"
               @update-allow-backspace="allow => allowBackspace = allow"
               @restart="restart"
               @pause="pause"
               @discontinue="discontinue"
      />
      <ScoreBoard :total-words-count="words.length"
                  :paused="paused"
                  :correct-words-count="correctWordsCount"
                  :combo="combo"
                  ref="scoreBoard"
      />
      <TypeArea :words="visibleWords"
                :placeholder="placeholder"
                @input-letter="handleInput"
                @resume="resume"
                @pause="pause"
                :current-word="currentWord"
                :offset="offset"
                :paused="paused"
                ref="typeArea"
      />
      <Statistics :show="showModal"
                  :correct-words-count="correctWordsCount"
                  :total-words-count="words.length"
                  :max-combo="maxCombo"
                  :time-string="(scoreBoard?.timeString || '00 : 00 : 00')"
                  @close="showModal = false"
                  :wrongWords="wrongWords"
      />
    </div>
  </div>
  <!-- 使用teleport组件让光标跟随当前单词 -->
  <Teleport v-if="cursorVisible" :to="`.type .word${currentWord}`">
    <span class="cursor"><span class="line"></span></span>
  </Teleport>
</template>

<script setup lang="ts">
import Console from '@/components/Console.vue'
import TypeArea from '@/components/TypeArea.vue'
import { getMonospaceWidth } from '@/util'
import { computed, nextTick, ref, watch } from 'vue'
import ScoreBoard from '@/components/ScoreBoard.vue'
import Statistics from '@/components/Statistics.vue'

// 所有单词
const words = ref<string[]>([])
// 展示出来的可见单词
const visibleWords = ref<string[]>([])
// 可见单词的数量
const visibleWordsCount = ref<number>(5)
// 所有字母(不含空格)
const letters = ref<string[]>([])
// 每个单词的长度
const lengths = ref<number[]>([])
// 打字区是否显示光标
const cursorVisible = ref<boolean>(false)

// 从Console组件中获取文本内容, 并初始化光标, 可见单词等
const loadFile = (textVal: string) => {
  cursorVisible.value = true
  words.value = textVal.trim().split(/\s+/)
  letters.value = words.value.flatMap(word => word.split(''))
  lengths.value = words.value.map(word => word.length)
  visibleWords.value = words.value.slice(0, visibleWordsCount.value)
  typeArea.value?.focusInput()
  restart()
}

// 打字区暂停时的占位文本
const placeholder = ref<string>('请上传文本文件')
// 是否暂停
const paused = ref<boolean>(true)
// 是否已经完成
const finished = ref<boolean>(false)
// 暂停
const pause = () => {
  if (words.value.length === 0 || finished.value) {
    return
  }
  placeholder.value = '暂停中...点击此处继续'
  paused.value = true
}
// 继续
const resume = () => {
  if (words.value.length === 0 || finished.value) {
    return
  }
  paused.value = false
}
// 中止
const discontinue = () => {
  finished.value = true
  paused.value = true
  showModal.value = true
  placeholder.value = '已结束'
}

// 重新开始
const restart = () => {
  if (words.value.length === 0) {
    return
  }
  paused.value = true
  currentWord.value = 0
  currentLetter.value = 0
  offset.value = 0
  correctWordsCount.value = 0
  cursorVisible.value = false
  finished.value = false
  // 删除所有可见单词
  // 使用异步更新, 删除所有单词, 等视图更新完毕后再设置新的可见单词并聚焦输入框
  visibleWords.value = []
  wrongWords.value = []
  nextTick(() => {
    visibleWords.value = words.value.slice(0, visibleWordsCount.value)
    typeArea.value?.focusInput()
    cursorVisible.value = true
  })
}

// 改变可见单词的数量
const changeVisibleWordsCount = (count: number) => {
  if (count < 1 || currentWord.value + visibleWordsCount.value - 1 >= words.value.length) {
    return
  }
  if (count > visibleWordsCount.value) {
    visibleWords.value.push(...words.value.slice(currentWord.value + visibleWordsCount.value, currentWord.value + count))
  } else if (count < visibleWordsCount.value) {
    visibleWords.value.splice(currentWord.value + count, visibleWordsCount.value - count)
  }
  visibleWordsCount.value = count
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
// 是否允许退格
const allowBackspace = ref<boolean>(true)
// 是否是当前单词的最后一个字母
const isLastLetter = computed(() => offset.value === lengths.value[currentWord.value])
// 当前单词输入是否正确
const currentWordCorrect = ref<boolean>(true)
// 输入正确的单词总数
const correctWordsCount = ref<number>(0)
// 输入错误的单词
const wrongWords = ref<string[]>([])
// 是否正在连击
const isCombo = ref<boolean>(true)
// 正确单词连击数
const combo = ref<number>(0)
// 统计最大连击数
const maxCombo = ref<number>(0)
watch(combo, c => maxCombo.value = Math.max(maxCombo.value, c))

// 移动光标到下一个字母/单词
const next = () => {
  // 当前单词的最后一个字母
  if (isLastLetter.value) {
    currentWord.value++
    offset.value = 0
    // 如果可见单词个数未超出words范围, 则添加下一个可见单词
    if (currentWord.value + visibleWordsCount.value - 1 < words.value.length) {
      visibleWords.value.push(words.value[currentWord.value + visibleWordsCount.value - 1])
    }
    return
  }
  currentLetter.value++
  offset.value++
}

// 移动光标到上一个字母
const previous = () => {
  if (offset.value === 0) {
    return
  }
  typeArea.value?.clear()
  currentLetter.value--
  offset.value--
}

const typeArea = ref<InstanceType<typeof TypeArea>>()
const scoreBoard = ref<InstanceType<typeof ScoreBoard>>()
const showModal = ref<boolean>(false)
const handleInput = (key: string) => {
  if (finished.value) {
    return
  }
  // 在不使用中文输入法或者类似的输入法的情况下, key为空字符串时表示输入退格键
  if (key == '' && allowBackspace.value) {
    previous()
    return
  }
  // 当前单词的最后一个字母
  if (isLastLetter.value) {
    // 最后一个单词
    if (currentWord.value === words.value.length - 1) {
      checkCorrect()
      discontinue()
      return
    }
    // 对单词之间空格做特殊处理
    // 空格没有错误情况, 遇到空格时只能输入空格. 防止不停输入其他字符导致正确率无限下降
    if (key === ' ') {
      checkCorrect()
      next()
    }
    return
  }
  // 输入正确
  if (key === letters.value[currentLetter.value]) {
    typeArea.value?.correct()
  } else {
    // 输入错误
    typeArea.value?.wrong()
    currentWordCorrect.value = false
    isCombo.value = false
  }
  next()
}
// 统计正确单词的数量
const checkCorrect = () => {
  if (currentWordCorrect.value) {
    correctWordsCount.value++
    // 统计连击次数
    if (isCombo.value) {
      combo.value++
    } else {
      isCombo.value = true
      combo.value = 1
    }
  } else {
    // 统计输入的错误单词
    wrongWords.value.push(words.value[currentWord.value])
  }
  currentWordCorrect.value = true
}
</script>

<style scoped>
.app {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;

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
