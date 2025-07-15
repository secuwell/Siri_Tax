const { getUser } = require('../../config/secuerStore');
const { loadToken } = require('../../config/secuerStore');
const { ipcMain } = require('electron');

ipcMain.handle('get-token', () => {
  return loadToken(); 
});

ipcMain.handle('get-user', () => {
  return getUser();
});
