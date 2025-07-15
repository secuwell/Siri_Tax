const axios = require('axios');
const { ipcMain } = require('electron');
const { createWindow, createLoginWindow , getLoginWindow, getMainWindow } = require('../windows'); 
const { createTray, destroyTray } = require('../tray');
const {
  setUser,
  getUser,
  clearUserData
} = require('../../config/secuerStore');
const { saveToken, clearToken } = require('../../config/secuerStore');

let loginWindow = null;
let mainWindow = null;

ipcMain.handle('login', async (event, user) => {
  try {
    const result = await axios.post('https://www.siri-erp.co.kr:8083/get/Login', user);
    const obj = result.data;
    if (obj.resultMsg === '성공') {
      saveToken(obj.token);
      setUser({
        id: user.ID,  
        email: obj.email,
        expire: obj.expire
      });
      loginWindow = getLoginWindow();
      if (loginWindow) loginWindow.close();
      destroyTray();
      mainWindow = createWindow();        
      createTray(mainWindow);  
      return { success: true, message: '로그인 성공' };
    } else {
      return { success: false, message: '등록되지 않은 아이디거나 아이디 또는 비밀번호를 잘못 입력했습니다.' };
    }
  } catch (error) {
    return { success: false, message: '로그인 중 오류가 발생했습니다. 관리자에게 문의하세요.' };
  }
});

ipcMain.handle('logout', async () => {
  clearUserData();
  destroyTray();
  clearToken();

  mainWindow = getMainWindow();
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
  createLoginWindow();
  createTray(loginWindow);

  return { success: true, message: '로그아웃 성공' };
});