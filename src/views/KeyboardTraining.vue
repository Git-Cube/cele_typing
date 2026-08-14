<template>
  <div class="keyboard-training-container">
    <div class="bar">
      <div class="stats-group">
        <div class="info">
          <div class="tag">模式：{{ type }}</div>
        </div>
        <div class="status">
          <div class="stat-item"><span class="label">速度</span><span class="value">{{ speed }}<small>字/分</small></span></div>
          <div class="stat-item"><span class="label">正确率</span><span class="value">{{ accuracy }}%</span></div>
          <div class="stat-item"><span class="label">错误</span><span class="value">{{ errorCount }}</span></div>
        </div>
      </div>
      <div class="btns">
        <button class="btn-secondary" @click="handleReset">重置</button>
        <button class="btn-primary" @click="handleFinish">结束</button>
      </div>
    </div>

    <div class="main">
      <div class="target-text">
        <span
          v-for="(char, index) in practiceText"
          :key="index"
          :class="{
            typed: index < currentIndex,
            current: index === currentIndex,
            'space-char': char === ' ',
          }"
          >{{ char }}</span
        >
      </div>
      <div class="keyboard">
        <div class="row" v-for="(row, rowIndex) in keyboardLayout" :key="rowIndex">
          <div
            class="key"
            v-for="key in row"
            :key="key.code"
            :class="[
              key.class,
              {
                active: activeKey === key.code,
                target: isTargetKey(key.code),
                error: errorKey === key.code,
              },
            ]"
          >
            {{ key.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const speed = ref<number>(0)
const accuracy = ref<number>(100)
const errorCount = ref<number>(0)

const route = useRoute()
const router = useRouter()
const type = route.query.type as string || '键位练习'

let parsedPools;
try {
  parsedPools = route.query.selectedPools ? JSON.parse(route.query.selectedPools as string) : null;
} catch (e) {}

const selectedPools = ref<{
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  baseSymbols: boolean
  shiftSymbols: boolean
}>(parsedPools || {
  lowercase: true,
  uppercase: false,
  numbers: true,
  baseSymbols: true,
  shiftSymbols: false
})

const charPools: Record<string, string> = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  baseSymbols: '`-=[]\\;\',./',
  shiftSymbols: '~!@#$%^&*()_+{}|:"<>?'
}

const generateRandomText = (length = 6) => {
  let chars: string = ''
  if (selectedPools.value.lowercase) chars += charPools.lowercase
  if (selectedPools.value.uppercase) chars += charPools.uppercase
  if (selectedPools.value.numbers) chars += charPools.numbers
  if (selectedPools.value.baseSymbols) chars += charPools.baseSymbols
  if (selectedPools.value.shiftSymbols) chars += charPools.shiftSymbols

  // 如果全都取消勾选，默认给一个小写字母保底
  if (!chars) chars = charPools.lowercase!

  let result: string = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const practiceText = ref<string>(generateRandomText())
const currentIndex = ref<number>(0)
const activeKey = ref<string | null>(null)
const errorKey = ref<string | null>(null)

// 统计跟踪状态
const startTime = ref<number | null>(null)
const timerInterval = ref<number | null>(null)
const totalKeystrokes = ref<number>(0)
const correctKeystrokes = ref<number>(0)

const updateStats = () => {
  if (startTime.value) {
    const elapsedMinutes = (Date.now() - startTime.value) / 60000
    speed.value = elapsedMinutes > 0 ? Math.round(correctKeystrokes.value / elapsedMinutes) : 0
  }
  accuracy.value = totalKeystrokes.value > 0
    ? Math.round((correctKeystrokes.value / totalKeystrokes.value) * 100)
    : 100
}

// 定义键盘布局和对应的 KeyCode
const keyboardLayout: { code: string; label: string; class?: string }[][] = [
  [
    { code: 'Backquote', label: '~\n`' },
    { code: 'Digit1', label: '!\n1' },
    { code: 'Digit2', label: '@\n2' },
    { code: 'Digit3', label: '#\n3' },
    { code: 'Digit4', label: '$\n4' },
    { code: 'Digit5', label: '%\n5' },
    { code: 'Digit6', label: '^\n6' },
    { code: 'Digit7', label: '&\n7' },
    { code: 'Digit8', label: '*\n8' },
    { code: 'Digit9', label: '(\n9' },
    { code: 'Digit0', label: ')\n0' },
    { code: 'Minus', label: '_\n-' },
    { code: 'Equal', label: '+\n=' },
    { code: 'Backspace', label: 'Back', class: 'wide-backspace' },
  ],
  [
    { code: 'Tab', label: 'Tab', class: 'wide-tab' },
    { code: 'KeyQ', label: 'Q' },
    { code: 'KeyW', label: 'W' },
    { code: 'KeyE', label: 'E' },
    { code: 'KeyR', label: 'R' },
    { code: 'KeyT', label: 'T' },
    { code: 'KeyY', label: 'Y' },
    { code: 'KeyU', label: 'U' },
    { code: 'KeyI', label: 'I' },
    { code: 'KeyO', label: 'O' },
    { code: 'KeyP', label: 'P' },
    { code: 'BracketLeft', label: '{\n[' },
    { code: 'BracketRight', label: '}\n]' },
    { code: 'Backslash', label: '|\n\\', class: 'wide-backslash' },
  ],
  [
    { code: 'CapsLock', label: 'Caps', class: 'wide-caps' },
    { code: 'KeyA', label: 'A' },
    { code: 'KeyS', label: 'S' },
    { code: 'KeyD', label: 'D' },
    { code: 'KeyF', label: 'F' },
    { code: 'KeyG', label: 'G' },
    { code: 'KeyH', label: 'H' },
    { code: 'KeyJ', label: 'J' },
    { code: 'KeyK', label: 'K' },
    { code: 'KeyL', label: 'L' },
    { code: 'Semicolon', label: ':\n;' },
    { code: 'Quote', label: '"\n\'' },
    { code: 'Enter', label: 'Enter', class: 'wide-enter' },
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', class: 'wide-shift' },
    { code: 'KeyZ', label: 'Z' },
    { code: 'KeyX', label: 'X' },
    { code: 'KeyC', label: 'C' },
    { code: 'KeyV', label: 'V' },
    { code: 'KeyB', label: 'B' },
    { code: 'KeyN', label: 'N' },
    { code: 'KeyM', label: 'M' },
    { code: 'Comma', label: '<\n,' },
    { code: 'Period', label: '>\n.' },
    { code: 'Slash', label: '?\n/' },
    { code: 'ShiftRight', label: 'Shift', class: 'wide-shift' },
  ],
  [{ code: 'Space', label: 'Space', class: 'space' }],
]

// 判断当前键是否是目标需要按下的键（用于高亮提示）
const isTargetKey = (keyCode: string) => {
  if (currentIndex.value >= practiceText.value.length) return false
  const targetChar: string = practiceText.value[currentIndex.value]!

  if (targetChar === ' ') return keyCode === 'Space'
  if (targetChar.match(/[A-Za-z]/)) return keyCode === `Key${targetChar.toUpperCase()}`
  if (targetChar.match(/[0-9]/)) return keyCode === `Digit${targetChar}`

  const symbolMap: Record<string, string> = {
    '`': 'Backquote',
    '~': 'Backquote',
    '-': 'Minus',
    '_': 'Minus',
    '=': 'Equal',
    '+': 'Equal',
    '[': 'BracketLeft',
    '{': 'BracketLeft',
    ']': 'BracketRight',
    '}': 'BracketRight',
    '\\': 'Backslash',
    '|': 'Backslash',
    ';': 'Semicolon',
    ':': 'Semicolon',
    "'": 'Quote',
    '"': 'Quote',
    ',': 'Comma',
    '<': 'Comma',
    '.': 'Period',
    '>': 'Period',
    '/': 'Slash',
    '?': 'Slash',
    '!': 'Digit1',
    '@': 'Digit2',
    '#': 'Digit3',
    '$': 'Digit4',
    '%': 'Digit5',
    '^': 'Digit6',
    '&': 'Digit7',
    '*': 'Digit8',
    '(': 'Digit9',
    ')': 'Digit0',
  }
  return keyCode === symbolMap[targetChar]
}

// 结束练习，跳转到报告页面
const handleFinish = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  router.push({
    name: 'Report',
    query: {
      type: type,
      speed: speed.value,
      accuracy: accuracy.value,
      errorCount: errorCount.value,
      selectedPools: JSON.stringify(selectedPools.value),
    },
  })
}

// 重置练习
const handleReset = () => {
  practiceText.value = generateRandomText()
  currentIndex.value = 0
  activeKey.value = null
  errorKey.value = null

  speed.value = 0
  accuracy.value = 100
  errorCount.value = 0

  totalKeystrokes.value = 0
  correctKeystrokes.value = 0
  startTime.value = null

  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  // 屏蔽默认行为，避免按空格等导致页面滚动
  if (e.key !== 'F12' && e.key !== 'F5' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault()
  }

  // 过滤掉单独的修饰键或控制键，仅改变按压状态但不计入打字统计
  if (['Shift', 'CapsLock', 'Tab', 'Alt', 'Control', 'Meta', 'Enter', 'Backspace', 'Escape'].includes(e.key)) {
    activeKey.value = e.code
    return
  }

  if (!startTime.value) {
    startTime.value = Date.now()
    timerInterval.value = window.setInterval(updateStats, 3000)
  }

  activeKey.value = e.code
  totalKeystrokes.value++

  if (currentIndex.value < practiceText.value.length) {
    const targetChar: string = practiceText.value[currentIndex.value]!

    if (e.key === targetChar) {
      // 输入正确
      correctKeystrokes.value++
      currentIndex.value++
      errorKey.value = null

      // 检查是否完成当前组
      if (currentIndex.value >= practiceText.value.length) {
        // 完成后直接生成下一组以供连续训练
        setTimeout(() => {
          practiceText.value = generateRandomText()
          currentIndex.value = 0
        }, 100)
      }
    } else {
      // 输入错误，记录错误键位以标红
      errorCount.value++
      errorKey.value = e.code
    }
    updateStats()
  }
}

const handleKeyUp = (e: KeyboardEvent) => {
  if (activeKey.value === e.code) {
    activeKey.value = null
  }
  if (errorKey.value === e.code) {
    errorKey.value = null
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})

</script>

<style scoped lang="scss">
.keyboard-training-container {
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 40px;

    .target-text {
      font-size: 2.5rem;
      background: white;
      padding: 1.5rem 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      letter-spacing: 2px;
      font-family:
        Source Code Pro,
        monospace;
      display: flex;
      gap: 16px;

      span {
        padding: 0 2px;
        border-radius: 4px;
        transition: all 0.2s;

        &.typed {
          color: #bbb;
        }

        &.current {
          color: #1a73e8;
          background-color: #e8f0fe;
          font-weight: bold;
        }

        &.space-char {
          padding: 0 8px;
        }
      }
    }

    .keyboard {
      background: #dfe1e5;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 8px;

      .row {
        height: 52px;
        display: flex;
        justify-content: center;
        gap: 8px;

        .key {
          height: 50px;
          min-width: 50px;
          background: white;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-family:
            Source Code Pro,
            monospace,
            Arial,
            sans-serif;
          color: #444;
          box-shadow: 0 4px 0 #babbbd;
          transition: all 0.1s;
          user-select: none;
          white-space: pre-line;
          line-height: 1.2;
          text-align: center;

          &.wide-backspace {
            width: 80px;
          }
          &.wide-tab,
          &.wide-backslash {
            width: 65px;
          }
          &.wide-caps,
          &.wide-enter {
            width: 95px;
          }
          &.wide-shift {
            width: 125px;
          }
          &.space {
            width: 400px;
          }

          &.active {
            transform: translateY(2px);
            box-shadow: 0 0 0 #babbbd;
            background: #e8eaed;
          }

          &.target {
            background: #e8f0fe;
            color: #1a73e8;
            border: 2px solid #1a73e8;
            box-sizing: border-box;
          }

          &.error {
            background: #fad2e1;
            color: #d81159;
            border: 2px solid #d81159;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
</style>
