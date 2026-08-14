<template>
  <div class="typing-training-container">
    <div class="bar">
      <div class="stats-group">
        <div class="info">
          <div class="tag">模式：{{ type }}</div>
          <div class="tag">文章：{{ articleTitle }}</div>
          <div class="tag">字数：{{ articleContent.length }}</div>
        </div>
        <div class="status">
          <div class="stat-item"><span class="label">速度</span><span class="value">{{ speed }}<small>字/分</small></span></div>
          <div class="stat-item"><span class="label">正确率</span><span class="value">{{ accuracy }}%</span></div>
          <div class="stat-item"><span class="label">用时</span><span class="value">{{ Math.floor(timeCost / 60).toString().padStart(2, '0') }}:{{ (timeCost % 60).toString().padStart(2, '0') }}</span></div>
          <div class="stat-item"><span class="label">进度</span><span class="value">{{ progress }}%</span></div>
          <div class="stat-item"><span class="label">退格</span><span class="value">{{ backspaceCount }}</span></div>
        </div>
      </div>
      <div class="btns">
        <button class="btn-icon" @click="handleLargerFont" title="放大字体">A+</button>
        <button class="btn-icon" @click="handleSmallerFont" title="缩小字体">A-</button>
        <div class="divider"></div>
        <button class="btn-secondary" @click="handleReset">重置</button>
        <button class="btn-primary" @click="handleFinish">结束</button>
      </div>
    </div>
    <div class="main" :style="{ fontSize: fontSize + 'px' }">
      <div class="line line-measure" v-if="false">
        <div class="original">
          <span v-for="(char, charIndex) in articleTitle.split('')" :key="charIndex">
            {{ char }}
          </span>
        </div>
      </div>
      <div class="line" v-for="(text, textIndex) in slicedContent" :key="textIndex">
        <div class="original" ref="textContainer">
          <span v-for="(char, charIndex) in text.split('')" :key="charIndex" :style="{ color: getColor(textIndex, charIndex) }">{{ char }}</span>
        </div>
        <div class="input">
          <input
            type="text"
            :maxlength="text.length"
            :style="{ height: containerHeight + 'px', fontSize: fontSize + 'px' }"
            :disabled="textIndex !== activeLineIndex"
            v-model="inputValue[textIndex]"
            @keydown="handleKeyDown($event, textIndex)"
            @input="handleInput($event, textIndex)"
            @compositionstart="handleCompositionStart(textIndex)"
            @compositionend="handleCompositionEnd($event, textIndex)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useResizeObserver } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import cnArticleData from '../data/cn_articles.json'

const router = useRouter()
const route = useRoute()
const type = route.query.type as string
const articleId = route.query.article as string
const textContainer = ref<HTMLElement | null>(null)
const containerWidth = ref<number>(0)
const containerHeight = ref<number>(0)
const fontSize = ref<number>(24)
const inputValue = ref<Array<string>>([])
const backspaceCount = ref<number>(0)
const speed = ref<number>(0)
const timeCost = ref<number>(0)
const startInput = ref<boolean>(false)

// 计算正确输入的字符数
const correctCount: ComputedRef<number> = computed(() => {
  let count = 0
  for (let i = 0; i < slicedContent.value.length; i++) {
    const input = inputValue.value[i] || ''
    const original = slicedContent.value[i] || ''
    for (let j = 0; j < input.length; j++) {
      if (input[j] === original[j]) {
        count++
      }
    }
  }
  return count
})

// 计算错误输入的字符数
const errorCount: ComputedRef<number> = computed(() => {
  return totalTypedCount.value - correctCount.value
})

// 计算已输入的总字符数
const totalTypedCount: ComputedRef<number> = computed(() => {
  return inputValue.value.reduce((sum, input) => sum + input.length, 0)
})
// 计算输入正确率
const accuracy = computed(() => {
  if (totalTypedCount.value === 0) return 0
  return parseFloat(((correctCount.value / totalTypedCount.value) * 100).toFixed(1))
})

// 计算进度
const progress = computed(() => {
  if (articleContent.length === 0) return 0
  return parseFloat(((totalTypedCount.value / articleContent.length) * 100).toFixed(1))
})

const article = computed(() => {
  const cnArticles = ref(cnArticleData.data)
  return cnArticles.value.find((article) => article.id === articleId)
})

const articleTitle = computed(() => {
  return article.value?.title || ''
})

const articleContent = article.value?.content || ''

