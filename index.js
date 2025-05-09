const { app, BrowserWindow } = require('electron')
const { exec } = require('node:child_process');
const path = require('node:path')
const fs = require('fs');
const util = require('node:util');

const execAsync = util.promisify(exec);
const createWindow = async () => {
  const webName = 'www'
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: true,
    autoHideMenuBar: true,
    menuBarVisible: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  })
  // 获取Vue项目路径
  const appPath = app.isPackaged
    ? path.join(process.resourcesPath, webName)
    : path.join(__dirname, webName);


  const distPath = path.join(appPath, 'dist');

  try {
    // 检查 vue项目 文件夹是否存在
    if (!fs.existsSync(appPath)) {
      throw new Error(`找不到前端项目文件夹: ${appPath}`);
    }
    // 检查 vue项目打包结果是否存在
    if (!fs.existsSync(distPath)) {
      // 检查package.json是否存在
      if (!fs.existsSync(path.join(appPath, 'package.json'))) {
        throw new Error('找不到Vue项目的package.json文件');
      }

      // 检查node_modules是否存在，不存在则安装依赖
      if (!fs.existsSync(path.join(appPath, 'node_modules'))) {
        await execAsync('npm install', { cwd: appPath });
      }
      // 执行构建命令
      await execAsync('npm run build', { cwd: appPath });
    }

    // console.log(appPath)
    // 加载构建后的index.html文件
    win.loadFile(path.join(distPath, 'index.html'));

  } catch (error) {
    // 在窗口中显示错误信息
    win.loadURL(`data:text/html;charset=utf-8,
      <html>
        <body>
          <h1>错误</h1>
          <pre>${error.message}</pre>
        </body>
      </html>
    `);
  }
}
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})