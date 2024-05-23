<template>
  <!-- 控制台 -->
  <div class="console">
    <div class="space">
      <button @click="inputFile">上传文本</button>
      <span>
        <span>可见单词数量：</span>
        <input type="number"
               :value="5"
               style="width: 50px;"
               @input="changeVisibleNumber"
               min="1"
        >
      </span>
      <span>
        <span><label for="allow-bs">允许退格</label></span>
        <input type="checkbox"
               id="allow-bs"
               @input="changeAllowBackspace"
               checked
        >
      </span>
      <button @click="emit('pause')">暂停</button>
      <button @click="emit('restart')">重新开始</button>
      <button @click="emit('discontinue')">中止</button>
      <!-- 隐藏的文件上传标签 -->
      <input
        style="display: none"
        ref="fileInput"
        type="file"
        name="text"
        id="text"
        @change="handleFile"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement>()

const inputFile = () => {
  fileInput.value?.click()
}

const handleFile = async () => {
  const file = fileInput.value?.files?.[0]
  if (!file) return
  // 获取并判断文件扩展名
  const ext = file.name.substring(file.name.lastIndexOf('.') + 1)
  if (!import.meta.env.TYPE_SUPPORTED_EXTNAMES.includes(ext)) {
    console.error('仅支持以下文件类型：', import.meta.env.TYPE_SUPPORTED_EXTNAMES)
    return
  }
  // 直接调用text()方法获取文件内容
  const text = await file.text()
  emit('load-file', text)
}

const changeVisibleNumber = (e: Event) => {
  emit('update-visible-words-count', (e.target as HTMLInputElement).valueAsNumber)
}

const changeAllowBackspace = (e: Event) => {
  emit('update-allow-backspace', (e.target as HTMLInputElement).checked)
}

const emit = defineEmits<{
  (e: 'load-file', text: string): void,
  (e: 'update-visible-words-count', count: number): void,
  (e: 'update-allow-backspace', allow: boolean): void,
  (e: 'restart'): void,
  (e: 'pause'): void,
  (e: 'discontinue'): void
}>()
</script>

<style lang="scss" scoped>
.console {
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
