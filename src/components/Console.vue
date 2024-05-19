<template>
  <div class="console">
    控制台
    <button @click="inputFile">上传文本</button>
    <input
      style="display: none"
      ref="fileInput"
      type="file"
      name="text"
      id="text"
      @change="handleFile"
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>()

const inputFile = () => {
  fileInput.value?.click()
}

const handleFile = async () => {
  const file = fileInput.value?.files?.[0]
  if (!file) return
  // 获取并判断文件扩展名
  const ext = file.name.substring(file.name.lastIndexOf('.') + 1)
  console.log('ext = ', ext)
  if (!import.meta.env.TYPE_SUPPORTED_EXTNAMES.includes(ext)) {
    console.error('仅支持以下文件类型：', import.meta.env.TYPE_SUPPORTED_EXTNAMES)
    return
  }
  // 直接调用text()方法获取文件内容
  const text = await file.text()
  // 获取单词数组
  // const words = text.split(/\s+/)
  // console.log('words = ', words)
  emit('load-file', text)
}

const emit = defineEmits(['load-file'])
</script>

<style lang="scss" scoped>
.console {
  padding: 10px;
  background-color: hotpink;
}
</style>
