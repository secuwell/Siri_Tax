// tray.js
const { Tray, Menu, app } = require('electron');
const path = require('path');
const { clearUserData } = require('../config/secuerStore');
const { loadToken, clearToken } = require('../config/secuerStore');
const {
  createLoginWindow,
  createWindow,
  getMainWindow,
  getLoginWindow
} = require('./windows');

let tray = null;

async function createTray(windowInstance) {
  if (tray) tray.destroy();

  tray = new Tray(path.join(__dirname, '../assets/icons/Siri_Tax_Icon.ico'));

  const token = await loadToken();
  const isLoggedIn = !!token;

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '앱 열기',
      click: () => {
        if (isLoggedIn) {
          const mainWin = getMainWindow();
          if (mainWin && !mainWin.isDestroyed()) {
            if (!mainWin.isVisible()) mainWin.show();
            else mainWin.focus();
          } else {
            const newWin = createWindow();
            createTray(newWin);
          }
        } else {
          const loginWin = getLoginWindow();
          if (loginWin && !loginWin.isDestroyed()) {
            if (!loginWin.isVisible()) loginWin.show();
            else loginWin.focus();
          } else {
            const newLoginWin = createLoginWindow();
            createTray(newLoginWin);
          }
        }
      }
    },
    ...(isLoggedIn
      ? [{
           label: '로그아웃',
            click: () => {
              clearUserData();
              clearToken();

              const currentWin = getMainWindow() || getLoginWindow();
              if (currentWin && !currentWin.isDestroyed()) {
                app.isQuiting = true;
                currentWin.close();
              }

              const loginWin = createLoginWindow();
              destroyTray();
              createTray(loginWin);
            }
        }]
      : []),
    {
      label: '종료',
      click: () => {
        clearUserData();
        clearToken();
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Siri Tax 실행 중');
  tray.setContextMenu(contextMenu);
}

function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

module.exports = { createTray, destroyTray };