const handleFinish = () => {
  router.push({
    name: 'Report',
    query: {
      type: type,
      articleId: articleId,
      articleTitle: articleTitle.value,
      timeCost: timeCost.value,
      speed: speed.value,
      accuracy: accuracy.value,
      backspaceCount: backspaceCount.value,
    },
  })
}

// 重置练习
const handleReset = () => {
  inputValue.value = []
  backspaceCount.value = 0
  speed.value = 0
  timeCost.value = 0
  startInput.value = false
  if (timer) clearTimeout(timer)
  if (speedTimer) clearTimeout(speedTimer)
  timer = null
  speedTimer = null
}

// 调整字体大小
const handleLargerFont = () => {
  if (fontSize.value < 32) {
    fontSize.value += 4
  }
}

const handleSmallerFont = () => {
  if (fontSize.value > 12) {
    fontSize.value -= 4
  }
}

// 定时器
let timer: number | null = null
let speedTimer: number | null = null

const startTimer = () => {
  if (timer) clearTimeout(timer)

  timer = setTimeout(() => {
    timeCost.value += 1
    startTimer()
  }, 1000)
}

const startSpeedTimer = () => {
  if (speedTimer) clearTimeout(speedTimer)

  speedTimer = setTimeout(() => {
    speed.value = Math.round((correctCount.value / timeCost.value) * 60)
    startSpeedTimer()
  }, 3000)
}

// 监听容器宽度变化
useResizeObserver(textContainer, (entries) => {
  containerWidth.value = entries[0]!.contentRect.width
  containerHeight.value = entries[0]!.contentRect.height
})

// 文章总字数
const wordCount: number = articleContent.length

// 计算单行可容纳的字符数
const estimatedChars: ComputedRef<number> = computed(() => {
  if (!containerWidth.value) return 1

  return Math.max(1, Math.floor(containerWidth.value / fontSize.value))
})

// 计算行数
const rowCount: ComputedRef<number> = computed(() => {
  if (!containerWidth.value) return 0

  return Math.ceil(wordCount / estimatedChars.value)
})

// 当容器宽度变化时，重新分配已经输入的内容
watch([estimatedChars, rowCount], ([newEstimatedChars, newRowCount], [oldEstimatedChars, oldRowCount]) => {
  if (!containerWidth.value) return

  const inputValueLength = inputValue.value.length
  let aggregate = ''
  for (let i = 0; i < inputValueLength; i++) {
    if (inputValue.value[i] && inputValue.value[i]!.length == oldEstimatedChars) {
      aggregate += inputValue.value[i]!
    }
    else if (inputValue.value[i]) {
      aggregate += inputValue.value[i]!
      break
    }
  }
  const rowCount = Math.ceil(aggregate.length / newEstimatedChars)
  inputValue.value = []
  for (let i = 0; i < rowCount; i++) {
    inputValue.value[i] = aggregate.slice(i * newEstimatedChars, (i + 1) * newEstimatedChars)
  }
})

// 根据容器宽度动态截取文本
const slicedContent: ComputedRef<Array<string>> = computed(() => {
  if (wordCount <= estimatedChars.value) {
    return [articleContent]
  }

  let result: Array<string> = []
  for (let i = 0; i < wordCount; i += estimatedChars.value) {
    const slice = articleContent.slice(i, i + estimatedChars.value)
    result.push(slice)
  }

  return result
})

// 计算当前正在输入的行数
const activeLineIndex: ComputedRef<number> = computed(() => {
  for (let i = 0; i < slicedContent.value.length; i++) {
    const inputLen = inputValue.value[i]?.length || 0
    const targetLen = slicedContent.value[i]?.length || 0
    if (inputLen < targetLen) {
      return i
    }
  }
  return slicedContent.value.length > 0 ? slicedContent.value.length - 1 : 0
})

const isComposing = ref<boolean>(false)

