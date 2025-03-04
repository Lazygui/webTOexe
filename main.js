const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const util = require('util');

const execAsync = util.promisify(exec);

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: true,
    transparent: true,
    backgroundColor: '#00000000',
    autoHideMenuBar: false,
    menuBarVisible: true,
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // 获取Vue项目路径
  const appPath = app.isPackaged
    ? path.join(process.resourcesPath, 'app')
    : path.join(__dirname);
  const distPath = path.join(appPath, 'dist');

  try {
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

    // 检查dist目录是否存在
    if (!fs.existsSync(distPath)) {
      throw new Error('构建失败：找不到dist目录');
    }

    // 加载构建后的index.html文件
    mainWindow.loadFile(path.join(distPath, 'index.html'));
  } catch (error) {
    console.error('Error:', error);
    // 在窗口中显示错误信息
    mainWindow.loadURL(`data:text/html;charset=utf-8,
      <html>
        <body>
          <h1>错误</h1>
          <pre>${error.message}</pre>
        </body>
      </html>
    `);
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});