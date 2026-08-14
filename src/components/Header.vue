<template>
  <div class="header-container">
    <div class="logo">
      <img src="../assets/logo_dark.png" alt="CeleTyping Logo" />
      <div class="title">CeleTyping</div>
    </div>
    <div class="nav">
      <router-link to="/home">首页</router-link>
      <router-link to="/typing">打字练习</router-link>
      <router-link to="/keyboard">键位练习</router-link>
      <router-link to="/about">关于我们</router-link>
    </div>
  </div>
</template>

<script setup>
// 页面的逻辑代码写在这里
</script>

<style scoped lang="scss">
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  padding: 0 40px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;

    img {
      width: 38px;
      height: 38px;
      object-fit: contain;
    }

    .title {
      font-size: 24px;
      font-weight: 800;
      color: #0b2b40;
      letter-spacing: 1px;
    }
  }

  .nav {
    display: flex;
    gap: 10px;
    align-items: center;

    a {
      color: #666;
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        color: #0b2b40;
        background-color: #f4f6f8;
      }

      &.router-link-active {
        color: #ffffff;
        background-color: #0b2b40;
        box-shadow: 0 4px 8px rgba(11, 43, 64, 0.2);
      }
    }
  }
}
</style>
