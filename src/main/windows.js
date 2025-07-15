// windows.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

let mainWindow = null;
let loginWindow = null;
let tray = null;

function applyCloseToHide(win, shouldHide = true) {
  win.on('minimize', (e) => {
    e.preventDefault();
    win.hide();
  });

  win.on('close', (e) => {
    if (!app.isQuiting && shouldHide) {
      e.preventDefault();
      win.hide();
    }
  });
}

function createLoginWindow() {
  if (loginWindow && !loginWindow.isDestroyed()) {
    loginWindow.destroy();
  }

  loginWindow = new BrowserWindow({
    width: 700,
    height: 400,
    icon: path.join(__dirname, '..', 'assets', 'icons', 'Siri_Tax_Icon.ico'),
    resizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/loginPreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  loginWindow.setMenu(null);
  loginWindow.loadFile('src/pages/login.html');

  applyCloseToHide(loginWindow, true);

  loginWindow.once('ready-to-show', () => {
    loginWindow.show();
  });

  if (isDev) loginWindow.webContents.openDevTools();
  return loginWindow;
}

function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.destroy();
  }

  mainWindow = new BrowserWindow({
    width: 700,
    height: 350,
    icon: path.join(__dirname, '..', 'assets', 'icons', 'Siri_Tax_Icon.ico'),
    resizable: false,
    show: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, '../preload/indexPreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile('src/pages/index.html');

  applyCloseToHide(mainWindow, true);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) mainWindow.webContents.openDevTools();
  return mainWindow;
}

function getMainWindow() {
  return mainWindow;
}

function getLoginWindow() {
  return loginWindow;
}

ipcMain.handle('open-signup', async () => {
  const signupWindow = new BrowserWindow({
    width: 800,
    height: 500,
    icon: path.join(__dirname, '..', 'assets', 'icons', 'Siri_Tax_Icon.ico'),
    resizable: false,
    show: false,
    parent: BrowserWindow.getFocusedWindow(),
    webPreferences: {
      preload: path.join(__dirname, '../preload/loginPreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  signupWindow.setMenu(null);
  if (isDev) signupWindow.webContents.openDevTools();
  await signupWindow.loadFile('src/pages/signup.html');

  signupWindow.once('ready-to-show', () => {
    signupWindow.show();
  });
  return new Promise((reject) => {
    let handled = false;
    signupWindow.on('closed', () => {
      if (handled) return;
      handled = true;
      reject(new Error('요청 취소됨'));
    });
  });
});

ipcMain.handle('open-user-info-popup', async () => {
  const userinfoWindow = new BrowserWindow({
    width: 800,
    height: 500,
    icon: path.join(__dirname, '..', 'assets', 'icons', 'Siri_Tax_Icon.ico'),
    resizable: false,
    show: false,
    frame: true,
    parent: BrowserWindow.getFocusedWindow(),
    modal: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/indexPreload.js'),
    },
  });
  userinfoWindow.setMenu(null);
  if (isDev) userinfoWindow.webContents.openDevTools();
  await userinfoWindow.loadFile('src/pages/userinfo.html');
  userinfoWindow.once('ready-to-show', () => {
    userinfoWindow.show();
  });
  return new Promise((reject) => {
    let handled = false;
    userinfoWindow.on('closed', () => {
      if (handled) return;
      handled = true;
      reject(new Error('요청 취소됨'));
    });
  });
});

ipcMain.handle('open-login', () => {
  createLoginWindow();
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
});

ipcMain.handle('open-history-popup', async (event, buttonValue) => {
  const popup = new BrowserWindow({
    width: 400,
    height: 450,
    icon: path.join(__dirname, '..', 'assets', 'icons', 'Siri_Tax_Icon.ico'),
    resizable: false,
    frame: true,
    parent: BrowserWindow.getFocusedWindow(),
    modal: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/indexPreload.js'),
    },
  });

  popup.setMenuBarVisibility(false);
  await popup.loadFile(path.join(__dirname, '../pages/popup/history_popup.html'), {
    query: { buttonValue: buttonValue }
  });

  if (isDev) popup.webContents.openDevTools();

  return new Promise((resolve, reject) => {
    let handled = false;

    ipcMain.once('form-submitted', (event, jsonString) => {
      if (handled) return;
      handled = true;
      popup.close();
      resolve(jsonString);
    });

    popup.on('closed', () => {
      if (handled) return;
      handled = true;
      reject(new Error('요청 취소됨'));
    });
  });
});

ipcMain.handle('open-date-selector', async (event, certType) => {
  const popup = new BrowserWindow({
    width: 400,
    height: 550,
    icon: path.join(__dirname, '..', 'assets', 'icons', 'Siri_Tax_Icon.ico'),
    modal: true,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/indexPreload.js'),
    },
  });

  popup.setMenuBarVisibility(false);

  const fileMap = {
    'tax-payment': 'tax-payment.html',
    'biz-reg': 'biz-reg.html',
    'income': 'income.html',
    'vat-standard': 'vat-standard.html',
    'financial': 'financial.html',
    'payment-history': 'payment-history.html',
  };

  const targetFile = fileMap[certType];
  if (!targetFile) {
    popup.close();
    throw new Error(`Invalid certType: ${certType}`);
  }

  await popup.loadFile(path.join(__dirname, '../pages/popup/date-popup', targetFile));

  if (isDev) popup.webContents.openDevTools();

  return new Promise((resolve, reject) => {
    let handled = false;

    ipcMain.once('date-submitted', (event, data) => {
      if (handled) return;
      handled = true;
      popup.close();
      resolve(data);
    });

    popup.on('closed', () => {
      if (handled) return;
      handled = true;
      reject(new Error('요청 취소됨'));
    });
  });
});

module.exports = {
  createLoginWindow,
  createWindow,
  getLoginWindow,
  getMainWindow,
  applyCloseToHide
};
