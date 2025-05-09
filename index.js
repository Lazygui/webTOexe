const { app, BrowserWindow } = require('electron')
const { exec } = require('node:child_process');
const path = require('node:path')
const fs = require('fs');
const util = require('node:util');

const execAsync = util.promisify(exec);
const renderMessage = (win, message) => {
  win.webContents.send('status-message', message);
}
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
  // win.webContents.openDevTools(); // 打开浏览器控制台

  win.loadFile(path.join(__dirname, 'inspection.html'));
  renderMessage(win, {
    status: 'create',
    message: "",
    step: '系统初始化'
  })
  // 获取Vue项目路径
  const appPath = app.isPackaged
    ? path.join(process.resourcesPath, webName)
    : path.join(__dirname, webName);


  const distPath = path.join(appPath, 'dist');

  try {
    // 检查 vue项目 文件夹是否存在
    if (!fs.existsSync(appPath)) {
      throw new Error(JSON.stringify({ step: '程序初始化', message: `找不到前端项目文件夹: ${appPath}` }));
    }
    // 检查 vue项目打包结果是否存在
    if (!fs.existsSync(distPath)) {
      renderMessage(win, {
        status: 'create',
        message: "",
        step: '检查重要文件'
      })
      // 检查package.json是否存在
      if (!fs.existsSync(path.join(appPath, 'package.json'))) {
        throw new Error(JSON.stringify({ step: '检查重要文件', message: '找不到Vue项目的package.json文件' }));
      }
      renderMessage(win, {
        status: 'create',
        message: "",
        step: '程序安装依赖中'
      })
      // 检查node_modules是否存在，不存在则安装依赖
      if (!fs.existsSync(path.join(appPath, 'node_modules'))) {
        try {
          await execAsync('npm install', { cwd: appPath });
        } catch (error) {
          throw new Error(JSON.stringify({ step: '程序安装依赖中', message: '程序安装依赖失败！' }));
        }
      }
      renderMessage(win, {
        status: 'create',
        message: "",
        step: '程序构建中'
      })
      try {  // 执行构建命令
        await execAsync('npm run build', { cwd: appPath });
      } catch (error) {
        throw new Error(JSON.stringify({ step: '程序构建中', message: '程序构建失败！' }));
      }
    }

    // 加载构建后的index.html文件
    win.loadFile(path.join(distPath, 'index.html'));

  } catch (error) {
    const info = JSON.parse(error.message);
    renderMessage(win, {
      status: 'error',
      message: info.message,
      step: info.step
    })
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