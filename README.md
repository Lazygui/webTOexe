# Vue3 Project Launcher

这是一个用于加载 Vue3 项目的 Electron 桌面应用。

## 如何部署 Vue 项目

1. 在应用程序的 resources 目录下创建`app`文件夹
2. 将 Vue 项目的源代码复制到`resources/app`文件夹中
      - 确保项目的`package.json`文件位于`resources/app`目录下
      - 确保项目包含完整的源代码和必要的配置文件
      - 确保项目可以打包并且打包后文件夹名称为为`dist`
3. 启动应用程序，它将自动：
      - 安装项目依赖（如果需要）
      - 执行构建命令（如果需要）
      - 加载构建后的页面

## 开发说明

- 使用`npm start`启动应用程序
- 使用`npm run build`构建应用程序

## 注意事项

- 确保 Vue 项目在打包时已正确配置了相对路径（建议在 Vue 项目的`vite.config.js`中设置`base: './'`）
- 如果 Vue 项目使用了路由，建议使用 hash 模式而不是 history 模式，以避免刷新页面时出现 404 错误
