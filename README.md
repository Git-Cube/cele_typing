# Cele Typing (在线打字练习系统)

Cele Typing 是一款基于 **Vue 3 + TypeScript + Vite** 构建的现代化、可定制的在线打字练习与键盘训练应用。旨在帮助用户全方位提升打字速度（WPM）、准确率，以及熟悉真实编程场景中的代码输入。

## ✨ 核心功能 (Features)

- 🇨🇳 **中文文章练习**：提供精选中文文章的打字训练，支持拼音及汉字输入的流畅体验。
- 🇬🇧 **英文文章练习**：通过经典的英文段落提升英语单词的录入速率。
- 💻 **编程代码练习**：提供真实的开源代码片段（支持 C++, Python, JavaScript 等），专为程序员优化的标点与代码缩进练习。
- ⌨️ **基础键位训练**：支持对小写字母、大写字母、数字符号、以及各种修饰键（Shift组合键）针对性的自由选取与靶向盲打训练。内置高亮虚拟键盘。
- 📊 **实时数据统计**：基于击键精准计算 WPM、正确率（Accuracy）和错误键位分析，练习结束后提供详细报告。
- 🎨 **现代化 UI**：采用 SCSS 提供美观整洁的卡片式响应式界面与平滑的交互动画。

## 🛠️ 技术栈 (Tech Stack)

- **前端框架**：Vue 3 (Composition API / `<script setup>`)
- **开发语言**：TypeScript
- **构建工具**：Vite
- **路由管理**：Vue Router 4
- **样式预处理**：SCSS / Sass
- **图标**：Iconfont

## 🚀 快速开始 (Getting Started)

### 环境要求

推荐使用 Node.js `18.x` 或更高版本。

### 1. 安装依赖

```sh
npm install
```

### 2. 启动开发服务器 (Hot-Reload)

```sh
npm run dev
```

### 3. 生产环境构建编译 (Type-Check & Minify)

```sh
npm run build
```

## 📁 目录结构简介

```text
cele/
├── src/
│   ├── assets/       # 静态资源与字体图标 (iconfont)
│   ├── components/   # 公共组件 (如 Header.vue 等)
│   ├── data/         # 练习题目数据源 (中英文 JSON 及代码源文件)
│   ├── router/       # Vue Router 路由配置
│   ├── views/        # 页面级视图 (首页、各类训练页、结算报告、关于等)
│   ├── App.vue       # 根组件
│   └── main.ts       # 全局入口文件
├── public/           # 零碎静态公共资源
├── vite.config.ts    # Vite 构建配置
└── package.json      # 项目信息与依赖
```

## 📚 推荐开发环境 (Recommended IDE Setup)

强烈建议使用 [VS Code](https://code.visualstudio.com/) 并配合以下扩展以获得最佳的开发体验:

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Volar)

---

&copy; Cele Typing. All rights reserved.
