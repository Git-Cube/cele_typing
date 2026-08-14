<template>
  <div class="keyboard-container">
    <div class="index-panel">
      <ul class="tabs">
        <li class="active">
          <i class="iconfont icon-jianwei"></i>
          <div class="label">键位练习</div>
        </li>
      </ul>
      <div class="tab-content">
        <div class="option">
          <div class="label">练习内容：</div>
          <div class="options-area">
            <label><input type="checkbox" v-model="selectedPools.lowercase" /> 小写字母</label>
            <label><input type="checkbox" v-model="selectedPools.uppercase" /> 大写字母</label>
            <label><input type="checkbox" v-model="selectedPools.numbers" /> 数字</label>
            <label><input type="checkbox" v-model="selectedPools.baseSymbols" /> 非组合键符号</label>
            <label><input type="checkbox" v-model="selectedPools.shiftSymbols" /> 组合键符号</label>
          </div>
        </div>
      </div>
      <div class="btns">
        <button :disabled="isStartDisabled" @click="startPracticing">开始练习</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedPools = ref({
  lowercase: true,
  uppercase: false,
  numbers: true,
  baseSymbols: true,
  shiftSymbols: false
})

const isStartDisabled = computed(() => {
  return !(selectedPools.value.lowercase ||
           selectedPools.value.uppercase ||
           selectedPools.value.numbers ||
           selectedPools.value.baseSymbols ||
           selectedPools.value.shiftSymbols)
})

const startPracticing = () => {
  router.push({ name: 'KeyboardTraining', query: { type: '键位', selectedPools: JSON.stringify(selectedPools.value) } })
}
</script>

<style scoped lang="scss">
@import '../assets/fonts/iconfont.css';

.keyboard-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f6f8;

  .index-panel {
    width: 500px;
    min-height: 340px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .tabs {
      background-color: #f0f2f5;
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: default;
        padding: 16px 0;
        color: #0b2b40;
        background-color: #ffffff;
        font-weight: 600;

        i {
          font-size: 28px;
          margin-bottom: 6px;
          font-weight: 400;
        }

        .label {
          font-size: 15px;
          margin-top: 4px;
        }
      }
    }

    .tab-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 30px 40px;
      gap: 20px;

      .option {
        display: flex;
        align-items: flex-start;

        .label {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          width: 80px;
          text-align: right;
          margin-right: 16px;
          margin-top: 2px;
        }

        .options-area {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;

          label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
            color: #333;
            cursor: pointer;
            width: calc(50% - 6px);
            text-align: left;
            user-select: none;

            input[type="checkbox"] {
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
          }
        }
      }
    }

    .btns {
      padding: 0 40px 30px;
      display: flex;
      justify-content: center;
      gap: 16px;

      button {
        width: 60%;
        height: 46px;
        font-size: 16px;
        font-weight: 500;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition:
          transform 0.1s,
          opacity 0.2s,
          background-color 0.2s;
        background-color: #0b2b40;
        color: #fff;

        &:active:not(:disabled) {
          transform: scale(0.96);
        }

        &:hover:not(:disabled) {
          opacity: 0.9;
        }

        &:disabled {
          background-color: #dce1e6;
          color: #999;
          cursor: not-allowed;
          transform: none;
        }
      }
    }
  }
}
</style>
