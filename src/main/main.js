const { app, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const { createLoginWindow, createWindow } = require('../main/windows');
const { createTray } = require('../main/tray');
const { loadToken } = require('../config/secuerStore');

// 핸들러 등록
require('../main/windows');
require('../main/handlers/loginHandler');
require('../main/handlers/jsonHandler');
require('../main/handlers/fileHandler');
require('../main/handlers/userHandler')
require('../main/tray');

let tray = null;

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // 두 번째 실행 시, 기존 창을 다시 보여줌
    if (tray && tray.window && !tray.window.isDestroyed()) {
      tray.window.show();
      tray.window.focus();
    }
  });
}

app.whenReady().then( async () => {
  autoUpdater.autoDownload = false;
  
  autoUpdater.on('update-available', (info) => {
    const currentVersion = app.getVersion();
    dialog.showMessageBox({
      type: 'info',
      buttons: ['업데이트', '나중에'],
      title: 'Siri Tax 업데이트',
      message: '새로운 버전이 출시되었습니다.',
      detail: `현재 버전: ${currentVersion}\n최신 버전: ${info.version}\n\n업데이트를 진행하면 앱이 재시작됩니다.`,
    }).then(({ response }) => {
      if (response === 0) {
        autoUpdater.downloadUpdate();

        // 다운로드 중 안내창 (닫을 수 없는 정보창)
        dialog.showMessageBox({
          type: 'info',
          title: '업데이트 다운로드 중',
          message: '업데이트 파일을 다운로드하고 있습니다.\n잠시만 기다려 주세요.',
          buttons: [],
          noLink: true,
        });
      }
    });
  });

  autoUpdater.on('update-downloaded', () => {
    // 다운로드 완료 → 자동 종료 및 설치
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('error', (err) => {
    console.error('업데이트 에러:', err?.stack || err.toString());
  });

  // 항상 백그라운드에서 체크
  autoUpdater.checkForUpdates();

  // 창 생성
    try {
    const token = await loadToken();
    const gotTheLock = app.requestSingleInstanceLock();


    if (token) {
      const mainWindow = createWindow();
      tray = createTray(mainWindow);
    } else {
      const loginWindow = createLoginWindow();
      tray = createTray(loginWindow);
    }
  } catch (err) {
    console.error('토큰 로딩 중 오류 발생:', err);
    const loginWindow = createLoginWindow();
    tray = createTray(loginWindow);
  }
});



