<template>
  <div class="about-container">
    <div class="about-panel">
      <div class="logo">
        <img src="../assets/logo_dark.png" alt="CeleTyping Logo" />
      </div>
      <h2>关于 CeleTyping</h2>
      <p class="description">
        CeleTyping 是一款专为提高打字速度和准确率而设计的在线练习工具。我们提供多种类型的练习模式，包括中文文章、英文文章、编程代码以及基础键位练习，帮助您全方位提升键盘操作技能。
      </p>

      <div class="features">
        <div class="feature-item">
          <i class="iconfont icon-zhongwen1"></i>
          <div class="text">中文文章练习</div>
        </div>
        <div class="feature-item">
          <i class="iconfont icon-yingwen1"></i>
          <div class="text">英文文章练习</div>
        </div>
        <div class="feature-item">
          <i class="iconfont icon-biancheng"></i>
          <div class="text">真实编程代码</div>
        </div>
        <div class="feature-item">
          <i class="iconfont icon-jianwei"></i>
          <div class="text">基础键位训练</div>
        </div>
      </div>

      <div class="footer">
        <p>版本 v1.0.0</p>
        <p>&copy; {{ new Date().getFullYear() }} CeleTyping. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面的逻辑代码写在这里
</script>

<style scoped lang="scss">
@import '../assets/fonts/iconfont.css';

.about-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f6f8;
  padding: 2rem;

  .about-panel {
    width: 600px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .logo {
      width: 80px;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;

      img {
        width: 100%;
        object-fit: contain;
      }
    }

    h2 {
      font-size: 24px;
      color: #0b2b40;
      margin: 0 0 16px;
      font-weight: 600;
    }

    .description {
      font-size: 15px;
      color: #555;
      line-height: 1.8;
      margin-bottom: 32px;
      text-align: justify;
    }

    .features {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      margin-bottom: 40px;
      width: 100%;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;
        background-color: #f0f2f5;
        padding: 16px 20px;
        border-radius: 8px;
        width: 45%;

        i {
          font-size: 24px;
          color: #0b2b40;
          font-style: normal;
        }

        .text {
          font-size: 15px;
          color: #333;
          font-weight: 500;
        }
      }
    }

    .footer {
      border-top: 1px solid #f0f2f5;
      padding-top: 20px;
      width: 100%;

      p {
        margin: 4px 0;
        font-size: 13px;
        color: #999;
      }
    }
  }
}
</style>
