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
          <div class="stat-item">
            <span class="label">速度</span
            ><span class="value">{{ speed }}<small>字/分</small></span>
          </div>
          <div class="stat-item">
            <span class="label">正确率</span><span class="value">{{ accuracy }}%</span>
          </div>
          <div class="stat-item">
            <span class="label">用时</span
            ><span class="value"
              >{{
                Math.floor(timeCost / 60)
                  .toString()
                  .padStart(2, '0')
              }}:{{ (timeCost % 60).toString().padStart(2, '0') }}</span
            >
          </div>
          <div class="stat-item">
            <span class="label">进度</span><span class="value">{{ progress }}%</span>
          </div>
          <div class="stat-item">
            <span class="label">退格</span><span class="value">{{ backspaceCount }}</span>
          </div>
        </div>
      </div>
      <div class="btns">
        <button class="btn-icon" @click="handleLargerFont" title="放大字体">A+</button>
        <button class="btn-icon" @click="handleSmallerFont" title="缩小字体">A-</button>
        <select class="select-font" v-model="fontSelected">
          <option value="inherit">系统字体</option>
          <option value="meslo">Meslo</option>
          <option value="Source Code Pro">Source Code Pro</option>
        </select>
        <div class="divider"></div>
        <button class="btn-secondary" @click="handleReset">重置</button>
        <button class="btn-primary" @click="handleFinish">结束</button>
      </div>
    </div>
    <div class="main" :style="{ fontSize: fontSize + 'px', fontFamily: fontSelected }">
      <div class="line line-measure" v-if="false">
        <div class="original">
          <span v-for="(char, charIndex) in articleTitle.split('')" :key="charIndex">
            {{ char }}
          </span>
        </div>
      </div>
      <div class="line" v-for="(text, textIndex) in slicedContent" :key="textIndex">
        <div class="original" ref="textContainer">
          <span
            v-for="(char, charIndex) in text.split('')"
            :key="charIndex"
            :style="{
              color: getColor(textIndex, charIndex),
              backgroundColor: getBackgroundColor(textIndex, charIndex),
            }"
            >{{ char }}</span
          >
        </div>
        <div class="input">
          <textarea
            :maxlength="text.length"
            :style="{ fontSize: fontSize + 'px' }"
            :disabled="textIndex !== activeLineIndex"
            v-model="inputValue[textIndex]"
            @keydown="handleKeyDown($event, textIndex)"
            @input="handleInput($event, textIndex)"
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useResizeObserver } from '@vueuse/core'
import type { ComputedRef } from 'vue'

const router = useRouter()
const route = useRoute()
const type = route.query.type as string
const language = route.query.language as string
const codeFile = route.query.code as string
const textContainer = ref<HTMLElement | null>(null)
const containerWidth = ref<number>(0)
const containerHeight = ref<number>(0)
const fontSize = ref<number>(20)
const inputValue = ref<Array<string>>([])
const backspaceCount = ref<number>(0)
const speed = ref<number>(0)
const timeCost = ref<number>(0)
const startInput = ref<boolean>(false)
const fontSelected = ref<string>('meslo')

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
  if (articleContent.value.length === 0) return 0
  return parseFloat(((totalTypedCount.value / articleContent.value.length) * 100).toFixed(1))
})

const codeFiles = import.meta.glob('../data/code/*/*', { query: '?raw', import: 'default' })

const articleTitle = computed(() => {
  return codeFile || ''
})

const articleContent = ref<string>('')

const loadCodeContent = async () => {
  if (language && codeFile) {
    const path: string = `../data/code/${language}/${codeFile}`
    if (codeFiles[path]) {
      const rawContent = (await codeFiles[path]()) as string
      // 统一将 Windows 的 \r\n 换行符转换为 \n 换行符，与 textarea 输入保持一致 (1个字符)
      articleContent.value = rawContent.replace(/\r\n/g, '\n')
    } else {
      console.error(`Code file not found: ${path}`)
    }
  }
}
loadCodeContent()

// 按键处理函数
const handleFinish = () => {
  router.push({
    name: 'Report',
    query: {
      type: type,
      articleId: codeFile,
      articleTitle: articleTitle.value,
      timeCost: timeCost.value,
      speed: speed.value,
      accuracy: accuracy.value,
      backspaceCount: backspaceCount.value,
    },
  })
}
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

// 编程模式不再分行，直接将整块代码作为一个字符串渲染
const slicedContent: ComputedRef<Array<string>> = computed(() => {
  return articleContent.value ? [articleContent.value] : []
})

// 只有一行
const activeLineIndex: ComputedRef<number> = computed(() => 0)

const handleInput = (event: Event, textIndex: number) => {
  if (!startInput.value) {
    startInput.value = true
    startTimer()
    startSpeedTimer()
  }

  const target = event.target as HTMLTextAreaElement
  inputValue.value[textIndex] = target.value
}

const handleKeyDown = (event: KeyboardEvent, textIndex: number) => {
  // 如果按下退格键，并且当前行的输入不为空，增加退格计数
  if (
    event.key === 'Backspace' &&
    !(inputValue.value[textIndex] === '' || inputValue.value[textIndex] === undefined)
  ) {
    backspaceCount.value += 1
  }
  // 处理 Tab 键，插入两个空格
  if (event.key === 'Tab') {
    event.preventDefault()

    if (!startInput.value) {
      startInput.value = true
      startTimer()
      startSpeedTimer()
    }

    const target = event.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd
    const currentValue = inputValue.value[textIndex] || ''

    inputValue.value[textIndex] =
      currentValue.substring(0, start) + '  ' + currentValue.substring(end)

    setTimeout(() => {
      target.selectionStart = target.selectionEnd = start + 2
    }, 0)
  }
}

const getColor = (textIndex: number, charIndex: number): string => {
  const input = inputValue.value[textIndex] || ''
  const originalChar = slicedContent.value[textIndex]![charIndex]
  const inputChar = input[charIndex]

  if (inputChar === undefined) {
    return '#000'
  } else if (inputChar === originalChar) {
    return 'green'
  } else {
    return 'red'
  }
}
const getBackgroundColor = (textIndex: number, charIndex: number): string => {
  const input = inputValue.value[textIndex] || ''
  const originalChar = slicedContent.value[textIndex]![charIndex]
  const inputChar = input[charIndex]

  if (inputChar !== undefined && originalChar === ' ' && inputChar !== ' ') {
    return 'rgba(255, 0, 0, 0.3)'
  } else if (inputChar !== undefined && originalChar === '\n' && inputChar !== '\n') {
    return 'rgba(255, 0, 0, 0.3)'
  }
  return 'transparent'
}
</script>

<style scoped lang="scss">
.typing-training-container {
  flex: 1;
  height: 100%;
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

      .select-font {
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 14px;
        color: #0b2b40;
        background-color: #f4f6f8;
        border: 1px solid transparent;
        outline: none;
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
          background-color: #e2e6ea;
        }
        &:focus {
          border-color: #0b2b40;
        }
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
    padding: 40px 10%;

    .line {
      display: flex;
      flex-direction: row;
      gap: 20px;
      width: 100%;
      margin-bottom: 20px;

      .original,
      .input {
        flex: 1;
        width: 50%;
        padding: 16px;
        background-color: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        white-space: pre-wrap;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      }

      .input {
        display: flex;
        flex-direction: column;

        textarea {
          all: unset;
          flex: 1;
          width: 100%;
          line-height: inherit;
          resize: none;
          box-sizing: border-box;
          overflow: hidden;
        }
      }
    }
  }
}
</style>

