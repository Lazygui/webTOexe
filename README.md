# vue to exe

这是一个用于加载 Vue3 项目的 Electron 桌面应用。

支持直接放入源码 或 打包结果

---

## 开发环境

node 22.13.1

---

## 启动项目并预览Vue页面

1. 终端命令：pnpm 或 npm  install 安装依赖
2. 根目录下新建www文件夹
3. 拷贝vue源码 或 vue打包结果dist文件夹（必须dist文件夹名）
4. 终端命令：pnpm 或 npm run start 运行Electron

   **源码需要时间构建，出现长时间白屏正常，只有第一次会出现白屏状态**

---

## 如何打包Electron

1. 删除上述**启动项目并预览Vue页面**操作的文件夹（没有上述预览步骤跳过此项）
2. 终端命令：pnpm run build 构建打包结果app文件夹

---

## 如何使用打包后的Electron显示vue页面

1. 打包结果app中存在两种方式
   -单独文件夹：可以直接使用的exe
   -除了文件夹所有的都属于需要安装程序
2. 这里只介绍方式一（单文件形式）

   - 打开打包结果app文件夹下的文件夹下的resources的文件夹（app下只有一个文件夹）
   - resources文件夹下新建www文件夹
   - 将vue源码 或 vue打包结果dist文件夹放入www下
   - 双击resources层的.exe程序启动窗口

## 开发说明

- 使用 `npm install`构建依赖
- 使用 `npm start`启动应用程序
- 使用 `npm run build`构建应用程序

## 注意事项

- 确保放入的Vue源码单独可运行（建议拷贝Vue源码时不要包含 `node_modules`文件夹）
- 确保 Vue 项目在打包时已正确配置了相对路径（建议在 Vue 项目的 `vite.config.js`中设置 `base: './'`）
- 如果 Vue 项目使用了路由，建议使用 hash 模式而不是 history 模式，以避免刷新页面时出现 404 错误
