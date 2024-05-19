/// <reference types="vite/client" />

// 环境变量. 设置了共同前缀 TYPE_ , 访问的时候也需要带上前缀
interface ImportMetaEnv {
  readonly TYPE_SUPPORTED_EXTNAMES: string
}



interface ImportMeta {
  readonly env: ImportMetaEnv
}
