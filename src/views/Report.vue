<template>
  <div class="report-container">
    <div class="panel">
      <div class="title">练习报告</div>
      <div class="content">
        <div class="item">
          <span class="label">模式</span>
          <div class="data">
            <span class="value">{{ items.type }}</span>
          </div>
        </div>
        <div class="item" v-if="!(items.type === '键位')">
          <span class="label">文章</span>
          <div class="data">
            <span class="value">{{ items.articleTitle }}</span>
          </div>
        </div>
        <div class="item">
          <span class="label">速度</span>
          <div class="data">
            <span class="value highlight">{{ items.speed }}</span> <span class="unit">字/分</span>
          </div>
        </div>
        <div class="item">
          <span class="label">正确率</span>
          <div class="data">
            <span class="value highlight">{{ items.accuracy }}</span> <span class="unit">%</span>
          </div>
        </div>
        <div class="item" v-if="!(items.type === '键位')">
          <span class="label">用时</span>
          <div class="data">
            <span class="value">{{ formatTime(Number(items.timeCost)) }}</span>
          </div>
        </div>
        <div class="item" v-if="!(items.type === '键位')">
          <span class="label">退格</span>
          <div class="data">
            <span class="value">{{ items.backspaceCount }}</span> <span class="unit">次</span>
          </div>
        </div>
        <div class="item" v-if="items.type === '键位'">
          <span class="label">错误</span>
          <div class="data">
            <span class="value">{{ items.errorCount }}</span> <span class="unit">次</span>
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="btn retry-btn" @click="handleRetry">再试一次</button>
        <button class="btn home-btn" @click="handleBackHome">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 取出传递过来的参数，如果为空则兜底给个空对象
const items = route.query || {
  type: '',
  articleId: '',
  articleTitle: '',
  timeCost: '',
  speed: '',
  accuracy: '',
  backspaceCount: '',
  errorCount: '',
  selectedPools: '',
} as Record<string, string>

// 格式化时间助手函数
const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '00:00'
  const m: string = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s: string = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const handleRetry = () => {
  const type: string = items.type as string

  if (type === '键位') {
    router.push({ name: 'KeyboardTraining', query: { type: '键位', selectedPools: JSON.stringify(items.selectedPools) } })
  }
  else if (type === '中文') {
    router.push({ name: 'CnTypingTraining', query: { type: items.type, article: items.articleId } })
  }
  else if (type === '英文') {
    router.push({ name: 'EnTypingTraining', query: { type: items.type, article: items.articleId } })
  }

}

const handleBackHome = () => {
  router.push({ name: 'Home' })
}
</script>

<style scoped lang="scss">
.report-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f4f6f8;

  .panel {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 40px;
    width: 440px;
    text-align: center;

    .title {
      font-size: 26px;
      font-weight: 600;
      color: #0b2b40;
      margin-bottom: 36px;
      letter-spacing: 2px;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 40px;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f9f9f9;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 16px;
        color: #333;

        .label {
          color: #666;
          font-weight: 500;
        }

        .data {
          display: flex;
          align-items:baseline;

          .value {
            font-weight: 500;
            &.highlight {
              font-size: 26px;
              color: #28a745;
              font-weight: 700;
            }
          }
          .unit {
            font-size: 14px;
            color: #999;
            margin-left: 6px;
          }
        }
      }
    }

    .actions {
      display: flex;
      justify-content: space-between;
      gap: 20px;

      .btn {
        flex: 1;
        padding: 12px 0;
        font-size: 16px;
        font-weight: 500;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.1s, opacity 0.2s;

        &:active {
          transform: scale(0.96);
        }

        &.retry-btn {
          background-color: #0b2b40;
          color: #fff;
          &:hover {
            opacity: 0.9;
          }
        }

        &.home-btn {
          background-color: #e0e0e0;
          color: #333;
          &:hover {
            background-color: #d5d5d5;
          }
        }
      }
    }
  }
}
</style>
