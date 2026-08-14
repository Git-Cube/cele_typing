<template>
  <div class="typing-container">
    <div class="index-panel">
      <ul class="tabs">
        <li @click="tabsSelected = 'cn'" :class="{ active: tabsSelected === 'cn' }">
          <i class="iconfont icon-zhongwen1"></i>
          <div class="label">中文练习</div>
        </li>
        <li @click="tabsSelected = 'en'" :class="{ active: tabsSelected === 'en' }">
          <i class="iconfont icon-yingwen1"></i>
          <div class="label">英文练习</div>
        </li>
        <li @click="tabsSelected = 'pr'" :class="{ active: tabsSelected === 'pr' }">
          <i class="iconfont icon-biancheng"></i>
          <div class="label">编程练习</div>
        </li>
      </ul>
      <div class="tab-cn" v-if="tabsSelected === 'cn'">
        <div class="option">
          <div class="label">选择文章：</div>
          <select v-model="cnSelected">
            <option disabled value="">请选择</option>
            <option v-for="article in cnArticleData.data" :key="article.id" :value="article.id">
              {{ article.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="tab-en" v-if="tabsSelected === 'en'">
        <div class="option">
          <div class="label">选择文章：</div>
          <select v-model="enSelected">
            <option disabled value="">请选择</option>
            <option v-for="article in enArticleData.data" :key="article.id" :value="article.id">
              {{ article.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="tab-pr" v-if="tabsSelected === 'pr'">
        <div class="option">
          <div class="label">选择语言：</div>
          <select v-model="prSelected">
            <option disabled value="">请选择</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <div class="option">
          <div class="label">选择代码：</div>
          <select v-model="codeSelected">
            <option disabled value="">请选择</option>
            <option v-for="code in currentCodeList" :key="code" :value="code">{{ code }}</option>
          </select>
        </div>
      </div>
      <div class="btns">
        <button :disabled="isStartDisabled" @click="startPracticing">开始练习</button>
        <!-- <button>自由练习</button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import cnArticleData from '../data/cn_articles.json'
import enArticleData from '../data/en_articles.json'
import type { ComputedRef } from 'vue'

const router = useRouter()
const tabsSelected = ref<'cn' | 'en' | 'pr'>('cn')
const cnSelected = ref<string>('')
const enSelected = ref<string>('')
const prSelected = ref<string>('')
const codeSelected = ref<string>('')

const isStartDisabled = computed(() => {
  if (tabsSelected.value === 'cn') return !cnSelected.value
  if (tabsSelected.value === 'en') return !enSelected.value
  if (tabsSelected.value === 'pr') return !prSelected.value || !codeSelected.value
  return true
})

// 获取所有代码文件
const codeFiles = import.meta.glob('../data/code/*/*', { query: '?raw', import: 'default' })

// 解析代码文件路径，构建编程练习的选项数据结构
const prCodeOptions: ComputedRef<{ [key: string]: string[] }> = computed(() => {
  const options: { [key: string]: string[] } = { cpp: [], python: [], javascript: [] }
  for (const path of Object.keys(codeFiles)) {
    const parts: string[] = path.split('/')
    const lang: string = parts[parts.length - 2] || ''
    const file: string = parts[parts.length - 1] || ''
    if (options[lang] && file) {
      options[lang].push(file)
    }
  }
  console.log('prCodeOptions:', options)
  return options
})

// 根据选择的编程语言，动态获取对应的代码选项
const currentCodeList = computed(() => {
  if (prSelected.value && prCodeOptions.value[prSelected.value]) {
    return prCodeOptions.value[prSelected.value]
  }
  return []
})

const startPracticing = () => {
  // 根据选择的练习类型和内容，跳转到对应的练习页面
  if (tabsSelected.value === 'cn' && cnSelected.value) {
    router.push({ name: 'CnTypingTraining', query: { type: '中文', article: cnSelected.value } })
  } else if (tabsSelected.value === 'en' && enSelected.value) {
    router.push({ name: 'EnTypingTraining', query: { type: '英文', article: enSelected.value } })
  } else if (tabsSelected.value === 'pr' && prSelected.value && codeSelected.value) {
    router.push({
      name: 'PrTypingTraining',
      query: { type: '编程', language: prSelected.value, code: codeSelected.value },
    })
  } else {
    // alert('请先选择练习类型和内容！')
  }
}
</script>

<style scoped lang="scss">
@import '../assets/fonts/iconfont.css';

.typing-container {
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
        cursor: pointer;
        padding: 16px 0;
        color: #666;
        transition:
          background-color 0.3s,
          color 0.3s;

        &.active {
          background-color: #ffffff;
          color: #0b2b40;
          font-weight: 600;
        }

        i {
          font-size: 28px;
          margin-bottom: 6px;
          font-weight: 400;
        }

        .label {
          font-size: 15px;
        }
      }
    }

    .tab-cn,
    .tab-en,
    .tab-pr {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 30px 40px;
      gap: 20px;

      .option {
        display: flex;
        align-items: center;

        .label {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          width: 80px;
          text-align: right;
          margin-right: 16px;
        }

        select {
          flex: 1;
          height: 42px;
          padding: 0 12px;
          border: 1px solid #dce1e6;
          border-radius: 8px;
          background-color: #f9f9f9;
          font-size: 15px;
          color: #333;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;

          &:focus {
            border-color: #0b2b40;
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
        // flex: 1;
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

        &:active {
          transform: scale(0.96);
        }

        &:first-child {
          background-color: #0b2b40;
          color: #fff;
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

        // &:last-child {
        //   background-color: #e0e0e0;
        //   color: #333;
        //   &:hover {
        //     background-color: #d5d5d5;
        //   }
        // }
      }
    }
  }
}
</style>

