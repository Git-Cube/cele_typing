<template>
  <div class="home-container">
    <div class="hero">
      <div class="title">欢迎使用 CeleTyping</div>
      <div class="subtitle">一款高效、纯粹的打字练习工具</div>
      <button class="start-btn" @click="handleStart">即刻开始</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleStart = () => {
  router.push({ name: 'Typing' })
}
</script>

<style scoped lang="scss">
.home-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f6f8;

  .hero {
    text-align: center;
    transform: translateY(-10%); /* 视觉上轻微偏上，获得更好的重心分布 */

    .title {
      font-size: 48px;
      font-weight: 700;
      color: #0b2b40;
      margin-bottom: 16px;
      letter-spacing: 2px;
    }

    .subtitle {
      font-size: 18px;
      color: #666;
      margin-bottom: 40px;
      letter-spacing: 1px;
    }

    .start-btn {
      padding: 14px 40px;
      font-size: 18px;
      font-weight: 500;
      color: #fff;
      background-color: #0b2b40;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(11, 43, 64, 0.15);
      transition:
        transform 0.1s,
        box-shadow 0.2s,
        opacity 0.2s;

      &:hover {
        opacity: 0.9;
        box-shadow: 0 6px 16px rgba(11, 43, 64, 0.25);
        transform: translateY(-2px);
      }

      &:active {
        transform: scale(0.96) translateY(0);
        box-shadow: 0 2px 8px rgba(11, 43, 64, 0.1);
      }
    }
  }
}
</style>