// 处理输入法组合事件
let originalLength = 0
const handleCompositionStart = (textIndex: number) => {
  isComposing.value = true
  // 记录输入法开始时的输入长度
  originalLength = inputValue.value[textIndex]?.length || 0
  if (!startInput.value) {
    startInput.value = true
    startTimer() // 开始定时器
    startSpeedTimer()
  }
}
const handleCompositionEnd = (event: CompositionEvent, textIndex: number) => {
  isComposing.value = false
  const finalText = event.data
  if (originalLength + finalText.length > slicedContent.value[textIndex]!.length && textIndex + 1 < slicedContent.value.length) {
    inputValue.value[textIndex + 1] = finalText.slice(slicedContent.value[textIndex]!.length - originalLength)
  }
  handleInput(event, textIndex)
}
const handleInput = (event: Event, textIndex: number) => {
  if (isComposing.value) return

  if (!startInput.value) {
    startInput.value = true
    startTimer() // 开始定时器
    startSpeedTimer()
  }

  const target = event.target as HTMLInputElement
  inputValue.value[textIndex] = target.value

  // 如果输入完成，自动跳转到下一行
  if (target.value.length === slicedContent.value[textIndex]!.length) {
    setTimeout(() => {
      const nextInput = document.querySelectorAll('.input input')[textIndex + 1] as HTMLInputElement
      if (nextInput) {
        nextInput.focus()
      }
    }, 0)
  }
}

// 处理退格键事件
const handleKeyDown = (event: KeyboardEvent, textIndex: number) => {
  // 如果按下退格键，并且当前行的输入不为空，增加退格计数
  if (event.key === 'Backspace' && !(inputValue.value[textIndex] === '' || inputValue.value[textIndex] === undefined)) {
    backspaceCount.value += 1
  }
  // 如果按下退格键，并且当前行的输入为空，退回到上一行
  if (event.key === 'Backspace' && (inputValue.value[textIndex] === '' || inputValue.value[textIndex] === undefined)) {
    if (textIndex === 0) return

    backspaceCount.value += 1
    // 删掉上一行的最后一个字符，使上一行重新变为被激活的“当前行”
    inputValue.value[textIndex - 1] = inputValue.value[textIndex - 1]!.slice(0, -1)
    setTimeout(() => {
      const previousInput = document.querySelectorAll('.input input')[textIndex - 1] as HTMLInputElement
      if (previousInput) {
        previousInput.focus()
      }
    }, 0)
  }
}

// 获取字符颜色
const getColor = (textIndex: number, charIndex: number): string => {
  const input = inputValue.value[textIndex] || ''
  const originalChar = slicedContent.value[textIndex]![charIndex]
  const inputChar = input[charIndex]

  if (inputChar === undefined) {
    return '#000' // 默认颜色
  } else if (inputChar === originalChar) {
    return 'green' // 正确输入
  } else {
    return 'red' // 错误输入
  }
}

</script>

<style scoped lang="scss">
.typing-training-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .bar {
    background-color: #ffffff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 40px;
    z-index: 10;
    flex-wrap: wrap;
    gap: 16px;

    .stats-group {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .info {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        .tag {
          font-size: 13px;
          color: #666;
          background-color: #f4f6f8;
          padding: 4px 10px;
          border-radius: 6px;
        }
      }

      .status {
        display: flex;
        flex-wrap: wrap;
        gap: 32px;
        .stat-item {
          display: flex;
          align-items: baseline;
          gap: 6px;

          .label {
            font-size: 14px;
            color: #888;
          }

          .value {
            font-size: 22px;
            font-weight: bold;
            color: #0b2b40;

            small {
              font-size: 12px;
              font-weight: normal;
              margin-left: 2px;
            }
          }
        }
      }
    }

    .btns {
      display: flex;
      align-items: center;
      gap: 12px;

      .divider {
        width: 1px;
        height: 24px;
        background-color: #eee;
        margin: 0 4px;
      }

      button {
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;

        &.btn-icon {
          width: 36px;
          height: 36px;
          background-color: #f4f6f8;
          color: #666;
          &:hover {
            background-color: #e2e6ea;
            color: #0b2b40;
          }
        }

        &.btn-secondary {
          padding: 8px 16px;
          background-color: #f4f6f8;
          color: #666;
          &:hover {
            background-color: #e2e6ea;
            color: #0b2b40;
          }
        }

        &.btn-primary {
          padding: 8px 24px;
          background-color: #0b2b40;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(11, 43, 64, 0.2);
          &:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(11, 43, 64, 0.3);
          }
        }
      }
    }
  }

  .main {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    background-color: #f4f6f8;
    display: flex;
    flex-direction: column;
    padding: 40px 15%;

    .line {
      width: 100%;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      // border: #0b2b40 solid 1px;
      margin-bottom: 20px;

      .original,
      .input {
        padding: 8px 16px;
        border: 1px solid #e0e0e0;
        background-color: #fff;

        input {
          all: unset;
          width: 100%;
        }
      }
    }
  }
}
</style>
